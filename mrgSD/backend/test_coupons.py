import os
import sys

sys.path.append(os.getcwd())

from app.database.database import SessionLocal
from app.models.coupon import Coupon

db = SessionLocal()
try:
    coupons = db.query(Coupon).all()
    print("Coupons:", coupons)
except Exception as e:
    print("Exception:", e)
finally:
    db.close()
