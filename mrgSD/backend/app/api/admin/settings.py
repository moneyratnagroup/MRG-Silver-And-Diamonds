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


def validate_admin_phone(value: str) -> str:
    value = value.strip()
    cleaned = re.sub(r"[^\d+]", "", value)
    
    ten_digits = None
    if cleaned.startswith("+91") and len(cleaned) == 13 and cleaned[3:].isdigit():
        ten_digits = cleaned[3:]
    elif cleaned.startswith("91") and len(cleaned) == 12 and cleaned[2:].isdigit():
        ten_digits = cleaned[2:]
    elif len(cleaned) == 10 and cleaned.isdigit():
        ten_digits = cleaned
    elif re.fullmatch(r"\+[1-9]\d{7,14}", cleaned):
        digits_only = re.sub(r"\D", "", cleaned)
        if len(set(digits_only)) <= 1 or "00000" in digits_only:
            raise ValueError("Mobile number cannot consist of all zeroes or repetitive dummy digits")
        return cleaned
    else:
        raise ValueError("Mobile number must be a valid 10-digit number")

    if not re.match(r"^[6-9]\d{9}$", ten_digits):
        raise ValueError("Mobile number must be a 10-digit number starting with 6, 7, 8, or 9")

    if len(set(ten_digits)) <= 1:
        raise ValueError("Mobile number cannot consist of all zeroes or repetitive digits")

    if "00000" in ten_digits:
        raise ValueError("Mobile number cannot contain an excessive sequence of zeroes")

    return "+91" + ten_digits


def validate_strong_password(value: str) -> str:
    if len(value) < 8:
        raise ValueError("Password must be at least 8 characters long")
    if len(value) > 128:
        raise ValueError("Password must not exceed 128 characters")
    if not re.search(r"[A-Z]", value):
        raise ValueError("Password must contain at least one uppercase letter (A-Z)")
    if not re.search(r"\d", value):
        raise ValueError("Password must contain at least one digit (0-9)")
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>\-_=+/~`[\]\\;]", value):
        raise ValueError("Password must contain at least one special character")
    return value


class PasswordChange(BaseModel):
    current_password: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def check_password(cls, value):
        return validate_strong_password(value)


class StaffInput(BaseModel):
    username: str = Field(min_length=3, max_length=100, pattern=r"^[a-zA-Z0-9_.-]+$")
    full_name: str = Field(min_length=1, max_length=100)
    phone_number: str
    password: str
    permissions: list[str]

    @field_validator("phone_number")
    @classmethod
    def phone(cls, value):
        return validate_admin_phone(value)

    @field_validator("password")
    @classmethod
    def check_password(cls, value):
        return validate_strong_password(value)


class StaffUpdate(BaseModel):
    permissions: Optional[list[str]] = None
    is_active: Optional[bool] = None
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    new_password: Optional[str] = None

    @field_validator("phone_number")
    @classmethod
    def phone(cls, value):
        if value is not None and value.strip() != "":
            return validate_admin_phone(value)
        return None

    @field_validator("new_password")
    @classmethod
    def check_new_password(cls, value):
        if value is not None and value.strip() != "":
            return validate_strong_password(value)
        return None


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
    account = db.get(AdminAccount, account_id)
    if not account:
        raise HTTPException(404, "Staff account not found")
    if account.is_owner:
        raise HTTPException(403, "The main administrator cannot be changed here")
    if data.permissions is not None:
        validate_permissions(data.permissions)
        account.permissions = sorted(set(data.permissions))
    if data.is_active is not None:
        account.is_active = data.is_active
    if data.full_name is not None and data.full_name.strip():
        account.full_name = data.full_name.strip()
    if data.phone_number is not None and data.phone_number.strip():
        account.phone_number = data.phone_number
    if data.new_password:
        account.password_hash = hash_password(data.new_password)
    account.token_version += 1
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "Phone number is already in use by another account")
    db.refresh(account)
    return account_info(account)


@router.delete("/staff/{account_id}")
def delete_staff(account_id: int, owner=Depends(owner_only), db: Session = Depends(get_db)):
    account = db.get(AdminAccount, account_id)
    if not account:
        raise HTTPException(404, "Staff account not found")
    if account.is_owner:
        raise HTTPException(400, "The main administrator account cannot be deleted")
    db.delete(account)
    db.commit()
    return {"message": f"Staff account '{account.username}' deleted successfully"}
