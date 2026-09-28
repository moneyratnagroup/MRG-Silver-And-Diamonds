from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .product import Product

class CartItemBase(BaseModel):
    product_id: int
    quantity: int = 1

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: int

class CartItemResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    quantity: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    product: Optional[Product] = None

    class Config:
        from_attributes = True
