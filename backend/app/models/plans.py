from decimal import Decimal
from sqlalchemy import String, Integer, Numeric
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base

class Plan(Base):
    __tablename__="plans"
    id:Mapped[int]=mapped_column(primary_key=True)
    name:Mapped[String]=mapped_column(String(100),unique=True)
    monthly_price: Mapped[Decimal] = mapped_column(
        Numeric(10, 2)
    )
    included_requests: Mapped[int] = mapped_column(
        Integer, default=10000
    )
    request_overage_price: Mapped[Decimal] = mapped_column(
        Numeric(10, 4)
    )

