from app.services.admin_login import login as account_login, verify as account_verify
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.schemas.auth import (
    AdminLoginRequest, AdminLoginResponse, 
    AdminVerifyOTPRequest, AdminTokenResponse,
    UserResponse
)
from app.models.user import User
from app.services.otp_service import create_otp, OTPCooldownException, verify_otp, OTPStatus
from app.services.sms_service import send_sms_otp
from app.core.security import create_access_token
from app.core.config import settings

router = APIRouter()

@router.post("/login", response_model=AdminLoginResponse)
def admin_login(request: AdminLoginRequest, db: Session = Depends(get_db)):
    return account_login(request, db)

@router.post("/verify-otp", response_model=AdminTokenResponse)
def admin_verify_otp(request: AdminVerifyOTPRequest, db: Session = Depends(get_db)):
    return account_verify(request, db)

@router.get("/users", response_model=List[UserResponse])
def get_all_users(db: Session = Depends(get_db)):
    """
    Get all registered users for the admin dashboard.
    """
    users = db.query(User).order_by(User.created_at.desc()).all()
    return users
