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
    """
    Step 1: Check admin credentials. If valid, send OTP to admin phone number.
    """
    if request.username != settings.ADMIN_USERNAME or request.password != settings.ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    phone = settings.ADMIN_PHONE_NUMBER
    try:
        raw_otp = create_otp(db, phone)
        send_sms_otp(phone, raw_otp)
        db.commit()
    except OTPCooldownException as e:
        db.rollback()
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={
                "detail": "Please wait before requesting another OTP.",
                "retry_after": e.retry_after
            }
        )
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send admin OTP."
        )

    masked = f"+91 ******{phone[-4:]}" if len(phone) >= 4 else phone
    return AdminLoginResponse(
        message="OTP sent to admin phone number",
        phone_masked=masked
    )

@router.post("/verify-otp", response_model=AdminTokenResponse)
def admin_verify_otp(request: AdminVerifyOTPRequest, db: Session = Depends(get_db)):
    """
    Step 2: Verify the OTP sent to admin phone number. If valid, issue Admin JWT token.
    """
    if request.username != settings.ADMIN_USERNAME:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials"
        )
    
    phone = settings.ADMIN_PHONE_NUMBER
    otp_status = verify_otp(db, phone, request.otp)

    if otp_status == OTPStatus.NOT_FOUND:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No active OTP found. Please login again.")
    elif otp_status == OTPStatus.EXPIRED:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP has expired. Please request a new code.")
    elif otp_status == OTPStatus.USED:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP has already been used.")
    elif otp_status == OTPStatus.LOCKED:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Too many failed attempts. Please login again.")
    elif otp_status == OTPStatus.INVALID:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP code.")
    
    access_token = create_access_token(
        subject=settings.ADMIN_USERNAME,
        token_type="admin_access"
    )

    return AdminTokenResponse(
        access_token=access_token,
        token_type="bearer",
        role="admin"
    )

@router.get("/users", response_model=List[UserResponse])
def get_all_users(db: Session = Depends(get_db)):
    """
    Get all registered users for the admin dashboard.
    """
    users = db.query(User).order_by(User.created_at.desc()).all()
    return users
