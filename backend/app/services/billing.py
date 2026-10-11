
from decimal import Decimal



from decimal import Decimal


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
