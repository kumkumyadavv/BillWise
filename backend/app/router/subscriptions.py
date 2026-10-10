
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Plan, Subscription
from app.models import User
from app.schemas.subscription import (
    SubscriptionCreate,
    SubscriptionResponse,
)
#from app.auth.utils import get_user_id_from_token
from fastapi.security import OAuth2PasswordBearer

router = APIRouter(
    prefix="/subscriptions",
    tags=["Subscriptions"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


@router.post("/", response_model=SubscriptionResponse, status_code=201)
def create_subscription(
    data: SubscriptionCreate,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    user_id = get_user_id_from_token(token)

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    plan = db.query(Plan).filter(Plan.id == data.plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    existing = (
        db.query(Subscription)
        .filter(
            Subscription.user_id == user_id,
            Subscription.status == "active",
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=409,
            detail="You already have an active subscription",
        )

    subscription = Subscription(
        user_id=user_id,
        plan_id=plan.id,
        status="active",
    )

    db.add(subscription)
    db.commit()
    db.refresh(subscription)

    return subscription


@router.get("/me", response_model=list[SubscriptionResponse])
def my_subscriptions(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    user_id = get_user_id_from_token(token)

    return (
        db.query(Subscription)
        .filter(Subscription.user_id == user_id)
        .order_by(Subscription.id.desc())
        .all()
    )
