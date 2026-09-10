from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, Table, Enum as SQLEnum, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database.database import Base

class TargetAudienceEnum(str, enum.Enum):
    WOMENS = "WOMENS"
    MENS = "MENS"
    KIDS = "KIDS"
    RELIGIOUS = "RELIGIOUS"

# Association Tables for Many-to-Many relationships
product_occasions = Table(
    'product_occasions',
    Base.metadata,
    Column('product_id', Integer, ForeignKey('products.id', ondelete="CASCADE"), primary_key=True),
    Column('occasion_id', Integer, ForeignKey('occasions.id', ondelete="CASCADE"), primary_key=True)
)

product_stones = Table(
    'product_stones',
    Base.metadata,
    Column('product_id', Integer, ForeignKey('products.id', ondelete="CASCADE"), primary_key=True),
    Column('stone_id', Integer, ForeignKey('stones.id', ondelete="CASCADE"), primary_key=True)
)

product_collections = Table(
    'product_collections',
    Base.metadata,
    Column('product_id', Integer, ForeignKey('products.id', ondelete="CASCADE"), primary_key=True),
    Column('collection_id', Integer, ForeignKey('collections.id', ondelete="CASCADE"), primary_key=True)
)

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(255), nullable=True)
    
    products = relationship("Product", back_populates="category")

class Metal(Base):
    __tablename__ = "metals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True, nullable=False) # Gold, Silver, Platinum
    
    purities = relationship("Purity", back_populates="metal", cascade="all, delete-orphan")
    products = relationship("Product", back_populates="metal")

class Purity(Base):
    __tablename__ = "purities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False) # 18K, 22K, 92.5
    metal_id = Column(Integer, ForeignKey('metals.id', ondelete="CASCADE"), nullable=False)
    
    metal = relationship("Metal", back_populates="purities")
    products = relationship("Product", back_populates="purity")

class Occasion(Base):
    __tablename__ = "occasions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False) # Daily Wear, Party Wear

class Stone(Base):
    __tablename__ = "stones"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False) # Diamond, Ruby

class Collection(Base):
    __tablename__ = "collections"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False) # Bridal, Daily Wear

class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey('products.id', ondelete="CASCADE"), nullable=False)
    image_url = Column(String(255), nullable=False)
    is_primary = Column(Boolean, default=False)

    product = relationship("Product", back_populates="images")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(255), index=True, nullable=False)
    description = Column(Text, nullable=True)
    
    # Enum for target audience replacing Gender
    target_audience = Column(SQLEnum(TargetAudienceEnum), nullable=False)
    
    category_id = Column(Integer, ForeignKey('categories.id', ondelete="SET NULL"), nullable=True)
    metal_id = Column(Integer, ForeignKey('metals.id', ondelete="SET NULL"), nullable=True)
    purity_id = Column(Integer, ForeignKey('purities.id', ondelete="SET NULL"), nullable=True)
    
    # Selling Price as fixed amount
    selling_price = Column(Float, nullable=False)
    mrp_price = Column(Float, nullable=True)
    
    is_new_arrival = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    
    is_offer_available = Column(Boolean, default=False)
    offer_coupon_code = Column(String(50), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    category = relationship("Category", back_populates="products")
    metal = relationship("Metal", back_populates="products")
    purity = relationship("Purity", back_populates="products")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")
    
    occasions = relationship("Occasion", secondary=product_occasions)
    stones = relationship("Stone", secondary=product_stones)
    collections = relationship("Collection", secondary=product_collections)
