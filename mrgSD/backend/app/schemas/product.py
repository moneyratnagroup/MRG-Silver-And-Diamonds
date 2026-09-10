from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# -------------------------
# Taxonomy Schemas
# -------------------------

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    class Config:
        from_attributes = True

class MetalBase(BaseModel):
    name: str

class MetalCreate(MetalBase):
    pass

class Metal(MetalBase):
    id: int
    class Config:
        from_attributes = True

class PurityBase(BaseModel):
    name: str
    metal_id: int

class PurityCreate(PurityBase):
    pass

class Purity(PurityBase):
    id: int
    metal: Metal
    class Config:
        from_attributes = True

class OccasionBase(BaseModel):
    name: str

class OccasionCreate(OccasionBase):
    pass

class Occasion(OccasionBase):
    id: int
    class Config:
        from_attributes = True

class StoneBase(BaseModel):
    name: str

class StoneCreate(StoneBase):
    pass

class Stone(StoneBase):
    id: int
    class Config:
        from_attributes = True

class CollectionBase(BaseModel):
    name: str

class CollectionCreate(CollectionBase):
    category_ids: List[int] = []

class Collection(CollectionBase):
    id: int
    category_ids: List[int] = []
    class Config:
        from_attributes = True

# -------------------------
# Product Image Schemas
# -------------------------

class ProductImageBase(BaseModel):
    image_url: str
    is_primary: bool = False

class ProductImageCreate(ProductImageBase):
    product_id: int

class ProductImage(ProductImageBase):
    id: int
    class Config:
        from_attributes = True

# -------------------------
# Product Schemas
# -------------------------

class ProductBase(BaseModel):
    sku: str
    name: str
    description: Optional[str] = None
    category_id: Optional[int] = None
    metal_id: Optional[int] = None
    purity_id: Optional[int] = None
    selling_price: float
    mrp_price: Optional[float] = None
    is_new_arrival: bool = False
    is_featured: bool = False
    is_active: bool = True

class ProductCreate(ProductBase):
    occasion_ids: List[int] = []
    stone_ids: List[int] = []
    collection_ids: List[int] = []
    images: List[ProductImageBase] = []

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    metal_id: Optional[int] = None
    purity_id: Optional[int] = None
    selling_price: Optional[float] = None
    mrp_price: Optional[float] = None
    is_new_arrival: Optional[bool] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    occasion_ids: Optional[List[int]] = None
    stone_ids: Optional[List[int]] = None
    collection_ids: Optional[List[int]] = None

class Product(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    category: Optional[Category] = None
    metal: Optional[Metal] = None
    purity: Optional[Purity] = None
    occasions: List[Occasion] = []
    stones: List[Stone] = []
    collections: List[Collection] = []
    images: List[ProductImage] = []

    class Config:
        from_attributes = True
