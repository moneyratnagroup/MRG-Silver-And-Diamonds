from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from enum import Enum

class CouponType(str, Enum):
    percent = "percent"
    fixed = "fixed"

class CouponBase(BaseModel):
    code: str
    type: CouponType
    value: float
    min_cart_value: Optional[float] = None
    expiry_date: Optional[date] = None
    is_active: bool = True

class CouponCreate(CouponBase):
    pass

class CouponUpdate(BaseModel):
    code: Optional[str] = None
    type: Optional[CouponType] = None
    value: Optional[float] = None
    min_cart_value: Optional[float] = None
    expiry_date: Optional[date] = None
    is_active: Optional[bool] = None

class CouponResponse(CouponBase):
    id: int

    class Config:
        from_attributes = True
