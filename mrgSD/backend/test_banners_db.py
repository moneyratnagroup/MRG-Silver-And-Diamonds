from app.database.database import SessionLocal
from sqlalchemy import text

db = SessionLocal()
try:
    tables = db.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")).fetchall()
    print("Tables:", sorted([t[0] for t in tables]))

    alembic_v = db.execute(text("SELECT version_num FROM alembic_version")).fetchall()
    print("alembic_version rows:", [v[0] for v in alembic_v])

    cols = db.execute(text("SELECT column_name, data_type, udt_name FROM information_schema.columns WHERE table_name='products'")).fetchall()
    print("products columns:", [(c[0], c[1], c[2]) for c in cols])

    types = db.execute(text("SELECT typname FROM pg_type WHERE typname in ('productstatus', 'coupontype')")).fetchall()
    print("Enums in pg_type:", [t[0] for t in types])

    wishlist = db.execute(text("SELECT to_regclass('public.wishlist_items')")).scalar()
    print("wishlist_items exists:", wishlist)

    coupons = db.execute(text("SELECT to_regclass('public.coupons')")).scalar()
    print("coupons exists:", coupons)

finally:
    db.close()
