from sqlalchemy.orm import declarative_base
from datetime import date
from sqlalchemy import Column, Integer, String, Enum, Date

from sqlalchemy import Column, Integer, String, Date, Enum, Text, ForeignKey
from sqlalchemy.orm import declarative_base,relationship

Base = declarative_base()



class Users(Base):
    __tablename__ = "users"

    Staff_id = Column(Integer, primary_key=True)
    First_name = Column(String(255), nullable=False)
    Last_name = Column(String(255), nullable=False)
    Email = Column(String(255), nullable=False, unique=True)
    Password_hash = Column(String(255), nullable=False)
    Job_role = Column(Enum("employee", "manager", name="job_role_enum"), nullable=False)


    employee = relationship(
    "Employee",
    back_populates="user",
    uselist=False,
    foreign_keys="Employee.Staff_id")

    def __repr__(self):
        return f"<Users(Staff_id={self.Staff_id}, Email={self.Email}, Job_role={self.Job_role})>"



class Employee(Base):
    __tablename__ = "Employee"

    Staff_id = Column(Integer, ForeignKey("users.Staff_id", ondelete="CASCADE", onupdate="CASCADE"), primary_key=True)
    Joining_date = Column(Date, nullable=False)
    Job_title = Column(String(100), nullable=False)
    EmployeeStatus = Column(String(50), nullable=False)
    Manager_id = Column(Integer, ForeignKey("users.Staff_id", ondelete="SET NULL", onupdate="CASCADE"))


    user = relationship(
    "Users",
    back_populates="employee",
    foreign_keys=[Staff_id])
    manager = relationship("Users", foreign_keys=[Manager_id])
    project_assignments = relationship("ProjectMembers", back_populates="employee")

    def __repr__(self):
        return f"<Employee(Staff_id={self.Staff_id}, Job_role={self.Job_role}, Manager_id={self.Manager_id})>"



class Projects(Base):
    __tablename__ = "projects"

    ProjectId = Column(Integer, primary_key=True, autoincrement=True)
    ProjectName = Column(String(255), nullable=False)
    ProjectDescription = Column(Text, nullable=False)
    StartDate = Column(Date, nullable=False)
    EndDate = Column(Date, nullable=False)
    CompletionDate = Column(Date)
    projectStatus = Column(Enum("Not Started", "In Progress", "Completed", name="project_status_enum"))
    projectPriority = Column(Enum("Low", "Medium", "High", name="project_priority_enum"))

    Manager_id = Column(
        Integer,
        ForeignKey("users.Staff_id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )


    manager = relationship("Users")  
    members = relationship("ProjectMembers", back_populates="project")

    def __repr__(self):
        return f"<Projects(ProjectId={self.ProjectId}, ProjectName={self.ProjectName}, Manager_id={self.Manager_id})>"



class ProjectMembers(Base):
    __tablename__ = "project_members"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ProjectId = Column(Integer, ForeignKey("projects.ProjectId", ondelete="CASCADE", onupdate="CASCADE"), nullable=False)
    Staff_id = Column(Integer, ForeignKey("Employee.Staff_id", ondelete="CASCADE", onupdate="CASCADE"), nullable=False)
    AssignedDate = Column(Date, default=date.today)
    StartDate = Column(Date)
    EndDate = Column(Date)
    Project_status = Column(Enum("Not Started", "In Progress", "Completed", name="member_project_status_enum"), default="Not Started")

    project = relationship("Projects", back_populates="members")
    employee = relationship("Employee", back_populates="project_assignments")

    def __repr__(self):
        return f"<ProjectMembers(id={self.id}, ProjectId={self.ProjectId}, Staff_id={self.Staff_id}, Status={self.Project_status})>"
