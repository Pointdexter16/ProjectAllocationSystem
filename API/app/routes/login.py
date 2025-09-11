from fastapi import APIRouter, Depends, HTTPException
from app.schemas import User_schema,Credentials_schema
import bcrypt
from fastapi import status
from app.database import get_db
from app.models import User
from sqlalchemy.orm import Session
from app.utility import hash_password,generate_token,token_required


router = APIRouter(
    prefix="/login",
    tags=["login"]
)



@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_user(user: User_schema, db: Session = Depends(get_db)):
    print("create user called")
    
    hashed_password = hash_password(user.password)

    db_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password_hash=hashed_password,
        role=user.role,
        staff_id=user.staff_id,
    )

    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return {
            "first_name": db_user.first_name,
            "last_name": db_user.last_name,
            "email": db_user.email,
            "role": db_user.role,
            "staff_id": db_user.staff_id
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User creation failed: {e}"
        )


@router.post("/login_credentials", status_code=status.HTTP_201_CREATED)
async def create_user(user: Credentials_schema, db: Session = Depends(get_db)):
    print("login called")
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if not bcrypt.checkpw(user.password.encode('utf-8'), db_user.password_hash.encode('utf-8')):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password"
        )

    token=generate_token(db_user.staff_id)

    return {
        "token": token,
        "first_name": db_user.first_name,
        "last_name": db_user.last_name,
        "email": db_user.email,
        "role": db_user.role,
        "staff_id": db_user.staff_id
    }

@router.get("/secured_route")
async def secured_route(current_user: User = Depends(token_required)):
    return {
        "message": f"Hello, {current_user.first_name} {current_user.last_name}! You have accessed a secured route.",
        "user_details": {
            "first_name": current_user.first_name,
            "last_name": current_user.last_name,
            "email": current_user.email,
            "role": current_user.role,
            "staff_id": current_user.staff_id
        }
    }
