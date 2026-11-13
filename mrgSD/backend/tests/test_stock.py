import os
os.environ["DATABASE_URL"] = "sqlite://"

import unittest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.database.database import Base
from app.models.product import Product, ProductStatus
from app.models.user import User
import app.models.address
from app.api.admin.inventory import StockAdjustment, adjust_stock
from app.api.carts import add_to_cart, update_cart_quantity
from app.schemas.cart import CartItemCreate, CartItemUpdate
from app.schemas.product import Product as ProductResponse


class StockTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite://")
        Base.metadata.create_all(self.engine)
        self.db = Session(self.engine)
        self.product = Product(sku="STOCK-TEST", name="Test ring", selling_price=100,
                               status=ProductStatus.PUBLISHED, stock_quantity=6, low_stock_threshold=5)
        self.user = User(phone_number="+919000000001", full_name="Test customer")
        self.db.add_all([self.product, self.user])
        self.db.commit()

    def tearDown(self):
        self.db.close()
        self.engine.dispose()

    def test_adjustments_persist_and_are_returned_in_product_response(self):
        adjust_stock(self.product.id, StockAdjustment(type="remove", quantity=6), self.db)
        with Session(self.engine) as db:
            product = db.get(Product, self.product.id)
            self.assertEqual(product.stock_quantity, 0)
            response = ProductResponse.model_validate(product)
            self.assertEqual(response.stock_quantity, 0)
            self.assertEqual(response.low_stock_threshold, 5)
        adjust_stock(self.product.id, StockAdjustment(type="add", quantity=2), self.db)
        self.assertEqual(self.product.stock_quantity, 2)

    def test_removing_too_much_is_rejected(self):
        with self.assertRaises(HTTPException) as exc:
            adjust_stock(self.product.id, StockAdjustment(type="remove", quantity=7), self.db)
        self.assertEqual(exc.exception.status_code, 409)
        self.assertEqual(self.product.stock_quantity, 6)

    def test_out_of_stock_cannot_be_added_to_cart(self):
        self.product.stock_quantity = 0
        self.db.commit()
        with self.assertRaises(HTTPException) as exc:
            add_to_cart(CartItemCreate(product_id=self.product.id), self.db, self.user)
        self.assertEqual(exc.exception.status_code, 409)

    def test_cart_cannot_exceed_available_stock(self):
        add_to_cart(CartItemCreate(product_id=self.product.id, quantity=6), self.db, self.user)
        with self.assertRaises(HTTPException):
            add_to_cart(CartItemCreate(product_id=self.product.id, quantity=1), self.db, self.user)
        with self.assertRaises(HTTPException):
            update_cart_quantity(self.product.id, CartItemUpdate(quantity=7), self.db, self.user)

    def test_negative_cart_quantity_is_rejected(self):
        with self.assertRaises(HTTPException):
            add_to_cart(CartItemCreate(product_id=self.product.id, quantity=-1), self.db, self.user)


if __name__ == '__main__':
    unittest.main()
