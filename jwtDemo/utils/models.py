from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Date, Float

Base = declarative_base()

class Employee(Base):
    __tablename__ = "employees"
    Emp_id = Column(Integer, primary_key=True, autoincrement=True)
    FirstName = Column(String)
    LastName = Column(String)
    StartDate = Column(Date)
    Title = Column(String)
    Email = Column(String)
    EmployeeStatus = Column(String)
    Department = Column(String)
    PerformanceScore = Column(Integer)
    CurrentRating = Column(Float)
    Manager = Column(String)