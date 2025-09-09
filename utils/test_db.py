from datetime import date
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Employee

def add_employee(session, **kwargs):
    emp = Employee(**kwargs)
    session.add(emp)
    session.flush()
    return emp

def get_employee(session, emp_id):
    return session.query(Employee).filter_by(Emp_id=emp_id).first()

def update_employee(session, emp_id, **kwargs):
    emp = get_employee(session, emp_id)
    if emp:
        for key, value in kwargs.items():
            setattr(emp, key, value)
        session.commit()
    return emp

def list_employees(session):
    return session.query(Employee).all()

def delete_employee(session, emp_id):
    emp = get_employee(session, emp_id)
    if emp:
        session.delete(emp)
        session.commit()
        return True
    return False

# Setup in-memory SQLite for testing
engine = create_engine("sqlite:///:memory:", echo=True)
SessionLocal = sessionmaker(bind=engine)
Base.metadata.create_all(engine)

session = SessionLocal()

# Test adding an employee
emp = add_employee(
    session,
    FirstName="John",
    LastName="Doe",
    StartDate=date.today(),
    Title="Software Engineer",
    Email="john.doe@example.com",
    EmployeeStatus="Active",
    Department="IT",
    PerformanceScore=85,
    CurrentRating=4.7,
    Manager="Jane Smith"
)
session.commit()
print("Added:", emp.Emp_id, emp.FirstName, emp.LastName)

emp = get_employee(session, emp.Emp_id)
print("Fetched:", emp.FirstName, emp.LastName, emp.Department)

updated_emp = update_employee(session, emp.Emp_id, Title="Senior Engineer", Department="R&D")
print("Updated:", updated_emp.Title, updated_emp.Department)

all_emps = list_employees(session)
print("Total Employees:", len(all_emps))

success = delete_employee(session, emp.Emp_id)
print("Deleted:", success)

check = get_employee(session, emp.Emp_id)
print("Exists after delete:", check)
