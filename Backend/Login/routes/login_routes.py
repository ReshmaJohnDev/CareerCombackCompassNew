from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..schema.pydantic_models import UserCreate, UserLogin
from ..models.data_models import User
from data_manager.data_manager import get_session
from util.auth_util import get_password_hash, verify_password, create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(user_data: UserCreate, db: Session = Depends(get_session)):
    print("Reached backend")
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="User email-id already exists")

    hashed_password = get_password_hash(user_data.password)

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}

@router.post("/login")
def login(user_data: UserLogin, db: Session = Depends(get_session)):
    user = db.query(User).filter(User.email == user_data.email).first()

    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(data={"sub": user.email,"user_id": user.id})
    return {"access_token": token, "token_type": "bearer" , "name" : user.name}