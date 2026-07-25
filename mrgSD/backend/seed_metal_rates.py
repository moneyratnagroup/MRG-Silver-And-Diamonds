import sys
import os
from datetime import datetime, timedelta

# Add backend dir to python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.database.database import SessionLocal
from app.models.metal_rate import MetalRate

def generate_mock_history():
    db = SessionLocal()
    today = datetime.now()
    
    # Generate for the past 30 days
    for i in range(30, -1, -1):
        d = today - timedelta(days=i)
        
        import math
        gold24kBase = 7500 + math.sin(i * 0.1) * 400 + (365 - i)
        gold22kBase = gold24kBase * 0.916
        gold18kBase = gold24kBase * 0.75
        
        silverBase = 85 + math.cos(i * 0.05) * 10 + (365 - i) * 0.02
        silver999Base = silverBase + 2
        copperBase = 800 + math.sin(i * 0.02) * 50 + (365 - i) * 0.1
        
        metals = [
            {"metal_name": "gold24k", "metal_type": "Gold", "purity": "24K", "unit": "gram", "rate": round(gold24kBase)},
            {"metal_name": "gold22k", "metal_type": "Gold", "purity": "22K", "unit": "gram", "rate": round(gold22kBase)},
            {"metal_name": "gold18k", "metal_type": "Gold", "purity": "18K", "unit": "gram", "rate": round(gold18kBase)},
            {"metal_name": "silver", "metal_type": "Silver", "purity": "925", "unit": "gram", "rate": round(silverBase, 1)},
            {"metal_name": "silver999", "metal_type": "Silver", "purity": "999", "unit": "gram", "rate": round(silver999Base, 1)},
            {"metal_name": "copper", "metal_type": "Copper", "purity": "Bullion", "unit": "kg", "rate": round(copperBase)}
        ]
        
        for m in metals:
            rate_entry = MetalRate(
                metal_name=m["metal_name"],
                metal_type=m["metal_type"],
                purity=m["purity"],
                unit=m["unit"],
                rate=m["rate"],
                created_at=d,
                updated_at=d
            )
            db.add(rate_entry)
            
    db.commit()
    db.close()
    print("Database seeded with 30 days of metal rates!")

if __name__ == "__main__":
    generate_mock_history()
