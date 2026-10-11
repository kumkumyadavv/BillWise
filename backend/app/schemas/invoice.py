
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict


class InvoiceItemResponse(BaseModel):
    id: int
    description: str
    quantity: int
    amount: Decimal

    model_config = ConfigDict(from_attributes=True)


class InvoiceResponse(BaseModel):
    id: int
    subscription_id: int
    total_amount: Decimal
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
