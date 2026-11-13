"""Run from backend: python -m unittest discover -s tests -v.

Uses an isolated in-memory database and mocks SMS; never connects to the app database.
"""
import os
os.environ["DATABASE_URL"] = "sqlite://"

import unittest
from unittest.mock import patch
from types import SimpleNamespace
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from starlette.requests import Request
from fastapi import HTTPException
from app.models.admin_account import AdminAccount
import app.models.address
from app.core.admin_access import bootstrap_owner, current_admin, enforce_admin_access, hash_password, verify_password
from app.core.security import create_access_token
from app.api.admin.settings import StaffInput, StaffUpdate, PasswordChange, add_staff, update_staff, change_password
from app.services.admin_login import login, verify
from app.services.otp_service import OTPStatus


class AdminAccessTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite://")
        AdminAccount.__table__.create(self.engine)
        self.db = Session(self.engine)
        bootstrap_owner(self.db)
        self.owner = self.db.query(AdminAccount).filter_by(is_owner=True).one()
        data = StaffInput(username="reviewer", full_name="Review staff", phone_number="+919876543210",
                          password="staff-password-123", permissions=["reviews"])
        self.staff_id = add_staff(data, self.owner, self.db)["id"]
        self.staff = self.db.get(AdminAccount, self.staff_id)

    def tearDown(self):
        self.db.close()
        self.engine.dispose()

    def request(self, path, account=None, method="GET", query=""):
        headers = []
        if account:
            token = create_access_token(account.username, token_type="admin_access",
                                        extra_claims={"version": account.token_version})
            headers = [(b"authorization", f"Bearer {token}".encode())]
        return Request({"type": "http", "method": method, "path": path,
                        "query_string": query.encode(), "headers": headers})

    def test_passwords_are_hashed_and_checked(self):
        self.assertNotIn("staff-password", self.staff.password_hash)
        self.assertTrue(verify_password("staff-password-123", self.staff.password_hash))
        self.assertFalse(verify_password("incorrect", self.staff.password_hash))

    def test_owner_bootstrap_does_not_overwrite_password(self):
        self.owner.password_hash = hash_password("changed-password")
        self.db.commit()
        bootstrap_owner(self.db)
        self.assertTrue(verify_password("changed-password", self.owner.password_hash))
        self.assertEqual(self.db.query(AdminAccount).filter_by(is_owner=True).count(), 1)

    def test_module_permissions_on_admin_and_shared_apis(self):
        enforce_admin_access(self.request("/api/v1/admin/reviews/", self.staff), self.db)
        for path, method in [("/api/v1/admin/products/", "GET"), ("/api/v1/products/", "POST"),
                             ("/api/v1/auth/admin/users", "GET"), ("/api/v1/metal-rates/1", "DELETE")]:
            with self.subTest(path=path), self.assertRaises(HTTPException) as exc:
                enforce_admin_access(self.request(path, self.staff, method), self.db)
            self.assertEqual(exc.exception.status_code, 403)
        enforce_admin_access(self.request("/api/v1/products/", self.owner, "POST"), self.db)
        enforce_admin_access(self.request("/api/v1/products/"), self.db)

    def test_anonymous_admin_api_is_rejected(self):
        with self.assertRaises(HTTPException) as exc:
            enforce_admin_access(self.request("/api/v1/admin/reviews/"), self.db)
        self.assertEqual(exc.exception.status_code, 401)

    def test_inactive_product_query_variants_are_protected(self):
        for query in ["include_inactive=TRUE", "include_inactive=1", "status=all", "status=DRAFT", "status="]:
            with self.subTest(query=query), self.assertRaises(HTTPException):
                enforce_admin_access(self.request("/api/v1/products/", query=query), self.db)

    def test_inventory_staff_can_read_product_inventory(self):
        self.staff.permissions = ["inventory"]
        self.db.commit()
        enforce_admin_access(self.request("/api/v1/products/", self.staff, query="status=ALL"), self.db)
        with self.assertRaises(HTTPException):
            enforce_admin_access(self.request("/api/v1/products/", self.staff, "POST"), self.db)

    def test_owner_can_reset_staff_password_and_revoke_session(self):
        request = self.request("/api/v1/admin/settings/me", self.staff)
        update_staff(self.staff_id, StaffUpdate(permissions=["reviews"], is_active=True,
                     new_password="reset-password-123"), self.owner, self.db)
        self.assertTrue(verify_password("reset-password-123", self.staff.password_hash))
        with self.assertRaises(HTTPException):
            current_admin(request, self.db)

    def test_wrong_current_password_does_not_change_password(self):
        original = self.staff.password_hash
        with self.assertRaises(HTTPException):
            change_password(PasswordChange(current_password="wrong", new_password="new-password-123"), self.staff, self.db)
        self.assertEqual(original, self.staff.password_hash)

    def test_staff_cannot_manage_accounts(self):
        from app.core.admin_access import owner_only
        with self.assertRaises(HTTPException) as exc:
            owner_only(self.staff)
        self.assertEqual(exc.exception.status_code, 403)

    def test_password_change_invalidates_existing_sessions(self):
        request = self.request("/api/v1/admin/settings/me", self.staff)
        change_password(PasswordChange(current_password="staff-password-123", new_password="new-password-123"), self.staff, self.db)
        with self.assertRaises(HTTPException):
            current_admin(request, self.db)
        self.assertTrue(verify_password("new-password-123", self.staff.password_hash))

    def test_deactivation_and_permission_change_revoke_sessions(self):
        request = self.request("/api/v1/admin/reviews/", self.staff)
        update_staff(self.staff_id, StaffUpdate(permissions=[], is_active=False), self.owner, self.db)
        with self.assertRaises(HTTPException):
            current_admin(request, self.db)

    def test_owner_cannot_be_deactivated(self):
        with self.assertRaises(HTTPException):
            update_staff(self.owner.id, StaffUpdate(permissions=[], is_active=False), self.owner, self.db)

    def test_duplicate_staff_and_unknown_modules_rejected(self):
        with self.assertRaises(HTTPException) as exc:
            add_staff(StaffInput(username="another", full_name="Another", phone_number=self.staff.phone_number,
                                password="another-password", permissions=[]), self.owner, self.db)
        self.assertEqual(exc.exception.status_code, 409)
        with self.assertRaises(HTTPException):
            update_staff(self.staff_id, StaffUpdate(permissions=["settings"], is_active=True), self.owner, self.db)

    def test_login_requires_password_and_signed_challenge(self):
        with self.assertRaises(HTTPException):
            login(SimpleNamespace(username="reviewer", password="wrong"), self.db)
        with patch("app.services.admin_login.create_otp", return_value="123456"), patch("app.services.admin_login.send_sms_otp") as sms:
            result = login(SimpleNamespace(username="reviewer", password="staff-password-123"), self.db)
            sms.assert_called_once_with(self.staff.phone_number, "123456")
        with patch("app.services.admin_login.verify_otp", return_value=OTPStatus.VALID):
            result = verify(SimpleNamespace(username="reviewer", challenge=result["challenge"], otp="123456"), self.db)
        request = Request({"type": "http", "headers": [(b"authorization", f'Bearer {result["access_token"]}'.encode())]})
        self.assertEqual(current_admin(request, self.db).id, self.staff_id)
        with self.assertRaises(HTTPException):
            verify(SimpleNamespace(username="reviewer", challenge="invalid", otp="123456"), self.db)


if __name__ == "__main__":
    unittest.main()
