
from datetime import datetime, timezone

from dateutil.relativedelta import relativedelta
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.schemas.invoice import InvoiceResponse,InvoiceItemResponse
from app.auth.utils import get_user_id_from_token
from app.database import get_db
from app.models import (
    User,
    Plan,
    Subscription,
    UsageEvent,
    Invoice,
    InvoiceItem,
)
from app.schemas.invoice import InvoiceResponse
from app.services.billing import calculate_bill


router = APIRouter(prefix="/invoices", tags=["Invoices"])
bearer_scheme = HTTPBearer()


def get_authenticated_user_id(
    credentials: HTTPAuthorizationCredentials,
) -> int:
    try:
        return get_user_id_from_token(credentials.credentials)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
        )


@router.post(
    "/generate",
    response_model=InvoiceResponse,
    status_code=201,
)
def generate_invoice(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):
    user_id = get_authenticated_user_id(credentials)

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

    # Calculate the current billing period from subscription start.
    now = datetime.now(timezone.utc)
    period_start = subscription.started_at

    if period_start.tzinfo is None:
        period_start = period_start.replace(tzinfo=timezone.utc)

    period_end = period_start + relativedelta(months=1)

    while now >= period_end:
        period_start = period_end
        period_end = period_start + relativedelta(months=1)

    # Prevent duplicate invoices for the same billing period.
    existing_invoice = (
        db.query(Invoice)
        .filter(
            Invoice.subscription_id == subscription.id,
            Invoice.period_start == period_start,
            Invoice.period_end == period_end,
        )
        .first()
    )

    if existing_invoice:
        raise HTTPException(
            status_code=409,
            detail="Invoice already exists for this billing period",
        )

    plan = db.query(Plan).filter(Plan.id == subscription.plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    # Sum quantities within this billing period.
    total_requests = (
        db.query(func.coalesce(func.sum(UsageEvent.quantity), 0))
        .filter(
            UsageEvent.subscription_id == subscription.id,
            UsageEvent.created_at >= period_start,
            UsageEvent.created_at < period_end,
        )
        .scalar()
    )

    bill = calculate_bill(
        monthly_price=plan.monthly_price,
        included_requests=plan.included_requests,
        overage_price=plan.request_overage_price,
        total_requests=int(total_requests),
    )

    invoice = Invoice(
        subscription_id=subscription.id,
        period_start=period_start,
        period_end=period_end,
        total_amount=bill["total_amount"],
        status="pending",
    )

    try:
        db.add(invoice)
        db.flush()

        db.add(
            InvoiceItem(
                invoice_id=invoice.id,
                description=f"Monthly plan: {plan.name}",
                quantity=1,
                amount=plan.monthly_price,
            )
        )

        if bill["extra_requests"] > 0:
            db.add(
                InvoiceItem(
                    invoice_id=invoice.id,
                    description="Extra API requests",
                    quantity=bill["extra_requests"],
                    amount=bill["extra_charge"],
                )
            )

        db.commit()
        db.refresh(invoice)
        return invoice

    except Exception:
        db.rollback()
        raise


@router.get("/me", response_model=list[InvoiceResponse])
def my_invoices(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):
    user_id = get_authenticated_user_id(credentials)

    return (
        db.query(Invoice)
        .join(
            Subscription,
            Invoice.subscription_id == Subscription.id,
        )
        .filter(Subscription.user_id == user_id)
        .order_by(Invoice.id.desc())
        .all()
    )



@router.get(
    "/{invoice_id}/items",
    response_model=list[InvoiceItemResponse],
)
def get_invoice_items(
    invoice_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):
    user_id = get_authenticated_user_id(credentials)

    invoice = (
        db.query(Invoice)
        .join(
            Subscription,
            Invoice.subscription_id == Subscription.id,
        )
        .filter(
            Invoice.id == invoice_id,
            Subscription.user_id == user_id,
        )
        .first()
    )

    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    items = (
        db.query(InvoiceItem)
        .filter(InvoiceItem.invoice_id == invoice_id)
        .all()
    )

    return items
