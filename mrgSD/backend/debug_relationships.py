import sys; import os; sys.path.append(os.getcwd())
from app.database.database import SessionLocal
from app.models.product import Product

db = SessionLocal()
try:
    p = db.query(Product).first()
    print("Got product")
    try:
        print(p.category)
    except Exception as e:
        print("Error category:", e)
    
    try:
        print(p.images)
    except Exception as e:
        print("Error images:", e)
        
    try:
        print(p.occasions)
    except Exception as e:
        print("Error occasions:", e)

    try:
        print(p.purity)
    except Exception as e:
        print("Error purity:", e)

    try:
        print(p.metal)
    except Exception as e:
        print("Error metal:", e)

    try:
        print(p.stones)
    except Exception as e:
        print("Error stones:", e)

    try:
        print(p.collections)
    except Exception as e:
        print("Error collections:", e)

except Exception as e:
    print("Error querying product:", e)
