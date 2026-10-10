
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict


class PlanCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    monthly_price: Decimal = Field(ge=0, max_digits=10, decimal_places=2)
    included_requests: int = Field(ge=0)
    request_overage_price: Decimal = Field(ge=0, max_digits=10, decimal_places=4)


class PlanResponse(BaseModel):
    id: int
    name: str
    monthly_price: Decimal
    included_requests: int
    request_overage_price: Decimal

    model_config = ConfigDict(from_attributes=True)
