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


@router_admin.post("/project", status_code=status.HTTP_201_CREATED)
async def create_user(project: Project_schema, db: Session = Depends(get_db),current_user: Users = Depends(token_required)):
    print("create user called")
    
    db_project = Projects(
        ProjectName = project.ProjectName,
        ProjectDescription = project.ProjectDescription,
        StartDate = project.StartDate,
        EndDate = project.EndDate,
        CompletionDate = project.CompletionDate,
        projectStatus = project.projectStatus,
        projectPriority = project.projectPriority,
        Manager_id = project.Manager_id,
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
            "manager": db_project.Manager_id
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User creation failed: {e}"
        )

@router_admin.get("/project/{manager_id}", status_code=status.HTTP_201_CREATED)
async def create_user(manager_id, db: Session = Depends(get_db),current_user: Users = Depends(token_required)):
    print("create user called")
    
    db_project = Projects(
        ProjectName = project.ProjectName,
        ProjectDescription = project.ProjectDescription,
        StartDate = project.StartDate,
        EndDate = project.EndDate,
        CompletionDate = project.CompletionDate,
        projectStatus = project.projectStatus,
        projectPriority = project.projectPriority,
        Manager_id = project.Manager_id,
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
            "manager": db_project.Manager_id
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
        ProjectId = assign.ProjectId,
        Staff_id = assign.Staff_id,
        StartDate = assign.StartDate,
        EndDate = assign.EndDate,
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

