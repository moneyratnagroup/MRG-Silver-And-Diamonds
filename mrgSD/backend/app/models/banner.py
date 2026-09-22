from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.database.database import Base

class Banner(Base):
    __tablename__ = "banners"

    id = Column(Integer, primary_key=True, index=True)
    image = Column(String, nullable=False)
    badge = Column(String, nullable=True)
    title = Column(String, nullable=True)
    subtitle = Column(Text, nullable=True)
    button_text = Column(String, nullable=True)
    status = Column(String, default="publish", index=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
