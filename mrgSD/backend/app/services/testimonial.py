from sqlalchemy.orm import Session
from app.models.testimonial import Testimonial
from app.schemas.testimonial import TestimonialCreate, TestimonialUpdate

def get_testimonials(db: Session, skip: int = 0, limit: int = 100, active_only: bool = False):
    query = db.query(Testimonial)
    if active_only:
        query = query.filter(Testimonial.is_active == True)
    return query.order_by(Testimonial.display_order.desc(), Testimonial.created_at.desc()).offset(skip).limit(limit).all()

def get_testimonial(db: Session, testimonial_id: int):
    return db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()

def create_testimonial(db: Session, testimonial: TestimonialCreate):
    db_testimonial = Testimonial(**testimonial.model_dump())
    db.add(db_testimonial)
    db.commit()
    db.refresh(db_testimonial)
    return db_testimonial

def update_testimonial(db: Session, testimonial_id: int, testimonial: TestimonialUpdate):
    db_testimonial = get_testimonial(db, testimonial_id)
    if not db_testimonial:
        return None
    
    update_data = testimonial.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_testimonial, key, value)
        
    db.commit()
    db.refresh(db_testimonial)
    return db_testimonial

def delete_testimonial(db: Session, testimonial_id: int):
    db_testimonial = get_testimonial(db, testimonial_id)
    if not db_testimonial:
        return False
    db.delete(db_testimonial)
    db.commit()
    return True
