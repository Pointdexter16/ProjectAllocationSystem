CREATE DATABASE IF NOT EXISTS companydb;
USE companydb;

DROP TABLE IF EXISTS Employee;
CREATE TABLE Employee (
    Staff_id INT AUTO_INCREMENT PRIMARY KEY,
    Joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
    Job_role VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    EmployeeStatus VARCHAR(50) NOT NULL,
    Manager_id INT DEFAULT NULL,
    FOREIGN KEY (Manager_id) REFERENCES Employee(Staff_id) ON DELETE SET NULL
);

DROP TABLE IF EXISTS Managers;
CREATE TABLE Manager (
    Staff_id INT NOT NULL,
    FOREIGN KEY (Staff_id) REFERENCES Employee(Staff_id)
);

DROP TABLE IF EXISTS project_members;
CREATE TABLE project_members (
    ProjectId INT,
    Staff_id INT,
    AssignedDate DATE,
    FOREIGN KEY (ProjectId) REFERENCES projects(ProjectId)
);

DROP TABLE IF EXISTS projects_under_employee;   
CREATE TABLE projects_under_employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    StartDate DATE,
    EndDate DATE,
    ProjectId INT,
    Staff_id INT,
    Project_status ENUM('Not Started', 'In Progress', 'Completed'),
    FOREIGN KEY (Staff_id) REFERENCES Employee(Staff_id)
);

DROP TABLE IF EXISTS projects;
CREATE TABLE projects (
    ProjectId INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    ProjectName VARCHAR(255) NOT NULL,
    ProjectDescription TEXT NOT NULL,
    StartDate DATE NOT NULL DEFAULT CURRENT_DATE,
    EndDate DATE NOT NULL,
    CompletionDate DATE,
    projectStatus ENUM('Not Started', 'In Progress', 'Completed'),
    projectPriority ENUM('Low', 'Medium', 'High'),
    Manager VARCHAR(255) NOT NULL
);  

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    Staff_id INT NOT NULL PRIMARY KEY,
    First_name VARCHAR(255) NOT NULL,
    Last_name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Password_hash VARCHAR(255) NOT NULL UNIQUE,
    Job_role ENUM('employee', 'manager') NOT NULL
);

INSERT INTO Employee (Job_role, Joining_date, Email, EmployeeStatus, Manager_id)
VALUES
('Software Engineer', '2023-01-10', 'john.doe@example.com', 'Active', NULL),
('Analyst', '2022-03-15', 'alice.smith@example.com', 'Active', NULL),
('HR Manager', '2020-07-01', 'michael.brown@example.com', 'Active', NULL);


-- For testing purpose only:

-- INSERT INTO Employee (Role_title, Joining_date, Email, EmployeeStatus, Manager_id)
-- VALUES ('Marketing Lead', '2024-05-01', 'emma.wilson@example.com', 'Active', NULL);

-- SELECT * FROM Employee WHERE Staff_id = 1;

-- UPDATE Employee
-- SET Job_role = 'Senior Analyst', EmployeeStatus = 'Active'
-- WHERE Staff_id = 2;

-- DELETE FROM Employee WHERE Staff_id = 3;

-- SELECT * FROM Employee;

-- SELECT * FROM Employee WHERE Job_role LIKE '%IT%';