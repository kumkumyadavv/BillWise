
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Plan
from app.schemas.plan import PlanCreate, PlanResponse

router = APIRouter(prefix="/plans", tags=["Plans"])


@router.post("/", response_model=PlanResponse, status_code=201)
def create_plan(data: PlanCreate, db: Session = Depends(get_db)):
    existing = db.query(Plan).filter(Plan.name == data.name).first()

    if existing:
        raise HTTPException(status_code=409, detail="Plan already exists")

    plan = Plan(**data.model_dump())
    db.add(plan)
    db.commit()
    db.refresh(plan)

    return plan


@router.get("/", response_model=list[PlanResponse])
def list_plans(db: Session = Depends(get_db)):
    return db.query(Plan).order_by(Plan.id).all()
