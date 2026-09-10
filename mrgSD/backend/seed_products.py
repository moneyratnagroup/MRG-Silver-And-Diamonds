import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.database.database import engine, SessionLocal
from app.models import product as models

def seed_data():
    db = SessionLocal()
    try:
        # Seed Categories
        categories_data = ['Rings', 'Earrings', 'Chains', 'Bracelets', 'Pendants', 'Anklets', 'Idols', 'Bullions', 'Bridal', 'Coins', 'Bars']
        categories_map = {}
        for c in categories_data:
            cat = db.query(models.Category).filter(models.Category.name == c).first()
            if not cat:
                cat = models.Category(name=c)
                db.add(cat)
                db.commit()
                db.refresh(cat)
            categories_map[c] = cat

        # Seed Metals
        metals_data = ['Silver', 'Gold', 'Platinum', 'Copper', 'Silver/Diamond']
        metals_map = {}
        for m in metals_data:
            metal = db.query(models.Metal).filter(models.Metal.name == m).first()
            if not metal:
                metal = models.Metal(name=m)
                db.add(metal)
                db.commit()
                db.refresh(metal)
            metals_map[m] = metal

        # Seed Purities
        purities_data = [
            ('Silver', '925'), ('Silver', '999'), ('Gold', '22K'), ('Gold', '18K'), 
            ('Gold', '999'), ('Gold', '995'), ('Copper', '999'), ('Silver/Diamond', '925')
        ]
        purities_map = {}
        for metal_name, purity_name in purities_data:
            metal = metals_map[metal_name]
            purity = db.query(models.Purity).filter(models.Purity.name == purity_name, models.Purity.metal_id == metal.id).first()
            if not purity:
                purity = models.Purity(name=purity_name, metal_id=metal.id)
                db.add(purity)
                db.commit()
                db.refresh(purity)
            purities_map[f"{metal_name}_{purity_name}"] = purity

        # Function to clean price
        def clean_price(price_str):
            if not price_str: return 0.0
            return float(price_str.replace('₹', '').replace(',', ''))

        # Seed Mock Products
        from frontend_mock_data import mock_products
        
        for p_data in mock_products:
            # Check if exists
            exists = db.query(models.Product).filter(models.Product.sku == p_data['sku']).first()
            if exists:
                continue
                
            # Map target audience
            ta_map = {
                'women': models.TargetAudienceEnum.WOMENS,
                'men': models.TargetAudienceEnum.MENS,
                'kids': models.TargetAudienceEnum.KIDS,
                'religious': models.TargetAudienceEnum.RELIGIOUS,
                'investment': models.TargetAudienceEnum.WOMENS, # Defaulting investment
                'special': models.TargetAudienceEnum.WOMENS     # Defaulting special
            }
            ta = ta_map.get(p_data.get('collection'), models.TargetAudienceEnum.WOMENS)

            # Get relations
            cat = categories_map.get(p_data.get('category'))
            metal = metals_map.get(p_data.get('metal', 'Silver'))
            purity_key = f"{p_data.get('metal', 'Silver')}_{p_data.get('purity', '925')}"
            purity = purities_map.get(purity_key)

            product = models.Product(
                sku=p_data['sku'],
                name=p_data['name'],
                description=p_data['desc'],
                target_audience=ta,
                category_id=cat.id if cat else None,
                metal_id=metal.id if metal else None,
                purity_id=purity.id if purity else None,
                selling_price=clean_price(p_data['price']),
                mrp_price=clean_price(p_data.get('originalPrice', '')),
                is_active=True
            )
            db.add(product)
            db.commit()
            db.refresh(product)
            
            # Images
            img_urls = []
            if 'images' in p_data and p_data['images']:
                img_urls = p_data['images']
            elif 'img' in p_data:
                img_urls = [p_data['img']]
                
            for idx, url in enumerate(img_urls):
                img = models.ProductImage(
                    product_id=product.id,
                    image_url=url,
                    is_primary=(idx == 0)
                )
                db.add(img)
            db.commit()
            
        print("Successfully seeded taxonomies and products.")

    except Exception as e:
        print(f"Error seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
