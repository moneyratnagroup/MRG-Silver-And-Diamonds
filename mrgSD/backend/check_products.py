import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.database.database import SessionLocal
from app.models.product import Product, Collection

def check_products():
    db: Session = SessionLocal()
    try:
        products = db.query(Product).all()
        for p in products:
            for c in p.collections:
                print(c.category_ids)
        print("Success")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    check_products()
