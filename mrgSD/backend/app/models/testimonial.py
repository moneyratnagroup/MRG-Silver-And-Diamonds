from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.database.database import Base

class Testimonial(Base):
    __tablename__ = "testimonials"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String, index=True, nullable=False)
    location = Column(String, nullable=True)
    image_key = Column(String, nullable=True)
    rating = Column(Integer, nullable=False)
    message = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)
    admin_notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
