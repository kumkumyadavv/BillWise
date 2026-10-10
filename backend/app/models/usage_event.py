
from datetime import datetime, timezone

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class UsageEvent(Base):
    __tablename__ = "usage_events"

    __table_args__ = (
        UniqueConstraint(
            "subscription_id",
            "event_id",
            name="uq_subscription_event",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)

    subscription_id: Mapped[int] = mapped_column(
        ForeignKey("subscriptions.id"),
        nullable=False,
    )

    event_id: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    endpoint: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    quantity: Mapped[int] = mapped_column(
        Integer,
        default=1,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
