from sqlalchemy.orm import Session
from app.models.metal_rate import MetalRate
from app.schemas.metal_rate import MetalRateCreate, MetalRateUpdate

def get_metal_rate(db: Session, rate_id: int):
    return db.query(MetalRate).filter(MetalRate.id == rate_id).first()

def get_metal_rates(db: Session, skip: int = 0, limit: int = 100):
    return db.query(MetalRate).offset(skip).limit(limit).all()

def get_active_metal_rates(db: Session):
    return db.query(MetalRate).filter(MetalRate.is_active == True).all()

def get_metal_rate_by_name(db: Session, metal_name: str):
    return db.query(MetalRate).filter(MetalRate.metal_name == metal_name, MetalRate.is_active == True).first()

def create_metal_rate(db: Session, rate: MetalRateCreate):
    db_rate = MetalRate(
        metal_name=rate.metal_name,
        metal_type=rate.metal_type,
        purity=rate.purity,
        unit=rate.unit,
        rate=rate.rate,
        is_active=rate.is_active
    )
    db.add(db_rate)
    db.commit()
    db.refresh(db_rate)
    return db_rate

from app.schemas.metal_rate import MetalRateBatchUpdate

def update_metal_rate(db: Session, rate_id: int, rate_update: MetalRateUpdate):
    # Modified to be append-only history tracking
    db_rate = get_metal_rate(db, rate_id)
    if not db_rate or not db_rate.is_active:
        return None
    
    # Deactivate old rate
    db_rate.is_active = False
    
    # Create new rate based on old + updates
    update_data = rate_update.model_dump(exclude_unset=True)
    new_rate = MetalRate(
        metal_name=update_data.get('metal_name', db_rate.metal_name),
        metal_type=update_data.get('metal_type', db_rate.metal_type),
        purity=update_data.get('purity', db_rate.purity),
        unit=update_data.get('unit', db_rate.unit),
        rate=update_data.get('rate', db_rate.rate),
        is_active=True
    )
    db.add(new_rate)
    db.commit()
    db.refresh(new_rate)
    return new_rate

def batch_update_metal_rates(db: Session, batch_update: MetalRateBatchUpdate):
    updated_rates = []
    
    # Fallback defaults for a completely empty database
    defaults = {
        "gold18k": {"type": "Gold", "purity": "18K", "unit": "gram"},
        "gold22k": {"type": "Gold", "purity": "22K", "unit": "gram"},
        "gold24k": {"type": "Gold", "purity": "24K", "unit": "gram"},
        "silver": {"type": "Silver", "purity": "925", "unit": "gram"},
        "silver999": {"type": "Silver", "purity": "999", "unit": "gram"},
        "copper": {"type": "Copper", "purity": "Bullion", "unit": "kg"},
    }
    
    for metal_name, new_rate in batch_update.rates.items():
        current_rate = get_metal_rate_by_name(db, metal_name)
        
        if current_rate:
            current_rate.is_active = False
            metal_type = current_rate.metal_type
            purity = current_rate.purity
            unit = current_rate.unit
        else:
            # Empty database fallback
            fallback = defaults.get(metal_name, {"type": "Unknown", "purity": "Unknown", "unit": "Unknown"})
            metal_type = fallback["type"]
            purity = fallback["purity"]
            unit = fallback["unit"]
            
        new_rate_entry = MetalRate(
            metal_name=metal_name,
            metal_type=metal_type,
            purity=purity,
            unit=unit,
            rate=new_rate,
            is_active=True
        )
        db.add(new_rate_entry)
        updated_rates.append(new_rate_entry)
            
    db.commit()
    for rate_entry in updated_rates:
        db.refresh(rate_entry)
        
    return updated_rates

def delete_metal_rate(db: Session, rate_id: int):
    db_rate = get_metal_rate(db, rate_id)
    if db_rate:
        db.delete(db_rate)
        db.commit()
    return db_rate

def batch_delete_metal_rates(db: Session, rate_ids: list[int]):
    rates_to_delete = db.query(MetalRate).filter(MetalRate.id.in_(rate_ids)).all()
    
    for rate in rates_to_delete:
        if rate.is_active:
            # Smart rollback: reactivate the previous rate for this metal
            previous_rate = db.query(MetalRate).filter(
                MetalRate.metal_name == rate.metal_name,
                MetalRate.id != rate.id
            ).order_by(MetalRate.created_at.desc()).first()
            
            if previous_rate:
                previous_rate.is_active = True
                
        db.delete(rate)
        
    db.commit()
