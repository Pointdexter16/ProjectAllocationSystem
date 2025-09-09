from fastapi import APIRouter, Depends, HTTPException
from app.schemas import UserCreate
import bcrypt
from fastapi import status
from app.database import get_db, session
from app.models import User
from sqlalchemy.orm import Session
# from sqlalchemy.orm import Session
# from .. import models, schemas, database

router = APIRouter(
    prefix="/create",
    tags=["create"]
)



@router.post("/users/", status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Creates a new user with a hashed password.

    Args:
        user (UserCreate): The user data provided in the request body.
        db (Session): The database session dependency.

    Returns:
        A dictionary containing the created user's data (excluding password).
    """
    print("create user called")
    # Hash the password using bcrypt before storing it
    # You need to install bcrypt: `pip install bcrypt`
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())

    # Create a new SQLAlchemy ORM model instance
    db_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password_hash=hashed_password.decode('utf-8'),
        role=user.role,
        staff_id=user.staff_id,
    )

    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return {
            "user_id": db_user.user_id,
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

