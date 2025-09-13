from sqlalchemy.inspection import inspect
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, Date
from pydantic import BaseModel, EmailStr
from typing import Literal
from datatime import datetime
def demo(a=0,b=0):
    return a+b


Base = declarative_base()
# Example SQLAlchemy model

class Employee(Base):
    __tablename__ = "Employee"

    Staff_id = Column(Integer, primary_key=True)
    Joining_date = Column(Date, nullable=False)
    Job_role = Column(String(100), nullable=False)
    Email = Column(String(100), nullable=False, unique=True)
    EmployeeStatus = Column(String(50), nullable=False)
    Manager_id = Column(Integer, nullable=False)


class User_schema(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    role: Literal["employee", "manager"]
    staff_id: int
    class Config:
        orm_mode = True

class Employee_schema(User_schema):
    manager_id: int
    role_title: str
    joining_data: datetime
    emp_status: Literal["active", "inactive"]
    class Config:
        orm_mode = True

# Introspect and list all columns
mapper = inspect(Employee)
field_dics={}
fields = [field_dics.update({column.key:0}) for column in mapper.columns]
print(field_dics)


