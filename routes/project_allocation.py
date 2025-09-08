from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI(title="Project Allocation System")

# --------------------------
# Models
# --------------------------
class Employee(BaseModel):
    id: int
    name: str
    allocated_projects: List[str] = []

class Project(BaseModel):
    name: str
    description: str

class AssignProjectRequest(BaseModel):
    employee_id: int
    project_name: str

# --------------------------
# In-memory storage
# --------------------------
employees: Dict[int, Employee] = {
    1: Employee(id=1, name="Alice"),
    2: Employee(id=2, name="Bob"),
}

projects: Dict[str, Project] = {
    "ProjectA": Project(name="ProjectA", description="Website development"),
    "ProjectB": Project(name="ProjectB", description="Mobile app"),
}

# --------------------------
# Admin Routes
# --------------------------
@app.post("/admin/assign_project")
def assign_project(request: AssignProjectRequest):
    employee = employees.get(request.employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    if request.project_name not in projects:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if request.project_name in employee.allocated_projects:
        raise HTTPException(status_code=400, detail="Project already assigned")
    
    employee.allocated_projects.append(request.project_name)
    return {"message": f"Project '{request.project_name}' assigned to {employee.name}"}


@app.post("/admin/remove_project")
def remove_project(request: AssignProjectRequest):
    employee = employees.get(request.employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    if request.project_name not in employee.allocated_projects:
        raise HTTPException(status_code=400, detail="Project not assigned to employee")
    
    employee.allocated_projects.remove(request.project_name)
    return {"message": f"Project '{request.project_name}' removed from {employee.name}"}


@app.get("/admin/employee_bandwidth/{employee_id}")
def get_employee_bandwidth(employee_id: int):
    employee = employees.get(employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Assume each project takes 1 unit of bandwidth, max capacity = 5
    max_capacity = 5
    used_capacity = len(employee.allocated_projects)
    available_capacity = max_capacity - used_capacity
    
    return {
        "employee": employee.name,
        "allocated_projects": employee.allocated_projects,
        "used_capacity": used_capacity,
        "available_capacity": available_capacity
    }

# --------------------------
# Employee Routes
# --------------------------
@app.get("/employee/{employee_id}/projects")
def get_employee_projects(employee_id: int):
    employee = employees.get(employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    return {
        "employee": employee.name,
        "allocated_projects": employee.allocated_projects
    }
