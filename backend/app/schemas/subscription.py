from datetime import datetime
from pydantic import BaseModel, ConfigDict


class SubscriptionCreate(BaseModel):
    plan_id: int


class SubscriptionResponse(BaseModel):
    id: int
    user_id: int
    plan_id: int
    status: str
    started_at: datetime

    model_config = ConfigDict(from_attributes=True)