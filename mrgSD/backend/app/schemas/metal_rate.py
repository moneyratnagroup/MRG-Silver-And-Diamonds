from pydantic import BaseModel, ConfigDict
from decimal import Decimal
from datetime import datetime
from typing import Optional

class MetalRateBase(BaseModel):
    metal_name: str
    metal_type: str
    purity: str
    unit: str
    rate: Decimal
    is_active: bool = True

class MetalRateCreate(MetalRateBase):
    pass

class MetalRateUpdate(BaseModel):
    metal_name: Optional[str] = None
    metal_type: Optional[str] = None
    purity: Optional[str] = None
    unit: Optional[str] = None
    rate: Optional[Decimal] = None
    is_active: Optional[bool] = None

class MetalRateResponse(MetalRateBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class MetalRateBatchUpdate(BaseModel):
    rates: dict[str, Decimal]
