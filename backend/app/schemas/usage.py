
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class UsageEventCreate(BaseModel):
    event_id: str = Field(min_length=1, max_length=100)
    endpoint: str = Field(min_length=1, max_length=255)
    quantity: int = Field(default=1, ge=1)


class UsageEventResponse(BaseModel):
    id: int
    subscription_id: int
    event_id: str
    endpoint: str
    quantity: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
