from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TestimonialBase(BaseModel):
    customer_name: str
    location: Optional[str] = None
    image_key: Optional[str] = None
    rating: int
    message: str
    is_active: Optional[bool] = True
    display_order: Optional[int] = 0
    admin_notes: Optional[str] = None

class TestimonialCreate(TestimonialBase):
    pass

class TestimonialUpdate(TestimonialBase):
    customer_name: Optional[str] = None
    rating: Optional[int] = None
    message: Optional[str] = None

class TestimonialResponse(TestimonialBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
