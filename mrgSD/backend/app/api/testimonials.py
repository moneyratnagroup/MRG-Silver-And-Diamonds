from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.schemas.testimonial import TestimonialCreate, TestimonialUpdate, TestimonialResponse
from app.services import testimonial as testimonial_service

router = APIRouter()

@router.get("/", response_model=List[TestimonialResponse])
def read_testimonials(
    skip: int = 0, 
    limit: int = 100, 
    active_only: bool = Query(False, description="Filter for only active testimonials"),
    db: Session = Depends(get_db)
):
    """
    Retrieve testimonials.
    """
    return testimonial_service.get_testimonials(db, skip=skip, limit=limit, active_only=active_only)

@router.get("/{testimonial_id}", response_model=TestimonialResponse)
def read_testimonial(testimonial_id: int, db: Session = Depends(get_db)):
    """
    Get a specific testimonial by ID.
    """
    db_testimonial = testimonial_service.get_testimonial(db, testimonial_id=testimonial_id)
    if db_testimonial is None:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return db_testimonial

@router.post("/", response_model=TestimonialResponse)
def create_testimonial(testimonial: TestimonialCreate, db: Session = Depends(get_db)):
    """
    Create a new testimonial.
    """
    return testimonial_service.create_testimonial(db=db, testimonial=testimonial)

@router.put("/{testimonial_id}", response_model=TestimonialResponse)
def update_testimonial(testimonial_id: int, testimonial: TestimonialUpdate, db: Session = Depends(get_db)):
    """
    Update a testimonial.
    """
    db_testimonial = testimonial_service.update_testimonial(db, testimonial_id=testimonial_id, testimonial=testimonial)
    if db_testimonial is None:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return db_testimonial

@router.delete("/{testimonial_id}")
def delete_testimonial(testimonial_id: int, db: Session = Depends(get_db)):
    """
    Delete a testimonial.
    """
    success = testimonial_service.delete_testimonial(db, testimonial_id=testimonial_id)
    if not success:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return {"message": "Testimonial deleted successfully"}
