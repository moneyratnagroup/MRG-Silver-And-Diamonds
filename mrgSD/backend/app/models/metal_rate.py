from sqlalchemy import Column, Integer, String, Boolean, Numeric, DateTime
from sqlalchemy.sql import func
from app.database.database import Base

class MetalRate(Base):
    __tablename__ = "metal_rates"

    id = Column(Integer, primary_key=True, index=True)
    metal_name = Column(String(50), nullable=False, index=True)
    metal_type = Column(String(20), nullable=False)
    purity = Column(String(20), nullable=False)
    unit = Column(String(20), nullable=False)
    rate = Column(Numeric(12, 2), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
