import re
from typing import Optional
from datetime import datetime, date
from pydantic import BaseModel, ConfigDict, field_validator

def validate_indian_phone(value: str) -> str:
    """
    Validates and normalizes an Indian phone number to +91XXXXXXXXXX format.
    """
    cleaned = re.sub(r'[^\d+]', '', value)
    
    if cleaned.startswith('+91'):
        if len(cleaned) == 13:
            return cleaned
        raise ValueError('Invalid Indian phone number length')
    
    if cleaned.startswith('91') and len(cleaned) == 12:
        return '+' + cleaned
        
    if len(cleaned) == 10 and cleaned.isdigit():
        return '+91' + cleaned
        
    raise ValueError('Invalid Indian phone number format. Must be a 10-digit number.')

class SendOTPRequest(BaseModel):
    phone_number: str

    @field_validator('phone_number')
    @classmethod
    def validate_phone(cls, v: str) -> str:
        return validate_indian_phone(v)

class SendOTPResponse(BaseModel):
    message: str
    expires_in: int

class VerifyOTPRequest(BaseModel):
    phone_number: str
    code: str

    @field_validator('phone_number')
    @classmethod
    def validate_phone(cls, v: str) -> str:
        return validate_indian_phone(v)
        
    @field_validator('code')
    @classmethod
    def validate_code(cls, v: str) -> str:
        if not v.isdigit():
            raise ValueError('OTP must contain numbers only')
        if len(v) != 6:
            raise ValueError('OTP must be exactly 6 digits')
        return v

class CompleteProfileRequest(BaseModel):
    full_name: str
    email: Optional[str] = None
    verification_token: str

    @field_validator('full_name')
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError('Full name cannot be empty')
        if len(v) > 100:
            raise ValueError('Full name must not exceed 100 characters')
        return v

    @field_validator('email')
    @classmethod
    def validate_email(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        v = v.strip().lower()
        if v == "":
            return None
        if len(v) > 255:
            raise ValueError('Email must not exceed 255 characters')
        if not re.match(r"[^@]+@[^@]+\.[^@]+", v):
            raise ValueError('Invalid email format')
        return v

class UserResponse(BaseModel):
    id: int
    phone_number: str
    full_name: Optional[str] = None
    email: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_login_at: Optional[datetime] = None
    pan_number: Optional[str] = None
    aadhar_number: Optional[str] = None
    dob: Optional[date] = None
    gender: Optional[str] = None
    marital_status: Optional[str] = None
    anniversary_date: Optional[date] = None

    model_config = ConfigDict(from_attributes=True)

class VerifyOTPResponse(BaseModel):
    is_new_user: bool
    access_token: Optional[str] = None
    token_type: Optional[str] = None
    user: Optional[UserResponse] = None
    verification_token: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class UpdateKYCRequest(BaseModel):
    pan_number: Optional[str] = None
    aadhar_number: Optional[str] = None

    @field_validator('pan_number')
    @classmethod
    def validate_pan(cls, v: Optional[str]) -> Optional[str]:
        if not v:
            return None
        v = v.strip().upper()
        if not re.match(r"^[A-Z]{5}[0-9]{4}[A-Z]{1}$", v):
            raise ValueError('Invalid PAN format')
        return v

    @field_validator('aadhar_number')
    @classmethod
    def validate_aadhar(cls, v: Optional[str]) -> Optional[str]:
        if not v:
            return None
        v = v.strip()
        if not re.match(r"^\d{12}$", v):
            raise ValueError('Aadhar must be a 12-digit number')
        return v



class UpdateProfileRequest(BaseModel):
    full_name: str
    email: Optional[str] = None
    dob: Optional[date] = None
    gender: Optional[str] = None
    marital_status: Optional[str] = None
    anniversary_date: Optional[date] = None

    @field_validator('full_name')
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError('Full name cannot be empty')
        if len(v) > 100:
            raise ValueError('Full name must not exceed 100 characters')
        return v

    @field_validator('email')
    @classmethod
    def validate_email(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        v = v.strip().lower()
        if v == "":
            return None
        if len(v) > 255:
            raise ValueError('Email must not exceed 255 characters')
        if not re.match(r"[^@]+@[^@]+\.[^@]+", v):
            raise ValueError('Invalid email format')
        return v

class AddressBase(BaseModel):
    title: Optional[str] = "Home"
    address_line_1: str
    address_line_2: Optional[str] = None
    landmark: Optional[str] = None
    city: str
    state: str
    zip_code: str
    country: Optional[str] = "India"
    is_default: Optional[bool] = False

class AddressCreate(AddressBase):
    pass

class AddressResponse(AddressBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
