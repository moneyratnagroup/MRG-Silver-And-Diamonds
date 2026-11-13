import os
import sys

sys.path.append(os.getcwd())

from app.database.database import engine, Base
from app.models.user import User
from app.models.product import Product
from app.models.banner import Banner
from app.models.coupon import Coupon
from app.models.cart import CartItem
from app.models.review import Review
# other models are omitted to avoid import errors

Base.metadata.create_all(bind=engine)
try:
    from sqlalchemy import text
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE reviews ADD COLUMN IF NOT EXISTS admin_reply TEXT;"))
        conn.execute(text("ALTER TABLE reviews ADD COLUMN IF NOT EXISTS admin_replied_at TIMESTAMP WITH TIME ZONE;"))
        conn.commit()
except Exception as e:
    print(f"Column check notice: {e}")
print("All tables created successfully.")
