from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.user import User, WishlistItem
from app.models.product import Product
from app.schemas.wishlist import WishlistItem as WishlistItemSchema
from app.api.auth import get_current_user

router = APIRouter(prefix="/wishlists", tags=["Wishlist"])

@router.get("/", response_model=List[WishlistItemSchema])
def get_user_wishlist(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    from app.models.product import ProductStatus
    items = db.query(WishlistItem).join(Product).filter(
        WishlistItem.user_id == current_user.id,
        Product.status == ProductStatus.PUBLISHED
    ).all()
    return items

@router.post("/{product_id}", response_model=WishlistItemSchema)
def add_to_wishlist(product_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Check if product exists
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    # Check if already in wishlist
    existing_item = db.query(WishlistItem).filter(WishlistItem.user_id == current_user.id, WishlistItem.product_id == product_id).first()
    if existing_item:
        return existing_item
        
    new_item = WishlistItem(user_id=current_user.id, product_id=product_id)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_wishlist(product_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(WishlistItem).filter(WishlistItem.user_id == current_user.id, WishlistItem.product_id == product_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Wishlist item not found")
    
    db.delete(item)
    db.commit()
    return None
