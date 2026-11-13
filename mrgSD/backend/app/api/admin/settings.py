from typing import Optional
import re
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field, field_validator
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database.database import get_db
from app.models.admin_account import AdminAccount
from app.core.admin_access import MODULES, current_admin, owner_only, hash_password, verify_password

router = APIRouter()


class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(min_length=10, max_length=128)


class StaffInput(BaseModel):
    username: str = Field(min_length=3, max_length=100, pattern=r"^[a-zA-Z0-9_.-]+$")
    full_name: str = Field(min_length=1, max_length=100)
    phone_number: str
    password: str = Field(min_length=10, max_length=128)
    permissions: list[str]

    @field_validator("phone_number")
    @classmethod
    def phone(cls, value):
        value = value.strip()
        if not re.fullmatch(r"\+[1-9]\d{7,14}", value):
            raise ValueError("Use international format, e.g. +919876543210")
        return value


class StaffUpdate(BaseModel):
    permissions: list[str]
    is_active: bool
    new_password: Optional[str] = Field(default=None, min_length=10, max_length=128)


def account_info(account):
    return {"id": account.id, "username": account.username, "full_name": account.full_name,
            "phone_number": account.phone_number, "is_owner": account.is_owner,
            "is_active": account.is_active,
            "permissions": list(MODULES) if account.is_owner else account.permissions}


def validate_permissions(permissions):
    if set(permissions) - MODULES.keys():
        raise HTTPException(422, "Unknown module permission")


@router.get("/me")
def me(account=Depends(current_admin)):
    return account_info(account)


@router.post("/password")
def change_password(data: PasswordChange, account=Depends(current_admin), db: Session = Depends(get_db)):
    if not verify_password(data.current_password, account.password_hash):
        raise HTTPException(400, "Current password is incorrect")
    if verify_password(data.new_password, account.password_hash):
        raise HTTPException(400, "Choose a different new password")
    account.password_hash = hash_password(data.new_password)
    account.token_version += 1
    db.commit()
    return {"message": "Password changed. Please log in again."}


@router.get("/staff")
def list_staff(owner=Depends(owner_only), db: Session = Depends(get_db)):
    return {"modules": MODULES, "accounts": [account_info(a) for a in db.query(AdminAccount).order_by(AdminAccount.id).all()]}


@router.post("/staff", status_code=201)
def add_staff(data: StaffInput, owner=Depends(owner_only), db: Session = Depends(get_db)):
    validate_permissions(data.permissions)
    account = AdminAccount(username=data.username, full_name=data.full_name.strip(),
                           phone_number=data.phone_number, password_hash=hash_password(data.password),
                           permissions=sorted(set(data.permissions)), is_owner=False, is_active=True)
    db.add(account)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "Username or phone number is already in use")
    db.refresh(account)
    return account_info(account)


@router.patch("/staff/{account_id}")
def update_staff(account_id: int, data: StaffUpdate, owner=Depends(owner_only), db: Session = Depends(get_db)):
    validate_permissions(data.permissions)
    account = db.get(AdminAccount, account_id)
    if not account:
        raise HTTPException(404, "Staff account not found")
    if account.is_owner:
        raise HTTPException(403, "The main administrator cannot be changed here")
    account.permissions = sorted(set(data.permissions))
    account.is_active = data.is_active
    if data.new_password:
        account.password_hash = hash_password(data.new_password)
    account.token_version += 1
    db.commit()
    db.refresh(account)
    return account_info(account)
