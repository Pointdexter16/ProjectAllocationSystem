import bcrypt
import jwt # remove if not in use check
import datetime

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
