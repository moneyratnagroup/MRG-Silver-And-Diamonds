from sqlalchemy import Boolean, Column, Integer, JSON, String
from app.database.database import Base


class AdminAccount(Base):
    __tablename__ = "admin_accounts"

    id = Column(Integer, primary_key=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    full_name = Column(String(100), nullable=False)
    phone_number = Column(String(20), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_owner = Column(Boolean, nullable=False, default=False)
    is_active = Column(Boolean, nullable=False, default=True)
    permissions = Column(JSON, nullable=False, default=list)
    token_version = Column(Integer, nullable=False, default=0)
