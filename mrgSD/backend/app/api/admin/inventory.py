from typing import Literal
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.product import Product
from app.schemas.product import Product as ProductResponse

router = APIRouter()


class StockAdjustment(BaseModel):
    type: Literal["add", "remove"]
    quantity: int = Field(gt=0)


@router.patch("/{product_id}", response_model=ProductResponse)
def adjust_stock(product_id: int, adjustment: StockAdjustment, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).with_for_update().first()
    if not product:
        raise HTTPException(404, "Product not found")
    if adjustment.type == "remove" and adjustment.quantity > product.stock_quantity:
        raise HTTPException(409, "Cannot remove more than the available stock")
    product.stock_quantity += adjustment.quantity if adjustment.type == "add" else -adjustment.quantity
    db.commit()
    db.refresh(product)
    return product
