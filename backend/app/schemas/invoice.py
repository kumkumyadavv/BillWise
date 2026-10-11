
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict
from sqlalchemy import func
from app.services.billing import calculate_bill, get_current_billing_period

class InvoiceItemResponse(BaseModel):
    id: int
    invoice_id: int
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
