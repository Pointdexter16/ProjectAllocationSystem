from pydantic import BaseModel, EmailStr
from typing import Literal
from datetime import datetime

class User_schema(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    role: Literal["employee", "manager"]
    staff_id: int
    class Config:
        orm_mode = True

class Employee_schema(BaseModel):
    manager: str
    staff_id: int
    role_title: str
    joining_data: datetime
    emp_status: Literal["active", "inactive"]
    class Config:
        orm_mode = True


class Manager_schema(BaseModel):
    staff_id: int
    class Config:
        orm_mode = True

class Project_schema(BaseModel):
    project_id: int
    project_title: str
    manager: str
    start_data: datetime
    end_data: datetime
    status: Literal["active", "inactive"] #incomplete requirement changes based on model pushed on git
    class Config:
        orm_mode = True

class ProjectMembers_schema(BaseModel):
    project_id: int
    staff_id: int
    assigned_date: datetime
    class Config:
        orm_mode = True

class ProjectUnderEmp_schema(BaseModel):
    staff_id: int
    start_data: datetime
    end_data: datetime
    project_id: int
    class Config:
        orm_mode = True


class Credentials_schema(BaseModel):
    email: EmailStr
    password: str
    class Config:
        orm_mode = True

class uesrEntry_schema(BaseModel):
    user_detail: User_schema
    token: str
    class Config:
        orm_mode = True

