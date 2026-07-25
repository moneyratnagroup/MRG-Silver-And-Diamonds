import sys
import os

# Add the backend directory to the path so we can import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.database import SessionLocal
from app.models.metal_rate import MetalRate

def empty_table():
    db = SessionLocal()
    try:
        deleted_count = db.query(MetalRate).delete()
        db.commit()
        print(f"Successfully deleted {deleted_count} rows from metal_rates table.")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    empty_table()
