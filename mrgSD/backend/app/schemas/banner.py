from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BannerBase(BaseModel):
    image: str
    badge: Optional[str] = None
    title: Optional[str] = None
    subtitle: Optional[str] = None
    button_text: Optional[str] = None
    status: Optional[str] = "publish"

class BannerCreate(BannerBase):
    pass

class BannerUpdate(BaseModel):
    image: Optional[str] = None
    badge: Optional[str] = None
    title: Optional[str] = None
    subtitle: Optional[str] = None
    button_text: Optional[str] = None
    status: Optional[str] = None

class BannerResponse(BannerBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
