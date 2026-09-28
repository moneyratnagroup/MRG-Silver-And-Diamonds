from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.models.cart import CartItem
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartItemResponse
from app.core.security import get_current_user
from app.models.user import User
from app.models.product import Product

router = APIRouter()

@router.get("/", response_model=List[CartItemResponse])
def get_cart_items(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Get all cart items for the logged-in user.
    """
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    return cart_items

@router.post("/", response_model=CartItemResponse)
def add_to_cart(item: CartItemCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Add a product to the cart. If it already exists, increment the quantity.
    """
    # Check if product exists
    product = db.query(Product).filter(Product.id == item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Check if item is already in cart
    existing_item = db.query(CartItem).filter(
        CartItem.user_id == current_user.id,
        CartItem.product_id == item.product_id
    ).first()

    if existing_item:
        existing_item.quantity += item.quantity
        db.commit()
        db.refresh(existing_item)
        return existing_item

    # Add new item
    new_item = CartItem(
        user_id=current_user.id,
        product_id=item.product_id,
        quantity=item.quantity
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.put("/{product_id}", response_model=CartItemResponse)
def update_cart_quantity(product_id: int, item: CartItemUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Update the quantity of a cart item.
    """
    cart_item = db.query(CartItem).filter(
        CartItem.user_id == current_user.id,
        CartItem.product_id == product_id
    ).first()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    if item.quantity <= 0:
        db.delete(cart_item)
        db.commit()
        raise HTTPException(status_code=204, detail="Item removed")

    cart_item.quantity = item.quantity
    db.commit()
    db.refresh(cart_item)
    return cart_item

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_cart(product_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Remove an item from the cart entirely.
    """
    cart_item = db.query(CartItem).filter(
        CartItem.user_id == current_user.id,
        CartItem.product_id == product_id
    ).first()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(cart_item)
    db.commit()
    return None
