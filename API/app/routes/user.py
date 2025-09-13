from fastapi import APIRouter, Depends, HTTPException
from app.schemas import User_schema,Credentials_schema,Employee_schema,loginResponse_schema
import bcrypt
from fastapi import status
from app.database import get_db,commit_to_db
from app.models import Users,Employee
from sqlalchemy.orm import Session
from app.utility import hash_password,token_required,check_user,filter_model_fields

# Base.metadata.create_all(bind=engine)

router = APIRouter(
    prefix="/user",
    tags=["user"]
)

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(user: User_schema, db: Session = Depends(get_db)):
    print("create user called")
    
    hashed_password = hash_password(user.Password_hash)

    if user.Job_role == "employee":
        user = Employee_schema(**user.dict())
        user_data = user.model_dump()#further reduce it 
        user_data.pop("Password_hash", None) 
        db_user = Users(**filter_model_fields(user_data,Users), Password_hash=hashed_password)
        db_emp = Employee(**filter_model_fields(user_data,Employee))
        commit_to_db(db,db_user)
        commit_to_db(db,db_emp)     
    else:
        user_data = user.model_dump()
        user_data.pop("Password_hash", None)
        db_user = Users(**filter_model_fields(user_data,Users), Password_hash=hashed_password)
        commit_to_db(db,db_user)

    return {"message":"User created successfully"}
    

@router.post("/login", status_code=status.HTTP_201_CREATED)
async def create_user(user: Credentials_schema, db: Session = Depends(get_db)):

    token,db_user=check_user(user,db)

    return loginResponse_schema.model_validate(db_user).model_copy(update={"token": token})


# @router.get("/secured_route")
# async def secured_route(current_user: Users = Depends(token_required)):
#     return {
#         "message": f"Hello, {current_user.First_name} {current_user.Last_name}! You have accessed a secured route.",
#         "user_details": {
#             "first_name": current_user.First_name,
#             "last_name": current_user.Last_name,
#             "email": current_user.Email,
#             "role": current_user.Job_role,
#             "staff_id": current_user.Staff_id
#         }
#     }


