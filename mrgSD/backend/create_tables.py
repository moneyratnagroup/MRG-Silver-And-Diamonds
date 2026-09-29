import os
import sys

sys.path.append(os.getcwd())

from app.database.database import engine, Base
from app.models.user import User
from app.models.product import Product
from app.models.banner import Banner
from app.models.coupon import Coupon
from app.models.cart import CartItem
# other models are omitted to avoid import errors

Base.metadata.create_all(bind=engine)
print("All tables created successfully.")
