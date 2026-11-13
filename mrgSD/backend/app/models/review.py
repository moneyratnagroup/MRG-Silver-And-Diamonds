from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.database import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey('products.id', ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete="SET NULL"), nullable=True, index=True)
    user_name = Column(String(100), nullable=False)
    rating = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    comment = Column(Text, nullable=False)
    image_url = Column(String(500), nullable=True)
    is_approved = Column(Boolean, default=True)
    admin_reply = Column(Text, nullable=True)
    admin_reply_hidden = Column(Boolean, nullable=False, default=False, server_default="false")
    admin_replied_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    product = relationship("Product")
    user = relationship("User")

