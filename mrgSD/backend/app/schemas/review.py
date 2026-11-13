from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ReviewCreate(BaseModel):
    product_id: int
    rating: int = Field(..., ge=1, le=5)
    title: str = Field(..., min_length=1, max_length=255)
    comment: str = Field(..., min_length=1)
    image_url: Optional[str] = None

class ReviewItem(BaseModel):
    id: int
    product_id: int
    user_name: str
    rating: int
    title: str
    comment: str
    image_url: Optional[str] = None
    admin_reply: Optional[str] = None
    admin_replied_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ProductReviewsResponse(BaseModel):
    average_rating: float
    total_reviews: int
    reviews: List[ReviewItem]

class AdminReviewItem(BaseModel):
    admin_reply_hidden: bool = False
    id: int
    product_id: int
    product_name: str
    product_image: Optional[str] = None
    user_id: Optional[int] = None
    user_name: str
    rating: int
    title: str
    comment: str
    image_url: Optional[str] = None
    is_approved: bool
    admin_reply: Optional[str] = None
    admin_replied_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ReviewStatusUpdate(BaseModel):
    is_approved: bool

class ReviewReplyRequest(BaseModel):
    admin_reply: Optional[str] = None

class ReviewReplyVisibilityUpdate(BaseModel):
    admin_reply_hidden: bool
