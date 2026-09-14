from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.coupon import Coupon
from app.schemas.coupon import CouponCreate, CouponUpdate, CouponResponse

router = APIRouter()

@router.get("/", response_model=List[CouponResponse])
def get_coupons(db: Session = Depends(get_db)):
    return db.query(Coupon).all()

@router.post("/", response_model=CouponResponse, status_code=status.HTTP_201_CREATED)
def create_coupon(coupon_in: CouponCreate, db: Session = Depends(get_db)):
    db_coupon = db.query(Coupon).filter(Coupon.code == coupon_in.code).first()
    if db_coupon:
        raise HTTPException(status_code=400, detail="Coupon code already exists")
    
    new_coupon = Coupon(**coupon_in.model_dump())
    db.add(new_coupon)
    db.commit()
    db.refresh(new_coupon)
    return new_coupon

@router.put("/{coupon_id}", response_model=CouponResponse)
def update_coupon(coupon_id: int, coupon_in: CouponUpdate, db: Session = Depends(get_db)):
    db_coupon = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    if not db_coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")
    
    update_data = coupon_in.model_dump(exclude_unset=True)
    if "code" in update_data and update_data["code"] != db_coupon.code:
        existing = db.query(Coupon).filter(Coupon.code == update_data["code"]).first()
        if existing:
            raise HTTPException(status_code=400, detail="Coupon code already exists")

    for key, value in update_data.items():
        setattr(db_coupon, key, value)
        
    db.commit()
    db.refresh(db_coupon)
    return db_coupon

@router.delete("/{coupon_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_coupon(coupon_id: int, db: Session = Depends(get_db)):
    db_coupon = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    if not db_coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")
    
    db.delete(db_coupon)
    db.commit()

@router.patch("/{coupon_id}/toggle", response_model=CouponResponse)
def toggle_coupon_status(coupon_id: int, db: Session = Depends(get_db)):
    db_coupon = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    if not db_coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")
    
    db_coupon.is_active = not db_coupon.is_active
    db.commit()
    db.refresh(db_coupon)
    return db_coupon
