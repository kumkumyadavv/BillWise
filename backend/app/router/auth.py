from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.auth import UserRegister, UserLogin
from app.auth.utils import (
    hash_password,
    verify_password,
    create_access_token
)
from app.database import get_db
from app.models import User

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        return {"message": "Email already registered"}

    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user_id": new_user.id
    }



@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not existing_user:
        return {"message": "Invalid email or password"}

    if not verify_password(
        user.password,
        existing_user.password_hash
    ):
        return {"message": "Invalid email or password"}

    token = create_access_token(existing_user.id)

    return {
        "access_token": token,
        "token_type": "bearer"
    }