from sqlalchemy.orm import declarative_base
from datetime import date
Base = declarative_base()
from sqlalchemy import Column, Integer, String, Enum, Date

class User(Base):
    __tablename__ = 'users'

    staff_id = Column(Integer, nullable=False, primary_key=True)
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum('employee', 'manager'), nullable=False)

class Employee(Base):
    __tablename__ = "employees"

    staff_id = Column(Integer, primary_key=True, autoincrement=True)
    JoiningDate = Column(Date)
    RoleTitle = Column(String)
    Email = Column(String)
    EmployeeStatus = Column(String)
    Manager = Column(String)

class Manager(Base):
    __tablename__ = "managers"

    staff_id = Column(Integer, primary_key=True, autoincrement=True)

class Project(Base):
    __tablename__ = "projects"

    Project_id = Column(Integer, primary_key=True, autoincrement=True)
    ProjectName = Column(String)
    StartDate = Column(Date)
    EndDate = Column(Date)
    projectStatus = Column(String, Enum('Not Started', 'In Progress', 'Completed'))
    Budget = Column(Integer)
    Manager = Column(String)

class ProjectMembers(Base):
    __tablename__ = "project_members"

    id = Column(Integer, primary_key=True, autoincrement=True)
    Project_id = Column(Integer)
    staff_id = Column(Integer)
    AssignedDate = Column(Date)

class ProjectUnderEmployee(Base):
    __tablename__ = "projects_under_employee"

    id = Column(Integer, primary_key=True, autoincrement=True)
    StartDate = Column(Date)
    EndDate = Column(Date)
    Project_id = Column(Integer)
    staff_id = Column(Integer)