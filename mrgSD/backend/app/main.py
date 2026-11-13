from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database.database import get_db, Base, engine, SessionLocal
from app.core.admin_access import bootstrap_owner, enforce_admin_access
import app.models.admin_account
import app.models.review

from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.api import metal_rates, testimonials, upload, auth, products, coupons, wishlists, banners, carts, reviews
from app.api.admin import admin_router

# Auto-create tables on startup (if not already existing)
try:
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as admin_db:
        bootstrap_owner(admin_db)
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER NOT NULL DEFAULT 10;"))
        conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER NOT NULL DEFAULT 5;"))
        conn.execute(text("ALTER TABLE reviews ADD COLUMN IF NOT EXISTS admin_reply TEXT;"))
        conn.execute(text("ALTER TABLE reviews ADD COLUMN IF NOT EXISTS admin_reply_hidden BOOLEAN NOT NULL DEFAULT FALSE;"))
        conn.execute(text("ALTER TABLE reviews ADD COLUMN IF NOT EXISTS admin_replied_at TIMESTAMP WITH TIME ZONE;"))
        conn.commit()
except Exception as e:
    print(f"Notice: Table creation / column migration skipped or pending connection: {e}")

app = FastAPI(title="Moneyratna Jewellers API", dependencies=[Depends(enforce_admin_access)])

# Ensure uploads directory exists
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173", 
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "https://www.moneyratnajewellery.com",
        "https://moneyratnajewellery.com",
        "https://www.moneyratnajewellers.com",
        "https://moneyratnajewellers.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dedicated Admin Module Router
app.include_router(admin_router, prefix="/api/v1/admin")

# Customer / Core Storefront Routers
app.include_router(metal_rates.router, prefix="/api/v1/metal-rates", tags=["metal_rates"])
app.include_router(testimonials.router, prefix="/api/v1/testimonials", tags=["testimonials"])
app.include_router(upload.router, prefix="/api/v1/upload", tags=["upload"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(products.router, prefix="/api/v1/products", tags=["products"])
app.include_router(coupons.router, prefix="/api/v1/coupons", tags=["coupons"])
app.include_router(wishlists.router, prefix="/api/v1/wishlists", tags=["wishlists"])
app.include_router(banners.router, prefix="/api/v1/banners", tags=["banners"])
app.include_router(carts.router, prefix="/api/v1/carts", tags=["carts"])
app.include_router(reviews.router, prefix="/api/v1/reviews", tags=["reviews"])

@app.get("/")
def root():
    return {"message": "Moneyratna Backend Running"}

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "Database connection successful"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {e}")
