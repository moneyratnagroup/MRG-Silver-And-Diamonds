import secrets
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.models.otp import OTPCode
from app.core.config import settings
from enum import Enum

import bcrypt

class OTPStatus(str, Enum):
    VALID = "valid"
    INVALID = "invalid"
    EXPIRED = "expired"
    USED = "used"
    LOCKED = "locked"
    NOT_FOUND = "not_found"

def get_otp_hash(otp: str) -> str:
    # Use direct bcrypt library to avoid passlib version incompatibilities
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(otp.encode('utf-8'), salt).decode('utf-8')

def verify_otp_hash(plain_otp: str, hashed_otp: str) -> bool:
    try:
        return bcrypt.checkpw(plain_otp.encode('utf-8'), hashed_otp.encode('utf-8'))
    except Exception:
        return False

def generate_otp() -> str:
    """Generate a secure numeric OTP using cryptographically strong randomness."""
    return "".join(str(secrets.randbelow(10)) for _ in range(settings.OTP_LENGTH))

class OTPCooldownException(Exception):
    def __init__(self, retry_after: int):
        self.retry_after = retry_after

def create_otp(db: Session, phone_number: str) -> str:
    """
    Checks cooldown, invalidates existing active OTPs, generates a new one, hashes it,
    and stores it in the database. Returns the raw OTP for delivery.
    Raises OTPCooldownException if requested too soon.
    """
    # Check cooldown
    last_otp = db.query(OTPCode).filter(
        OTPCode.phone_number == phone_number
    ).order_by(OTPCode.created_at.desc()).first()
    
    if last_otp:
        now = datetime.now(timezone.utc)
        created_at = last_otp.created_at
        if created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=timezone.utc)
            
        elapsed = (now - created_at).total_seconds()
        if elapsed < settings.OTP_RESEND_COOLDOWN_SECONDS:
            retry_after = int(settings.OTP_RESEND_COOLDOWN_SECONDS - elapsed)
            raise OTPCooldownException(retry_after)

    # Invalidate previous OTPs for this number
    db.query(OTPCode).filter(
        OTPCode.phone_number == phone_number,
        OTPCode.is_used == False
    ).update({"is_used": True})
    
    raw_otp = generate_otp()
    hashed_otp = get_otp_hash(raw_otp)
    
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.OTP_EXPIRY_MINUTES)
    
    new_otp = OTPCode(
        phone_number=phone_number,
        otp_hash=hashed_otp,
        expires_at=expires_at,
        attempts=0,
        is_used=False
    )
    
    db.add(new_otp)
    db.flush()
    
    return raw_otp

def verify_otp(db: Session, phone_number: str, code: str) -> OTPStatus:
    """
    Verifies a user-provided OTP against the stored hash.
    Enforces expiration, single-use, and max verification attempts.
    """
    # Retrieve the most recent OTP and lock the row to prevent race conditions
    db_otp = db.query(OTPCode).filter(
        OTPCode.phone_number == phone_number
    ).order_by(OTPCode.created_at.desc()).with_for_update().first()
    
    if not db_otp:
        return OTPStatus.NOT_FOUND
        
    if db_otp.is_used:
        return OTPStatus.USED
        
    if db_otp.attempts >= settings.OTP_MAX_ATTEMPTS:
        return OTPStatus.LOCKED
        
    # Verify expiration (accounting for naive/aware timezone differences from DB)
    now = datetime.now(timezone.utc)
    expires_at = db_otp.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
        
    if expires_at < now:
        return OTPStatus.EXPIRED
        
    # Increment the attempts counter
    db_otp.attempts += 1
    
    # Check if the code matches the secure hash
    if not verify_otp_hash(code, db_otp.otp_hash):
        db.commit()
        return OTPStatus.INVALID
        
    # It's a valid OTP. Mark it as used.
    db_otp.is_used = True
    db.commit()
    
    return OTPStatus.VALID
