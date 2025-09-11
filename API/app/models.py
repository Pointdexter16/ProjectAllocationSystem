from sqlalchemy.orm import declarative_base
from datetime import date
Base = declarative_base()
from sqlalchemy import Column, Integer, String, Enum, Date

from sqlalchemy import Column, Integer, String, Date, Enum, Text, ForeignKey
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Employee(Base):
    __tablename__ = "Employee"

    Staff_id = Column(Integer, primary_key=True)
    Joining_date = Column(Date, nullable=False)
    Job_role = Column(String(100), nullable=False)
    EmployeeStatus = Column(String(50), nullable=False)
    Manager_id = Column(Integer,nullable=False)


class Manager(Base):
    __tablename__ = "Manager"

    Staff_id = Column(Integer, primary_key=True)


class Projects(Base):
    __tablename__ = "projects"

    ProjectId = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    ProjectName = Column(String(255), nullable=False)
    ProjectDescription = Column(Text, nullable=False)
    StartDate = Column(Date, nullable=False)
    EndDate = Column(Date, nullable=False)
    CompletionDate = Column(Date)
    projectStatus = Column(Enum("Not Started", "In Progress", "Completed"))
    projectPriority = Column(Enum("Low", "Medium", "High"))
    Manager = Column(String(255), nullable=False)


class ProjectsUnderEmployee(Base):
    __tablename__ = "projects_under_employee"

    id = Column(Integer, primary_key=True, autoincrement=True)
    StartDate = Column(Date)
    EndDate = Column(Date)
    ProjectId = Column(Integer)
    Staff_id = Column(Integer)
    Project_status = Column(Enum("Not Started", "In Progress", "Completed"))


class ProjectMembers(Base):
    __tablename__ = "project_members"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ProjectId = Column(Integer)
    Staff_id = Column(Integer)
    AssignedDate = Column(Date,default=date.today)
    StartDate = Column(Date)
    EndDate = Column(Date)


class Users(Base):
    __tablename__ = "users"

    Staff_id = Column(Integer, primary_key=True, nullable=False)
    First_name = Column(String(255), nullable=False)
    Last_name = Column(String(255), nullable=False)
    Email = Column(String(255), nullable=False, unique=True)
    Password_hash = Column(String(255), nullable=False)
    Job_role = Column(Enum("employee", "manager"), nullable=False)
