from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.models.banner import Banner
from app.schemas.banner import BannerCreate, BannerUpdate, BannerResponse

router = APIRouter()

@router.get("/", response_model=List[BannerResponse])
def get_banners(db: Session = Depends(get_db)):
    return db.query(Banner).order_by(Banner.id.asc()).all()

@router.post("/", response_model=BannerResponse, status_code=status.HTTP_201_CREATED)
def create_banner(banner: BannerCreate, db: Session = Depends(get_db)):
    db_banner = Banner(**banner.model_dump())
    db.add(db_banner)
    db.commit()
    db.refresh(db_banner)
    return db_banner

@router.put("/{banner_id}", response_model=BannerResponse)
def update_banner(banner_id: int, banner_update: BannerUpdate, db: Session = Depends(get_db)):
    db_banner = db.query(Banner).filter(Banner.id == banner_id).first()
    if not db_banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    
    update_data = banner_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_banner, key, value)
        
    db.commit()
    db.refresh(db_banner)
    return db_banner

@router.delete("/{banner_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_banner(banner_id: int, db: Session = Depends(get_db)):
    db_banner = db.query(Banner).filter(Banner.id == banner_id).first()
    if not db_banner:
        raise HTTPException(status_code=404, detail="Banner not found")
        
    db.delete(db_banner)
    db.commit()
