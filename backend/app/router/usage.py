
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session


from app.database import get_db
from app.models import User, Subscription, UsageEvent
from app.schemas.usage import UsageEventCreate, UsageEventResponse
from app.auth.utils import get_user_id_from_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

bearer_scheme = HTTPBearer()
router = APIRouter(prefix="/usage", tags=["Usage"])



@router.post("/", response_model=UsageEventResponse, status_code=201)
def record_usage(
    data: UsageEventCreate,
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):
    try:
        user_id = get_user_id_from_token(credentials.credentials)
    except (ValueError, TypeError):
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    subscription = (
        db.query(Subscription)
        .filter(
            Subscription.user_id == user_id,
            Subscription.status == "active",
        )
        .first()
    )
    if not subscription:
        raise HTTPException(
            status_code=400,
            detail="No active subscription",
        )

    existing = (
        db.query(UsageEvent)
        .filter(
            UsageEvent.subscription_id == subscription.id,
            UsageEvent.event_id == data.event_id,
        )
        .first()
    )

    if existing:
        return existing

    event = UsageEvent(
        subscription_id=subscription.id,
        event_id=data.event_id,
        endpoint=data.endpoint,
        quantity=data.quantity,
    )

    db.add(event)
    db.commit()
    db.refresh(event)

    return event


@router.get("/me", response_model=list[UsageEventResponse])
def my_usage(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):
    try:
        user_id = get_user_id_from_token(credentials.credentials)
    except (ValueError, TypeError):
        raise HTTPException(status_code=401, detail="Invalid token")

    return (
        db.query(UsageEvent)
        .join(Subscription)
        .filter(Subscription.user_id == user_id)
        .order_by(UsageEvent.id.desc())
        .all()
    )
