from fastapi import APIRouter, Depends, HTTPException
from app.schemas import User_schema,Credentials_schema,Employee_schema
import bcrypt
from fastapi import status
from app.database import get_db
from app.models import Users,Employee,Manager
from sqlalchemy.orm import Session
from app.utility import hash_password,generate_token,token_required

# Base.metadata.create_all(bind=engine)

router = APIRouter(
    prefix="/login",
    tags=["login"]
)

@router.post("/create/employee", status_code=status.HTTP_201_CREATED)
async def create_user(user: Employee_schema, db: Session = Depends(get_db)):
    print("create user called")
    
    hashed_password = hash_password(user.password)

    db_user = Users(
        First_name=user.first_name,  #directly pass this through a object make it cleaner
        Last_name=user.last_name,   #control should be clean
        Email=user.email,           #api end point naming should be clean
        Password_hash=hashed_password,
        Job_role=user.role,
        Staff_id=user.staff_id,
    )


    db_emp = Employee(
        Staff_id=user.staff_id,
        Joining_date=user.joining_data,
        Job_role=user.role_title,
        EmployeeStatus=user.emp_status,
        Manager_id=user.manager_id,
    )

    try:
        db.add(db_user)
        db.add(db_emp)
        db.commit()
        db.refresh(db_user)
        db.refresh(db_emp)
        return {
            "first_name": db_user.First_name,
            "last_name": db_user.Last_name,
            "email": db_user.Email,
            "role": db_user.Job_role,
            "staff_id": db_user.Staff_id
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User creation failed: {e}"
        )



@router.post("/create/manager", status_code=status.HTTP_201_CREATED)
async def create_user(user: User_schema, db: Session = Depends(get_db)):
    print("create user called")
    
    hashed_password = hash_password(user.password)

    db_user = Users(
        First_name=user.first_name,
        Last_name=user.last_name,
        Email=user.email,
        Password_hash=hashed_password,
        Job_role=user.role,
        Staff_id=user.staff_id,
    )


    db_man = Manager(
        Staff_id=user.staff_id,
    )

    try:
        db.add(db_user)
        db.add(db_man)
        db.commit()
        db.refresh(db_user)
        db.refresh(db_man)
        return {
            "first_name": db_user.First_name,
            "last_name": db_user.Last_name,
            "email": db_user.Email,
            "role": db_user.Job_role,
            "staff_id": db_user.Staff_id
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
    db_user = db.query(Users).filter(Users.Email == user.email).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if not bcrypt.checkpw(user.password.encode('utf-8'), db_user.Password_hash.encode('utf-8')):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password"
        )

    token=generate_token(db_user.Staff_id)

    return {
        "token": token,
        "first_name": db_user.First_name,
        "last_name": db_user.Last_name,
        "email": db_user.Email,
        "role": db_user.Job_role,
        "staff_id": db_user.Staff_id
    }

@router.get("/secured_route")
async def secured_route(current_user: Users = Depends(token_required)):
    return {
        "message": f"Hello, {current_user.First_name} {current_user.Last_name}! You have accessed a secured route.",
        "user_details": {
            "first_name": current_user.First_name,
            "last_name": current_user.Last_name,
            "email": current_user.Email,
            "role": current_user.Job_role,
            "staff_id": current_user.Staff_id
        }
    }


