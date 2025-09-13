from datetime import date
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Users, Employee, Projects, ProjectMembers  # Assuming your code is in models.py

# 1. Define the database connection
# This example uses SQLite, which is a file-based database and doesn't require a separate server.
# For a MySQL database, you would use a connection string like:
# 'mysql+pymysql://user:password@host/company_db'
engine = create_engine('mysql+pymysql://root:demo@localhost/companydb')


Session = sessionmaker(bind=engine)
session = Session()

# ---------- 2️⃣ Insert Sample Data ----------

# Create Users
manager_user = Users(
    Staff_id=1,
    First_name="Alice",
    Last_name="Smith",
    Email="alice@example.com",
    Password_hash="hashed_pw",
    Job_role="manager"
)
employee_user = Users(
    Staff_id=2,
    First_name="Bob",
    Last_name="Jones",
    Email="bob@example.com",
    Password_hash="hashed_pw",
    Job_role="employee"
)

session.add_all([manager_user, employee_user])
session.commit()

# Create Employee rows (linking to Users)
manager_employee = Employee(
    Staff_id=manager_user.Staff_id,
    Joining_date=date(2023, 1, 1),
    Job_role="Project Manager",
    EmployeeStatus="Active",
    Manager_id=None
)
employee = Employee(
    Staff_id=employee_user.Staff_id,
    Joining_date=date(2024, 1, 15),
    Job_role="Developer",
    EmployeeStatus="Active",
    Manager_id=manager_user.Staff_id
)

session.add_all([manager_employee, employee])
session.commit()

# Create Project
project = Projects(
    ProjectName="AI System",
    ProjectDescription="Develop an AI-based system",
    StartDate=date(2024, 6, 1),
    EndDate=date(2024, 12, 31),
    projectStatus="In Progress",
    projectPriority="High",
    Manager_id=manager_employee.Staff_id
)
session.add(project)
session.commit()

# Assign Employee to Project
assignment = ProjectMembers(
    ProjectId=project.ProjectId,
    Staff_id=employee.Staff_id,
    StartDate=date(2024, 6, 2),
    Project_status="In Progress"
)
session.add(assignment)
session.commit()

# ---------- 3️⃣ Query and Test Relationships ----------

print("\n--- Users and their Employee Records ---")
for u in session.query(Users).all():
    print(u, "->", u.employee)

print("\n--- Projects and their Manager ---")
for p in session.query(Projects).all():
    print(p, "-> Managed by", p.manager.user.First_name)

print("\n--- Project Members ---")
for m in session.query(ProjectMembers).all():
    print(m, "-> Employee:", m.employee.user.First_name, "-> Project:", m.project.ProjectName)

# ---------- 4️⃣ Cleanup ----------
session.close()
