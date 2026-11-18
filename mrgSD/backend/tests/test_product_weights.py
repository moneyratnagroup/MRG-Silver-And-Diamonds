import os
os.environ['DATABASE_URL'] = 'sqlite://'

import importlib.util
from pathlib import Path
import unittest
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session
from alembic.migration import MigrationContext
from alembic.operations import Operations
from fastapi import HTTPException
from pydantic import ValidationError
from app.database.database import Base
from app.models.product import Product
from app.schemas.product import ProductCreate, Product as ProductResponse
from app.api.products import create_product, update_product
from app.schemas.product import ProductUpdate
from app.services.product_weights import validate_product_weights


class ProductWeightTests(unittest.TestCase):
    def test_migration_preserves_existing_data_and_is_repeatable(self):
        engine = create_engine('sqlite://')
        path = Path(__file__).parents[1] / 'alembic/versions/d217ae604f83_add_product_weights_and_making_charges.py'
        spec = importlib.util.spec_from_file_location('weights_migration', path)
        migration = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(migration)
        with engine.begin() as connection:
            connection.execute(text('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, stone_weight TEXT)'))
            connection.execute(text("INSERT INTO products VALUES (1, 'Existing ring', '0.5 ct')"))
            with Operations.context(MigrationContext.configure(connection)):
                migration.upgrade()
                migration.upgrade()
            self.assertEqual(connection.execute(text('SELECT id, name, stone_weight, gross_weight, stone_weight_grams, making_charges FROM products')).one(), (1, 'Existing ring', '0.5 ct', None, None, None))

    def test_create_read_and_partial_update(self):
        engine = create_engine('sqlite://')
        Base.metadata.create_all(engine)
        with Session(engine) as db:
            product = create_product(ProductCreate(sku='WEIGHT-TEST', name='Ring', selling_price=1000, gross_weight=10, stone_weight=0.2, making_charges=450), db)
            db.expire_all()
            loaded = db.get(Product, product.id)
            response = ProductResponse.model_validate(loaded)
            self.assertEqual((response.gross_weight, response.stone_weight, response.net_weight, response.making_charges), (10, 0.2, 9.8, 450))
            update_product(product.id, ProductUpdate(name='Renamed'), db)
            self.assertEqual(loaded.net_weight, 9.8)
            with self.assertRaises(HTTPException):
                update_product(product.id, ProductUpdate(gross_weight=0.1), db)
            plain = create_product(ProductCreate(sku='PLAIN-TEST', name='Plain ring', selling_price=100, gross_weight=5, stone_weight=0, making_charges=0), db)
            self.assertEqual(plain.net_weight, 5)
            legacy = create_product(ProductCreate(sku='LEGACY-TEST', name='Legacy', selling_price=100), db)
            self.assertIsNone(legacy.net_weight)

    def test_invalid_weights_and_charges(self):
        for values in ({'gross_weight': -1}, {'stone_weight': -1}, {'making_charges': -1}, {'gross_weight': float('nan')}):
            with self.assertRaises(ValidationError):
                ProductCreate(sku='INVALID', name='Invalid', selling_price=100, **values)
        with self.assertRaises(HTTPException):
            validate_product_weights(1, 2)


if __name__ == '__main__':
    unittest.main()
