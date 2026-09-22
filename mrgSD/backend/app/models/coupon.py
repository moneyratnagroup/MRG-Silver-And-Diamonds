from sqlalchemy import Column, Integer, String, Float, Boolean, Date, Enum as SQLEnum
import enum
from app.database.database import Base

class CouponType(str, enum.Enum):
    percent = "percent"
    fixed = "fixed"

class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    type = Column(SQLEnum(CouponType), nullable=False)
    value = Column(Float, nullable=False)
    min_cart_value = Column(Float, nullable=True)
    expiry_date = Column(Date, nullable=True)
    is_active = Column(Boolean, default=True)
