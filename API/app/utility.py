import bcrypt
import jwt # remove if not in use check
import datetime
from datetime import date
from fastapi import Depends, HTTPException, status, Request, Security
from jose import jwt, JWTError, ExpiredSignatureError
from sqlalchemy.orm import Session,joinedload
from app.database import get_db  # your DB dependency
from app import models
from fastapi.security import APIKeyHeader
from app.models import Users
from sqlalchemy.inspection import inspect
from sqlalchemy import select
from app.models import Projects, ProjectMembers, Employee
from app.schemas import ProjectMemberStatusUpdate


from app.config import SECRET_KEY, ALGORITHM


api_key_header = APIKeyHeader(name="Authorization")

def hash_password(password: str) -> str:
    """
    Hashes a plain-text password using bcrypt.

    Args:
        password: The plain-text password string.

    Returns:
        The hashed password string, encoded for storage.
    """
    # The password must be encoded to bytes before hashing.
    password_bytes = password.encode('utf-8')
    # Generate a salt and hash the password in one step.
    # bcrypt.gensalt() handles generating a strong salt.
    hashed_bytes = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
    # The result is a byte string; decode it back to a string for storage.
    return hashed_bytes.decode('utf-8')

def check_password(password: str, hashed_password: str) -> bool:
    """
    Checks if a plain-text password matches a stored hashed password.

    Args:
        password: The plain-text password string to check.
        hashed_password: The stored hashed password string.

    Returns:
        True if the passwords match, False otherwise.
    """
    # Both the plain password and the stored hash must be encoded to bytes for comparison.
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))



def generate_token(user_id: int, expires_minutes: int = 60) -> str:
    """
    Generates a JWT token for a user with an expiration time.
    """
    payload = {
        "user_id": user_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=expires_minutes),
        "iat": datetime.datetime.utcnow()
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    if isinstance(token, bytes):
        token = token.decode('utf-8')  # for old pyjwt
    return token


def token_required(auth_header: str = Security(api_key_header), db: Session = Depends(get_db)):
    # auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing"
        )

    parts = auth_header.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header must be: Bearer <token>"
        )

    token = parts[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: user_id missing"
            )

        # Query DB for user
        user = db.query(models.Users).filter_by(Staff_id=user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: user not found"
            )
        return user

    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired"
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
def check_user(user,db):
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
    return token, db_user

def filter_model_fields(data: dict, model):
    model_columns = {c.key for c in inspect(model).mapper.column_attrs}
    return {k: v for k, v in data.items() if k in model_columns}

def get_projects_under_manager(db: Session, manager_id: int):
    """
    Fetch all projects managed by a specific manager, 
    along with their members and member details.
    """
    stmt = (
        select(Projects)
        .options(
            joinedload(Projects.members).joinedload(ProjectMembers.employee).joinedload(Employee.user)
        )
        .where(Projects.Manager_id == manager_id)
    )

    results = db.execute(stmt).unique().scalars().all()

    # Optional: convert into a serializable format (dict)
    projects_list = []
    for project in results:
        projects_list.append({
            "ProjectId": project.ProjectId,
            "ProjectName": project.ProjectName,
            "ProjectDescription": project.ProjectDescription,
            "StartDate": project.StartDate,
            "EndDate": project.EndDate,
            "CompletionDate": project.CompletionDate,
            "projectStatus": project.projectStatus,
            "projectPriority": project.projectPriority,
            "members": [
                {
                    "Staff_id": member.Staff_id,
                    "AssignedDate": member.AssignedDate,
                    "StartDate": member.StartDate,
                    "EndDate": member.EndDate,
                    "Project_status": member.Project_status,
                    "EmployeeName": f"{member.employee.user.First_name} {member.employee.user.Last_name}"
                }
                for member in project.members
            ]
        })

    return projects_list

def get_active_employees_by_job_title(db, job_title: str):
    stmt = (
        select(Employee)
        .options(joinedload(Employee.user))  # eager-load Users table to get employee names
        .where(Employee.EmployeeStatus == "Active")
        .where(Employee.Job_title == job_title)
    )

    employees_response = db.scalars(stmt).all()

    response = [
        {
            "Staff_id": emp.Staff_id,
            "First_name": emp.user.First_name,
            "Last_name": emp.user.Last_name,
            "Email": emp.user.Email,
            "Job_title": emp.Job_title,
            "EmployeeStatus": emp.EmployeeStatus,
            "Manager_id": emp.Manager_id,
        }
        for emp in employees_response
    ]
    return response

def get_all_managers_helper(db):
    managers = db.query(Users).filter(Users.Job_role == "manager").all()
    
    if not managers:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No managers found"
        )

    return [
        {
            "staff_id": manager.Staff_id,
            "first_name": manager.First_name,
            "last_name": manager.Last_name,
            "email": manager.Email,
            "job_role": manager.Job_role,
        }
        for manager in managers
    ]

def delete_project_helper(db, project_id: int):
    project = db.query(Projects).filter(Projects.ProjectId == project_id).first()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {project_id} not found"
        )

    try:
        db.delete(project)
        db.commit()
        return {"message": f"Project with id {project_id} deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete project: {e}"
        )
    
def update_project_in_db(db: Session, project_id: int, update_data: dict):
    project = db.query(Projects).filter(Projects.ProjectId == project_id).first()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with ID {project_id} not found"
        )

    for key, value in update_data.items():
        setattr(project, key, value)

    try:
        db.commit()
        db.refresh(project)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to update project: {e}"
        )
    return {
            "project_id": project.ProjectId,
            "project_name": project.ProjectName,
            "project_description": project.ProjectDescription,
            "start_date": project.StartDate,
            "end_date": project.EndDate,
            "completion_date": project.CompletionDate,
            "status": project.projectStatus,
            "priority": project.projectPriority,
            "manager": project.Manager_id
        }

def remove_member_from_project(db: Session, project_id: int, staff_id: int):
    member = db.query(ProjectMembers).filter(
        ProjectMembers.ProjectId == project_id,
        ProjectMembers.Staff_id == staff_id
    ).first()

    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No member found with staff_id {staff_id} in project {project_id}"
        )

    try:
        db.delete(member)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to remove member: {e}"
        )

    return {"message": f"Member {staff_id} removed from project {project_id}"}

def update_project_member_status(db: Session, updateStatus: ProjectMemberStatusUpdate):
    member = db.query(ProjectMembers).filter(
        ProjectMembers.ProjectId == updateStatus.project_id,
        ProjectMembers.Staff_id == updateStatus.staff_id
    ).first()

    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No member found with staff_id {updateStatus.staff_id} in project {updateStatus.project_id}"
        )

    try:
        member.Project_status = updateStatus.Project_status
        db.commit()
        db.refresh(member)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update project status: {e}"
        )

    return {
        "Project_status": member.Project_status
    }

def get_projects_for_employee(db: Session, employee_id: int):
    assignments = (
        db.query(ProjectMembers)
        .join(ProjectMembers.project)  # join Projects via relationship
        .filter(ProjectMembers.Staff_id == employee_id)
        .all()
    )

    if not assignments:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No projects found for employee_id {employee_id}"
        )

    return [
        {
            "project_id": a.ProjectId,
            "project_name": a.project.ProjectName,
            "start_date": a.project.StartDate,
            "end_date": a.project.EndDate,
            "completion_date": a.project.CompletionDate,
            "status": a.Project_status,
        }
        for a in assignments
    ]

def calculate_employee_workload(db: Session, user):
    
    query = (
        db.query(ProjectMembers)
        .join(ProjectMembers.project)
        .filter(
            ProjectMembers.Staff_id == user.Staff_id,
            Projects.StartDate <= user.StartDate,
            Projects.EndDate >= user.EndDate,
            Projects.projectStatus != "Completed"  # ✅ skip completed projects
        )
        .options(joinedload(ProjectMembers.project))  # pre-load project details
    )

    overlapping_projects = query.all()

    count = len(overlapping_projects)
    workload = 0.0
    if count >= 3:
        workload = 100.0
    elif count == 2:
        workload = 66.7
    elif count == 1:
        workload = 33.3
    return {
        "employee_id": user.Staff_id,
        "workload_percentage": workload,
        "start_date": user.StartDate,
        "end_date": user.EndDate
    }