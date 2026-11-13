import hashlib
import hmac
import secrets
from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.admin_account import AdminAccount
from app.core.config import settings
from app.core.security import decode_access_token

MODULES = {
    "dashboard": "Dashboard", "orders": "Orders", "inventory": "Inventory",
    "homepage": "Homepage", "rates": "Metal Rates", "products": "Products",
    "users": "Customers", "testimonials": "Testimonials", "reviews": "Product Reviews",
    "coupons": "Coupons",
}


def hash_password(password):
    salt = secrets.token_hex(16)
    digest = hashlib.scrypt(password.encode(), salt=salt.encode(), n=16384, r=8, p=1).hex()
    return f"scrypt${salt}${digest}"


def verify_password(password, encoded):
    try:
        algorithm, salt, digest = encoded.split("$")
        if algorithm != "scrypt":
            return False
        actual = hashlib.scrypt(password.encode(), salt=salt.encode(), n=16384, r=8, p=1).hex()
        return hmac.compare_digest(actual, digest)
    except (ValueError, TypeError):
        return False


def bootstrap_owner(db):
    # Called at startup only; later password changes live in the database.
    if not db.query(AdminAccount).filter(AdminAccount.is_owner == True).first():
        db.add(AdminAccount(username=settings.ADMIN_USERNAME, full_name="Main administrator",
                            phone_number=settings.ADMIN_PHONE_NUMBER,
                            password_hash=hash_password(settings.ADMIN_PASSWORD),
                            is_owner=True, is_active=True, permissions=list(MODULES)))
        db.commit()


def current_admin(request: Request, db: Session = Depends(get_db)):
    authorization = request.headers.get("Authorization", "")
    scheme, _, token = authorization.partition(" ")
    payload = decode_access_token(token) if scheme.lower() == "bearer" else None
    if not payload or payload.get("type") != "admin_access":
        raise HTTPException(401, "Please log in as an administrator")
    account = db.query(AdminAccount).filter(AdminAccount.username == payload.get("sub")).first()
    if not account or not account.is_active or payload.get("version") != account.token_version:
        raise HTTPException(401, "Your session has expired. Please log in again")
    return account


def owner_only(account: AdminAccount = Depends(current_admin)):
    if not account.is_owner:
        raise HTTPException(403, "Only the main administrator can manage staff")
    return account


def enforce_admin_access(request: Request, db: Session = Depends(get_db)):
    path = request.url.path.rstrip("/")
    method = request.method
    if method == "OPTIONS":
        return
    login_paths = {"/api/v1/auth/admin/login", "/api/v1/auth/admin/verify-otp",
                   "/api/v1/admin/auth/login", "/api/v1/admin/auth/verify-otp"}
    if path in login_paths:
        return
    module = None
    if path.startswith("/api/v1/admin/"):
        part = path.split("/")[4]
        module = {"metal-rates": "rates", "banners": "homepage", "auth": "users"}.get(part, part)
        if part == "settings":
            current_admin(request, db)
            return
    elif path == "/api/v1/auth/admin/users":
        module = "users"
    elif path.startswith("/api/v1/"):
        part = path.split("/")[3]
        mutations = {"products": "products", "metal-rates": "rates", "banners": "homepage",
                     "testimonials": "testimonials", "coupons": "coupons"}
        if method not in {"GET", "HEAD"}:
            module = mutations.get(part)
        # Admin-only listing; public product reads stay available.
        include_inactive = request.query_params.get("include_inactive", "").lower() in {"1", "true", "yes", "on"}
        unpublished_status = request.query_params.get("status", "PUBLISHED").upper() != "PUBLISHED"
        if part == "products" and (include_inactive or unpublished_status):
            module = "products"
        if part == "coupons" and request.headers.get("Authorization", ""):
            payload = decode_access_token(request.headers["Authorization"].removeprefix("Bearer "))
            if payload and payload.get("type") == "admin_access":
                module = "coupons"
        if part == "upload" and method == "POST":
            payload = decode_access_token(request.headers.get("Authorization", "").removeprefix("Bearer "))
            if payload and payload.get("type") == "admin_access":
                account = current_admin(request, db)
                if not account.is_owner and not set(account.permissions).intersection({"products", "homepage", "testimonials", "reviews"}):
                    raise HTTPException(403, "No permission to upload images")
            return
    if module:
        account = current_admin(request, db)
        allowed = {module}
        if module == "products" and method in {"GET", "HEAD"}:
            allowed.add("inventory")
        if module == "coupons" and method in {"GET", "HEAD"}:
            allowed.add("products")
        if not account.is_owner and not allowed.intersection(account.permissions):
            raise HTTPException(403, "You do not have access to this module")
