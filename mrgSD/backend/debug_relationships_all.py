import sys; import os; sys.path.append(os.getcwd())
from app.database.database import SessionLocal
from app.models.product import Product

db = SessionLocal()
try:
    products = db.query(Product).all()
    for i, p in enumerate(products):
        print(f"Product {i} (id: {p.id})")
        try:
            _ = p.category
        except Exception as e:
            print(f"  Error category on {i}: {e}")
            break
        
        try:
            _ = p.images
        except Exception as e:
            print(f"  Error images on {i}: {e}")
            break
            
        try:
            _ = p.occasions
        except Exception as e:
            print(f"  Error occasions on {i}: {e}")
            break

        try:
            _ = p.purity
        except Exception as e:
            print(f"  Error purity on {i}: {e}")
            break

        try:
            _ = p.metal
        except Exception as e:
            print(f"  Error metal on {i}: {e}")
            break

        try:
            _ = p.stones
        except Exception as e:
            print(f"  Error stones on {i}: {e}")
            break

        try:
            _ = p.collections
        except Exception as e:
            print(f"  Error collections on {i}: {e}")
            break
except Exception as e:
    print("Error querying product:", e)
