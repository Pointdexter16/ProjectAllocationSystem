from fastapi import APIRouter, Depends, HTTPException
from app.schemas import Project_schema,ProjectMembers_schema,ProjectMemberStatusUpdate
from fastapi import status
from app.database import get_db,commit_to_db
from app.models import Users,Projects,ProjectMembers,Employee
from sqlalchemy.orm import Session
from app.utility import token_required,get_projects_under_manager,get_active_employees_by_job_title,filter_model_fields,get_all_managers_helper,delete_project_helper,update_project_in_db,remove_member_from_project,update_project_member_status


router_admin = APIRouter(
    prefix="/admin",
    tags=["admin"]
)

@router_admin.get("/", status_code=status.HTTP_200_OK)
async def get_all_managers(db: Session = Depends(get_db)):
    try:
        return get_all_managers_helper(db)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch managers: {e}"
        )


@router_admin.post("/project", status_code=status.HTTP_201_CREATED)
async def create_project(project: Project_schema, db: Session = Depends(get_db),current_user: Users = Depends(token_required)):

    project_data = filter_model_fields(project.model_dump(), Projects)
    db_project = Projects(**project_data)
    try:
        commit_to_db(db, db_project)  
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Project creation failed: {e}"
        )

    return {'message': 'Project created successfully', 'project_id': db_project.ProjectId}

@router_admin.delete("/project/{project_id}", status_code=status.HTTP_200_OK)
async def delete_project(project_id: int, db: Session = Depends(get_db), current_user=Depends(token_required)):
    return delete_project_helper(db, project_id)


@router_admin.post("/member", status_code=status.HTTP_201_CREATED)
async def assign_member(assign: ProjectMembers_schema, db: Session = Depends(get_db),current_user: Users = Depends(token_required)):
    print("create user called")


    assign_data = filter_model_fields(assign.model_dump(), ProjectMembers)

    db_assign = ProjectMembers(**assign_data)

    try:
        commit_to_db(db, db_assign)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Member assignment failed: {e}"
        )

    return {'message': 'Member assigned successfully to project'}


@router_admin.delete("/member/{project_id}/{staff_id}", status_code=status.HTTP_200_OK)
async def remove_member(
    project_id: int,
    staff_id: int,
    db: Session = Depends(get_db),
    current_user: Users = Depends(token_required)
):
    return remove_member_from_project(db, project_id, staff_id)    

@router_admin.get("/project/{manager_id}", status_code=status.HTTP_201_CREATED)
def fetch_projects_for_manager(manager_id: int, db: Session = Depends(get_db),current_user: Users = Depends(token_required)):
    projects = get_projects_under_manager(db, manager_id)
    if not projects:
        raise HTTPException(status_code=404, detail="No projects found for this manager")
    return {"manager_id": manager_id, "projects": projects}

@router_admin.get("/Employees/{job_title}", status_code=status.HTTP_200_OK)
def fetch_employees_by_job_title(job_title: str, db: Session = Depends(get_db),current_user: Users = Depends(token_required)):
    employees = get_active_employees_by_job_title(db, job_title)

    return {"employees": employees}

@router_admin.patch("/project/{project_id}", status_code=status.HTTP_200_OK)
async def update_project(project_id: int,project_data: Project_schema,db: Session = Depends(get_db),current_user: Users = Depends(token_required)
):
    updated_project = update_project_in_db(db, project_id, project_data.dict(exclude_unset=True))

    return {
        "message": "Project updated successfully",
        "project": updated_project
    }

@router_admin.get("/employee_count/{manager_id}")
async def get_employee_count(
    manager_id: int,
    db: Session = Depends(get_db)
):
    count = (
        db.query(Employee)
        .filter(Employee.Manager_id == manager_id)
        .count()
    )

    return {"manager_id": manager_id, "employee_count": count}

