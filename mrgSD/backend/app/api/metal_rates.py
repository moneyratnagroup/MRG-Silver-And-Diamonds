from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.schemas import metal_rate as schemas
from app.services import metal_rate as crud

router = APIRouter()

@router.post("/", response_model=schemas.MetalRateResponse, status_code=status.HTTP_201_CREATED)
def create_metal_rate(rate: schemas.MetalRateCreate, db: Session = Depends(get_db)):
    return crud.create_metal_rate(db=db, rate=rate)

@router.post("/batch", response_model=List[schemas.MetalRateResponse], status_code=status.HTTP_201_CREATED)
def batch_update_metal_rates(batch_update: schemas.MetalRateBatchUpdate, db: Session = Depends(get_db)):
    return crud.batch_update_metal_rates(db=db, batch_update=batch_update)

@router.post("/batch-delete", status_code=status.HTTP_204_NO_CONTENT)
def batch_delete_metal_rates(rate_ids: List[int], db: Session = Depends(get_db)):
    crud.batch_delete_metal_rates(db=db, rate_ids=rate_ids)
    return None

@router.get("/", response_model=List[schemas.MetalRateResponse])
def read_metal_rates(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    rates = crud.get_metal_rates(db, skip=skip, limit=limit)
    return rates

@router.get("/active", response_model=List[schemas.MetalRateResponse])
def read_active_metal_rates(db: Session = Depends(get_db)):
    return crud.get_active_metal_rates(db=db)

@router.get("/{rate_id}", response_model=schemas.MetalRateResponse)
def read_metal_rate(rate_id: int, db: Session = Depends(get_db)):
    db_rate = crud.get_metal_rate(db, rate_id=rate_id)
    if db_rate is None:
        raise HTTPException(status_code=404, detail="Metal rate not found")
    return db_rate

@router.put("/{rate_id}", response_model=schemas.MetalRateResponse)
def update_metal_rate(rate_id: int, rate: schemas.MetalRateUpdate, db: Session = Depends(get_db)):
    db_rate = crud.update_metal_rate(db, rate_id=rate_id, rate_update=rate)
    if db_rate is None:
        raise HTTPException(status_code=404, detail="Metal rate not found")
    return db_rate

@router.delete("/{rate_id}", response_model=schemas.MetalRateResponse)
def delete_metal_rate(rate_id: int, db: Session = Depends(get_db)):
    db_rate = crud.delete_metal_rate(db, rate_id=rate_id)
    if db_rate is None:
        raise HTTPException(status_code=404, detail="Metal rate not found")
    return db_rate
