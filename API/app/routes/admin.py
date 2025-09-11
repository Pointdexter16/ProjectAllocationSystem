from fastapi import APIRouter, Depends, HTTPException
from app.schemas import User_schema,Credentials_schema,Project_schema,ProjectMembers_schema
import bcrypt
from fastapi import status
from app.database import get_db
from app.models import Users,Projects,ProjectMembers
from sqlalchemy.orm import Session
from app.utility import hash_password,generate_token,token_required


router_admin = APIRouter(
    prefix="/admin",
    tags=["admin"]
)


@router_admin.post("/create_project", status_code=status.HTTP_201_CREATED)
async def create_user(project: Project_schema, db: Session = Depends(get_db),current_user: Users = Depends(token_required)):
    print("create user called")
    
    db_project = Projects(
        ProjectName = project.project_name,
        ProjectDescription = project.project_description,
        StartDate = project.start_data,
        EndDate = project.end_data,
        CompletionDate = project.completion_date,
        projectStatus = project.status,
        projectPriority = project.priority,
        Manager = project.manager,
    )

    try:
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        return {
            "project_id": db_project.ProjectId,
            "project_name": db_project.ProjectName,
            "project_description": db_project.ProjectDescription,
            "start_data": db_project.StartDate,
            "end_data": db_project.EndDate,
            "completion_date": db_project.CompletionDate,
            "status": db_project.projectStatus,
            "priority": db_project.projectPriority,
            "manager": db_project.Manager
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User creation failed: {e}"
        )


@router_admin.post("/assign_member", status_code=status.HTTP_201_CREATED)
async def create_user(assign: ProjectMembers_schema, db: Session = Depends(get_db),current_user: Users = Depends(token_required)):
    print("create user called")


    db_assign = ProjectMembers(
        ProjectId = assign.project_id,
        Staff_id = assign.staff_id,
        StartDate = assign.start_data,
        EndDate = assign.end_data,
    )

    try:
        db.add(db_assign)
        db.commit()
        db.refresh(db_assign)
        return {
            "assigned_id": db_assign.id,
            "project_id": db_assign.ProjectId,
            "staff_id": db_assign.Staff_id,
            "assigned_date": db_assign.AssignedDate,
            "start_data": db_assign.StartDate,
            "end_data": db_assign.EndDate
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User creation failed: {e}"
        )

# @router.post("/login_credentials", status_code=status.HTTP_201_CREATED)
# async def create_user(user: Credentials_schema, db: Session = Depends(get_db)):
#     print("login called")
#     db_user = db.query(Users).filter(Users.email == user.email).first()
#     if not db_user:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="User not found"
#         )

#     if not bcrypt.checkpw(user.password.encode('utf-8'), db_user.password_hash.encode('utf-8')):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect password"
#         )

#     token=generate_token(db_user.staff_id)

#     return {
#         "token": token,
#         "first_name": db_user.first_name,
#         "last_name": db_user.last_name,
#         "email": db_user.email,
#         "role": db_user.role,
#         "staff_id": db_user.staff_id
#     }

# @router.get("/secured_route")
# async def secured_route(current_user: Users = Depends(token_required)):
#     return {
#         "message": f"Hello, {current_user.first_name} {current_user.last_name}! You have accessed a secured route.",
#         "user_details": {
#             "first_name": current_user.first_name,
#             "last_name": current_user.last_name,
#             "email": current_user.email,
#             "role": current_user.role,
#             "staff_id": current_user.staff_id
#         }
#     }
