from decimal import Decimal
from datetime import datetime, timezone
from calendar import monthrange
def get_current_billing_period(started_at: datetime):
    now = datetime.now(timezone.utc)
    if started_at.tzinfo is None:
        started_at = started_at.replace(tzinfo=timezone.utc)
    else:
        started_at = started_at.astimezone(timezone.utc)

    if now < started_at:
        raise ValueError("Subscription has not started")

    months = (now.year - started_at.year) * 12 + (
        now.month - started_at.month
    )

    def anniversary(month_offset: int) -> datetime:
        total_month = (
            started_at.year * 12
            + started_at.month - 1
            + month_offset
        )
        year = total_month // 12
        month = total_month % 12 + 1

        day = min(
            started_at.day,
            monthrange(year, month)[1]
        )

        return started_at.replace(
            year=year,
            month=month,
            day=day
        )

    period_start = anniversary(months)

    if period_start > now:
        months -= 1
        period_start = anniversary(months)

    period_end = anniversary(months + 1)

    return period_start, period_end



def calculate_bill(
    monthly_price: Decimal,
    included_requests: int,
    overage_price: Decimal,
    total_requests: int,
) -> dict:
    extra_requests = max(0, total_requests - included_requests)
    extra_charge = Decimal(extra_requests) * overage_price

    return {
        "included_requests": included_requests,
        "total_requests": total_requests,
        "extra_requests": extra_requests,
        "monthly_price": monthly_price,
        "extra_charge": extra_charge,
        "total_amount": monthly_price + extra_charge,
    }
