from pydantic import BaseModel, EmailStr,ConfigDict
from typing import Literal,Optional
from datetime import datetime

class User_schema(BaseModel):
    Staff_id: int
    First_name: str
    Last_name: str
    Email: EmailStr
    Password_hash: str
    Job_role: Literal["manager","employee"]
    Joining_date: Optional[datetime] 
    Job_title: Optional[str] 
    EmployeeStatus: Optional[Literal["active", "inactive"]] 
    Manager_id: Optional[int] 
    
    model_config = ConfigDict(from_attributes=True,extra="ignore")

class Employee_schema(User_schema):
    Joining_date: datetime
    Job_title: str
    EmployeeStatus: Literal["active", "inactive"]
    Manager_id: int

    model_config = ConfigDict(from_attributes=True,extra="ignore")    


class Project_schema(BaseModel):
    ProjectName: str
    ProjectDescription: str
    StartDate: datetime
    EndDate: datetime
    CompletionDate: Optional[datetime] = None
    projectStatus: Literal["Not Started", "In Progress","Completed"] #incomplete requirement changes based on model pushed on git
    projectPriority: Literal["Low", "Medium", "High"]
    Manager_id: int
    
    model_config = ConfigDict(from_attributes=True)

class ProjectMembers_schema(BaseModel):
    ProjectId: int
    Staff_id: int
    AssignedDate: Optional[datetime] = None
    StartDate: datetime
    EndDate: datetime
    Project_status: Literal['Not Started', 'In Progress', 'Completed']   
    
    model_config = ConfigDict(from_attributes=True)


class Credentials_schema(BaseModel):
    email: EmailStr
    password: str
    
    model_config = ConfigDict(from_attributes=True)

class loginResponse_schema(BaseModel):
    token: Optional[str] = None
    First_name: str
    Last_name: str
    Email: EmailStr
    Job_role: Literal["manager","employee"]
    Staff_id: int

    model_config = ConfigDict(from_attributes=True)


