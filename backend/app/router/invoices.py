
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from decimal import Decimal

from app.database import get_db
from app.models import User, Plan, Subscription, UsageEvent, Invoice, InvoiceItem
from app.auth.utils import get_user_id_from_token
from app.services.billing import calculate_bill
from app.schemas.invoice import InvoiceResponse

router = APIRouter(prefix="/invoices", tags=["Invoices"])
bearer_scheme = HTTPBearer()


@router.post("/generate", response_model=InvoiceResponse, status_code=201)
def generate_invoice(
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
        raise HTTPException(status_code=400, detail="No active subscription")

    plan = db.query(Plan).filter(Plan.id == subscription.plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    total_requests = (
        db.query(UsageEvent)
        .filter(UsageEvent.subscription_id == subscription.id)
        .count()
    )

    bill = calculate_bill(
        monthly_price=plan.monthly_price,
        included_requests=plan.included_requests,
        overage_price=plan.request_overage_price,
        total_requests=total_requests,
    )

    invoice = Invoice(
        subscription_id=subscription.id,
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
