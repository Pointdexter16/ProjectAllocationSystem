from fastapi import APIRouter, Depends, HTTPException
from app.schemas import User_schema,Credentials_schema,Employee_schema,loginResponse_schema,ProjectMemberStatusUpdate,MemberWorkload
import bcrypt
from fastapi import status
from app.database import get_db,commit_to_db
from app.models import Users,Employee
from sqlalchemy.orm import Session
from app.utility import hash_password,token_required,check_user,filter_model_fields,update_project_member_status,get_projects_for_employee,calculate_employee_workload

# Base.metadata.create_all(bind=engine)

router_user = APIRouter(
    prefix="/user",
    tags=["user"]
)

@router_user.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(user: User_schema, db: Session = Depends(get_db)):
    
    hashed_password = hash_password(user.Password_hash)

    if user.Job_role == "employee":
        try:
            user = Employee_schema(**user.dict())
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid data for employee: {e}"
            )
        user_data = user.model_dump()
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
    

@router_user.post("/login", status_code=status.HTTP_201_CREATED)
async def login(user: Credentials_schema, db: Session = Depends(get_db)):

    token,db_user=check_user(user,db)

    return loginResponse_schema.model_validate(db_user).model_copy(update={"token": token})

@router_user.patch("/member", status_code=status.HTTP_200_OK)
async def change_member_status(update_status:ProjectMemberStatusUpdate,db: Session = Depends(get_db),current_user: Users = Depends(token_required)):

    return update_project_member_status(db, update_status)

@router_user.get("/project/{employee_id}", status_code=status.HTTP_200_OK)
def get_employee_projects(employee_id: int, db: Session = Depends(get_db),current_user: Users = Depends(token_required)):

    response = get_projects_for_employee(db, employee_id)
    return {"employee_id": employee_id, "projects": response}


@router_user.post("/workload")
def get_employee_workload(user: MemberWorkload,db: Session = Depends(get_db),current_user: Users = Depends(token_required)):
    
    return  calculate_employee_workload(db, user)
    


