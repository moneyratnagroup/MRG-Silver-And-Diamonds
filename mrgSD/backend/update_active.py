import os
import sys

# Add the app directory to sys.path if needed
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.database.database import SessionLocal
from app.models.product import Product

def update_all_products_active():
    db: Session = SessionLocal()
    try:
        products = db.query(Product).all()
        count = 0
        for product in products:
            if not product.is_active:
                product.is_active = True
                count += 1
        db.commit()
        print(f"Updated {count} products to be active.")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    update_all_products_active()
