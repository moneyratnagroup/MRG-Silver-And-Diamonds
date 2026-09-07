from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from app.database.database import get_db
from app.schemas.auth import SendOTPRequest, SendOTPResponse, VerifyOTPRequest, VerifyOTPResponse, CompleteProfileRequest, TokenResponse, UserResponse, UpdateKYCRequest, UpdateProfileRequest, AddressCreate, AddressResponse
from app.models.address import UserAddress
from typing import List
from app.services.otp_service import create_otp, OTPCooldownException, verify_otp, OTPStatus
from app.services.sms_service import send_sms_otp
from app.models.user import User
from app.core.security import create_access_token, decode_access_token, get_current_user
from app.core.config import settings

router = APIRouter()

@router.post("/send-otp", response_model=SendOTPResponse)
def send_otp(request: SendOTPRequest, db: Session = Depends(get_db)):
    """
    Generate and send a secure OTP to the provided phone number.
    Enforces a cooldown period between requests.
    """
    phone = request.phone_number 
    
    try:
        raw_otp = create_otp(db, phone)
        # Hand off to the SMS service
        send_sms_otp(phone, raw_otp)
        # Commit the transaction only if SMS delivery succeeds
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
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal database error occurred."
        )
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send OTP. Please try again later."
        )
    
    return SendOTPResponse(
        message="OTP sent successfully",
        expires_in=settings.OTP_EXPIRY_MINUTES * 60
    )

from datetime import datetime, timezone

@router.post("/verify-otp", response_model=VerifyOTPResponse)
def verify_otp_endpoint(request: VerifyOTPRequest, db: Session = Depends(get_db)):
    """
    Verifies a user-provided OTP.
    Returns access token for existing users, or verification token for new users.
    """
    phone = request.phone_number
    code = request.code
    
    # 1. Verify the OTP using the service layer
    status_result = verify_otp(db, phone, code)
    
    # 2. Handle invalid states (Service layer handles the attempts increment)
    if status_result == OTPStatus.NOT_FOUND:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP")
    elif status_result == OTPStatus.EXPIRED:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP has expired")
    elif status_result == OTPStatus.USED:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP has already been used")
    elif status_result == OTPStatus.LOCKED:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Maximum verification attempts reached. Please request a new OTP.")
    elif status_result == OTPStatus.INVALID:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP")
        
    # 3. Valid OTP - Check if user exists
    user = db.query(User).filter(User.phone_number == phone).first()
    
    if user:
        # Existing user - grant standard access token and update last login
        user.last_login_at = datetime.now(timezone.utc)
        db.commit()
        
        access_token = create_access_token(subject=str(user.id), token_type="access")
        return VerifyOTPResponse(
            is_new_user=False,
            access_token=access_token,
            token_type="bearer",
            user=user
        )
    else:
        # New user - grant temporary verification token for profile completion
        # Subject is the phone number because they don't have a DB ID yet
        from datetime import timedelta
        expires = timedelta(minutes=15)
        verification_token = create_access_token(subject=phone, expires_delta=expires, token_type="verification")
        return VerifyOTPResponse(
            is_new_user=True,
            verification_token=verification_token
        )

@router.post("/complete-profile", response_model=TokenResponse)
def complete_profile(request: CompleteProfileRequest, db: Session = Depends(get_db)):
    """
    Completes registration for a new customer using a temporary verification token.
    Returns a standard access token upon successful registration.
    """
    # 1. Decode and securely validate the verification token
    payload = decode_access_token(request.verification_token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid or expired verification token"
        )
        
    phone = payload.get("sub")
    token_type = payload.get("type")
    
    # Strictly enforce token type separation - an access token CANNOT be used here
    if not phone or token_type != "verification":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid token type provided"
        )
        
    # 2. Guard against race conditions or double registrations
    existing_user = db.query(User).filter(User.phone_number == phone).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="This phone number is already registered. Please log in instead."
        )
        
    # Optional: ensure email isn't already claimed by another user
    if request.email:
        email_check = db.query(User).filter(User.email == request.email).first()
        if email_check:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="This email address is already in use by another account."
            )
            
    # 3. Safely create the User record
    new_user = User(
        phone_number=phone,
        full_name=request.full_name,
        email=request.email,
        is_active=True,
        last_login_at=datetime.now(timezone.utc)
    )
    db.add(new_user)
    
    try:
        db.commit()
        db.refresh(new_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Account already exists or email is taken. Please log in."
        )
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Failed to register user account."
        )
        
    # 4. Generate normal access token for the newly minted user
    access_token = create_access_token(subject=str(new_user.id), token_type="access")
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=new_user
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Returns the currently authenticated user's profile.
    Requires a valid access token.
    """
    return current_user

@router.put("/me/kyc", response_model=UserResponse)
def update_kyc(request: UpdateKYCRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Updates the currently authenticated user's KYC details (PAN/Aadhar).
    """
    if request.pan_number is not None:
        current_user.pan_number = request.pan_number
    if request.aadhar_number is not None:
        current_user.aadhar_number = request.aadhar_number
        
    try:
        db.commit()
        db.refresh(current_user)
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update KYC details."
        )
        
    return current_user

@router.put("/me/profile", response_model=UserResponse)
def update_profile(request: UpdateProfileRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Updates the currently authenticated user's profile details.
    """
    if request.email and request.email != current_user.email:
        email_check = db.query(User).filter(User.email == request.email).first()
        if email_check:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="This email address is already in use by another account."
            )
            
    current_user.full_name = request.full_name
    current_user.email = request.email
    current_user.dob = request.dob
    current_user.gender = request.gender
    current_user.marital_status = request.marital_status
    current_user.anniversary_date = request.anniversary_date
        
    try:
        db.commit()
        db.refresh(current_user)
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update profile details."
        )
        
    return current_user

@router.get("/me/addresses", response_model=List[AddressResponse])
def get_addresses(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Get all saved addresses for the current user.
    """
    addresses = db.query(UserAddress).filter(UserAddress.user_id == current_user.id).order_by(UserAddress.is_default.desc(), UserAddress.created_at.desc()).all()
    return addresses

@router.post("/me/addresses", response_model=AddressResponse)
def create_address(request: AddressCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Add a new address for the current user.
    """
    if request.is_default:
        db.query(UserAddress).filter(UserAddress.user_id == current_user.id).update({"is_default": False})
        
    new_address = UserAddress(
        user_id=current_user.id,
        title=request.title,
        address_line_1=request.address_line_1,
        address_line_2=request.address_line_2,
        landmark=request.landmark,
        city=request.city,
        state=request.state,
        zip_code=request.zip_code,
        country=request.country,
        is_default=request.is_default
    )
    db.add(new_address)
    
    try:
        db.commit()
        db.refresh(new_address)
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to add address."
        )
        
    return new_address

@router.delete("/me/addresses/{address_id}")
def delete_address(address_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Delete an address.
    """
    address = db.query(UserAddress).filter(UserAddress.id == address_id, UserAddress.user_id == current_user.id).first()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
        
    db.delete(address)
    try:
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete address."
        )
        
    return {"message": "Address deleted successfully"}

@router.get("/admin/users", response_model=List[UserResponse])
def get_all_users(db: Session = Depends(get_db)):
    """
    Get all registered users for the admin dashboard.
    """
    users = db.query(User).order_by(User.created_at.desc()).all()
    return users
