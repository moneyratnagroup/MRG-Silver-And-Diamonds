from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional
from datetime import datetime

from app.database.database import get_db
from app.models import product as models
from app.schemas import product as schemas

router = APIRouter()

# -----------------------------------------
# Taxonomy Endpoints
# -----------------------------------------

@router.get("/categories", response_model=List[schemas.Category])
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()

@router.post("/categories", response_model=schemas.Category)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    db_obj = models.Category(**category.dict())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/metals", response_model=List[schemas.Metal])
def get_metals(db: Session = Depends(get_db)):
    return db.query(models.Metal).all()

@router.post("/metals", response_model=schemas.Metal)
def create_metal(metal: schemas.MetalCreate, db: Session = Depends(get_db)):
    db_obj = models.Metal(**metal.dict())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/purities", response_model=List[schemas.Purity])
def get_purities(db: Session = Depends(get_db)):
    return db.query(models.Purity).all()

@router.post("/purities", response_model=schemas.Purity)
def create_purity(purity: schemas.PurityCreate, db: Session = Depends(get_db)):
    db_obj = models.Purity(**purity.dict())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/occasions", response_model=List[schemas.Occasion])
def get_occasions(db: Session = Depends(get_db)):
    return db.query(models.Occasion).all()

@router.post("/occasions", response_model=schemas.Occasion)
def create_occasion(occasion: schemas.OccasionCreate, db: Session = Depends(get_db)):
    db_obj = models.Occasion(**occasion.dict())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/stones", response_model=List[schemas.Stone])
def get_stones(db: Session = Depends(get_db)):
    return db.query(models.Stone).all()

@router.post("/stones", response_model=schemas.Stone)
def create_stone(stone: schemas.StoneCreate, db: Session = Depends(get_db)):
    db_obj = models.Stone(**stone.dict())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/collections", response_model=List[schemas.Collection])
def get_collections(db: Session = Depends(get_db)):
    return db.query(models.Collection).all()

@router.post("/collections", response_model=schemas.Collection)
def create_collection(collection: schemas.CollectionCreate, db: Session = Depends(get_db)):
    db_obj = models.Collection(**collection.dict())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

# -----------------------------------------
# Product Endpoints
# -----------------------------------------

@router.get("/", response_model=List[schemas.Product])
def get_products(
    target_audience: Optional[models.TargetAudienceEnum] = None,
    category_id: Optional[int] = None,
    metal_id: Optional[int] = None,
    is_new_arrival: Optional[bool] = None,
    is_featured: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Product).filter(models.Product.is_active == True)
    
    if target_audience:
        query = query.filter(models.Product.target_audience == target_audience)
    if category_id:
        query = query.filter(models.Product.category_id == category_id)
    if metal_id:
        query = query.filter(models.Product.metal_id == metal_id)
    if is_new_arrival is not None:
        query = query.filter(models.Product.is_new_arrival == is_new_arrival)
    if is_featured is not None:
        query = query.filter(models.Product.is_featured == is_featured)
        
    query = query.order_by(models.Product.created_at.desc())
        
    return query.all()

@router.get("/{product_id}", response_model=schemas.Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/", response_model=schemas.Product)
def create_product(product_in: schemas.ProductCreate, db: Session = Depends(get_db)):
    # Create main product
    db_product = models.Product(
        sku=product_in.sku,
        name=product_in.name,
        description=product_in.description,
        target_audience=product_in.target_audience,
        category_id=product_in.category_id,
        metal_id=product_in.metal_id,
        purity_id=product_in.purity_id,
        selling_price=product_in.selling_price,
        mrp_price=product_in.mrp_price,
        is_new_arrival=product_in.is_new_arrival,
        is_featured=product_in.is_featured,
        is_active=product_in.is_active
    )
    
    # Handle M2M relationships
    if product_in.occasion_ids:
        occasions = db.query(models.Occasion).filter(models.Occasion.id.in_(product_in.occasion_ids)).all()
        db_product.occasions = occasions
    if product_in.stone_ids:
        stones = db.query(models.Stone).filter(models.Stone.id.in_(product_in.stone_ids)).all()
        db_product.stones = stones
    if product_in.collection_ids:
        collections = db.query(models.Collection).filter(models.Collection.id.in_(product_in.collection_ids)).all()
        db_product.collections = collections
        
    try:
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="A product with this SKU already exists.")
    
    # Handle images
    if product_in.images:
        for img in product_in.images:
            db_img = models.ProductImage(
                product_id=db_product.id,
                image_url=img.image_url,
                is_primary=img.is_primary
            )
            db.add(db_img)
        db.commit()
        db.refresh(db_product)

    return db_product

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    return None
