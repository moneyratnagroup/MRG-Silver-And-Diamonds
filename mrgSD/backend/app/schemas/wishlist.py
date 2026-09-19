from pydantic import BaseModel
from datetime import datetime
from app.schemas.product import Product

class WishlistItemBase(BaseModel):
    product_id: int

class WishlistItemCreate(WishlistItemBase):
    pass

class WishlistItem(WishlistItemBase):
    id: int
    user_id: int
    created_at: datetime
    product: Product

    class Config:
        from_attributes = True
