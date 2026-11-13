from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional

from app.database.database import get_db
from app.models import product as models
from app.schemas import product as schemas

router = APIRouter()

# -----------------------------------------
# Admin Product Management
# -----------------------------------------

@router.get("/", response_model=List[schemas.Product])
def get_admin_products(
    status: Optional[str] = "ALL",
    db: Session = Depends(get_db)
):
    """
    Get all products including draft, published, and archived for admin.
    """
    query = db.query(models.Product)
    if status and status.upper() != "ALL":
        query = query.filter(models.Product.status == status.upper())
    return query.order_by(models.Product.created_at.desc()).all()

@router.post("/", response_model=schemas.Product, status_code=status.HTTP_201_CREATED)
def create_product(product_in: schemas.ProductCreate, db: Session = Depends(get_db)):
    """
    Create a new product with taxonomy relationships and images.
    """
    db_product = models.Product(
        stock_quantity=product_in.stock_quantity,
        low_stock_threshold=product_in.low_stock_threshold,
        sku=product_in.sku,
        name=product_in.name,
        description=product_in.description,
        category_id=product_in.category_id,
        metal_id=product_in.metal_id,
        purity_id=product_in.purity_id,
        selling_price=product_in.selling_price,
        mrp_price=product_in.mrp_price,
        is_new_arrival=product_in.is_new_arrival,
        is_featured=product_in.is_featured,
        status=product_in.status,
        is_offer_available=product_in.is_offer_available,
        offer_coupon_code=product_in.offer_coupon_code
    )
    
    if product_in.occasion_ids:
        db_product.occasions = db.query(models.Occasion).filter(models.Occasion.id.in_(product_in.occasion_ids)).all()
    if product_in.stone_ids:
        db_product.stones = db.query(models.Stone).filter(models.Stone.id.in_(product_in.stone_ids)).all()
    if product_in.collection_ids:
        db_product.collections = db.query(models.Collection).filter(models.Collection.id.in_(product_in.collection_ids)).all()
        
    try:
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
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

@router.put("/{product_id}", response_model=schemas.Product)
def update_product(product_id: int, product_in: schemas.ProductUpdate, db: Session = Depends(get_db)):
    """
    Update an existing product.
    """
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = product_in.dict(exclude_unset=True)
    
    occasion_ids = update_data.pop("occasion_ids", None)
    stone_ids = update_data.pop("stone_ids", None)
    collection_ids = update_data.pop("collection_ids", None)
    images = update_data.pop("images", None)
    
    for field, value in update_data.items():
        setattr(db_product, field, value)
        
    if occasion_ids is not None:
        db_product.occasions = db.query(models.Occasion).filter(models.Occasion.id.in_(occasion_ids)).all()
    if stone_ids is not None:
        db_product.stones = db.query(models.Stone).filter(models.Stone.id.in_(stone_ids)).all()
    if collection_ids is not None:
        db_product.collections = db.query(models.Collection).filter(models.Collection.id.in_(collection_ids)).all()
        
    if images is not None:
        db.query(models.ProductImage).filter(models.ProductImage.product_id == db_product.id).delete()
        for img in images:
            db_img = models.ProductImage(
                product_id=db_product.id,
                image_url=img['image_url'] if isinstance(img, dict) else img.image_url,
                is_primary=img['is_primary'] if isinstance(img, dict) else img.is_primary
            )
            db.add(db_img)
        
    try:
        db.commit()
        db.refresh(db_product)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error updating product. SKU might already exist.")

    return db_product

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """
    Delete a product.
    """
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    return None

# -----------------------------------------
# Taxonomy Management (Categories & Collections)
# -----------------------------------------

@router.post("/categories", response_model=schemas.Category)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Category).filter(models.Category.name.ilike(category.name)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category with this name already exists")
    db_obj = models.Category(**category.dict())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.put("/categories/{category_id}", response_model=schemas.Category)
def update_category(category_id: int, category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    db_obj = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Category not found")
    for key, value in category.dict().items():
        setattr(db_obj, key, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    db_obj = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(db_obj)
    db.commit()
    return None

@router.post("/collections", response_model=schemas.Collection)
def create_collection(collection: schemas.CollectionCreate, db: Session = Depends(get_db)):
    db_obj = models.Collection(**collection.dict())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.put("/collections/{collection_id}", response_model=schemas.Collection)
def update_collection(collection_id: int, collection: schemas.CollectionCreate, db: Session = Depends(get_db)):
    db_obj = db.query(models.Collection).filter(models.Collection.id == collection_id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Collection not found")
    for key, value in collection.dict().items():
        setattr(db_obj, key, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.delete("/collections/{collection_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_collection(collection_id: int, db: Session = Depends(get_db)):
    db_obj = db.query(models.Collection).filter(models.Collection.id == collection_id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Collection not found")
    db.delete(db_obj)
    db.commit()
    return None
