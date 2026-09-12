import sys; import os; sys.path.append(os.getcwd())
from app.database.database import SessionLocal
from app.models.product import Product as ProductModel
from app.schemas.product import Product as ProductSchema

db = SessionLocal()
try:
    products = db.query(ProductModel).all()
    for i, p in enumerate(products):
        try:
            ProductSchema.from_orm(p)
        except Exception as e:
            print(f"Product {i} (id: {p.id}) failed validation:")
            print(e)
            break
except Exception as e:
    print("Error:", e)
