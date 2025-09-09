from sqlalchemy.orm import Session
from datetime import date

# Add an employee
def add_employee(session: Session, **kwargs):
    new_employee = Employee(**kwargs)
    session.add(new_employee)
    session.commit()
    session.refresh(new_employee)
    return new_employee

# Get employee by ID
def get_employee(session: Session, emp_id: int):
    return session.query(Employee).filter(Employee.Emp_id == emp_id).first()

# Update employee
def update_employee(session: Session, emp_id: int, **kwargs):
    employee = session.query(Employee).filter(Employee.Emp_id == emp_id).first()
    if not employee:
        return None
    for key, value in kwargs.items():
        if hasattr(employee, key):
            setattr(employee, key, value)
    session.commit()
    session.refresh(employee)
    return employee

# Delete employee
def delete_employee(session: Session, emp_id: int):
    employee = session.query(Employee).filter(Employee.Emp_id == emp_id).first()
    if not employee:
        return False
    session.delete(employee)
    session.commit()
    return True

# List employees (optionally by department)
def list_employees(session: Session, department: str = None):
    query = session.query(Employee)
    if department:
        query = query.filter(Employee.Department == department)
    return query.all()
