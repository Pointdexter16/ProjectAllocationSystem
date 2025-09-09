from sqlalchemy import Column, Integer, String, Date, DECIMAL, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class Employee(Base):
    __tablename__ = "employees"

    Emp_id = Column(Integer, primary_key=True, autoincrement=True)
    FirstName = Column(String(50), nullable=False)
    LastName = Column(String(50), nullable=False)
    StartDate = Column(Date, nullable=False)
    ExitDate = Column(Date, nullable=True)
    Title = Column(String(100), nullable=False)
    Email = Column(String(100), unique=True, nullable=False)
    EmployeeStatus = Column(String(20), nullable=False)
    Department = Column(String(50), nullable=False)
    PerformanceScore = Column(Integer, default=0)
    CurrentRating = Column(DECIMAL(3,2), default=0.0)
    Manager = Column(String(100), nullable=True)
