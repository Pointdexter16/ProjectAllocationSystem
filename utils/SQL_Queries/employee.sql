CREATE DATABASE IF NOT EXISTS companydb;
USE companydb;

DROP TABLE IF EXISTS Employee;

CREATE TABLE Employee (
    Staff_id INT AUTO_INCREMENT PRIMARY KEY,
    Joining_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Role_title VARCHAR(100),
    Email VARCHAR(100) UNIQUE,
    EmployeeStatus VARCHAR(50),
    Manager_id INT
);

DROP TABLE IF EXISTS Managers;

CREATE TABLE Manager (
    manager_Id INT AUTO_INCREMENT PRIMARY KEY,
    staff_Id INT,
    FOREIGN KEY (Staff_id) REFERENCES Employee(Staff_id)
);

DROP TABLE IF EXISTS project_members;

CREATE TABLE project_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_Id INT,
    staff_id INT,
    assigned_Date DATE
);

DROP TABLE IF EXISTS projects_under_employee;   
CREATE TABLE projects_under_employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    StartDate DATE,
    EndDate DATE,
    Project_id INT,
    staff_id INT
);

DROP TABLE IF EXISTS projects;
CREATE TABLE projects (
    Project_id INT AUTO_INCREMENT PRIMARY KEY,
    ProjectName VARCHAR(255),
    StartDate DATE,
    EndDate DATE,
    projectStatus ENUM('Not Started', 'In Progress', 'Completed'),
    Budget INT,
    Manager VARCHAR(255)
);  

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    staff_id INT NOT NULL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('employee', 'manager') NOT NULL
);

INSERT INTO Employee (Role_title, Joining_date, Email, EmployeeStatus, Manager_id)
VALUES
('Software Engineer', '2023-01-10', 'john.doe@example.com', 'Active', NULL),
('Analyst', '2022-03-15', 'alice.smith@example.com', 'Active', NULL),
('HR Manager', '2020-07-01', 'michael.brown@example.com', 'Active', NULL);

INSERT INTO Employee (Role_title, Joining_date, Email, EmployeeStatus, Manager_id)
VALUES ('Marketing Lead', '2024-05-01', 'emma.wilson@example.com', 'Active', NULL);

SELECT * FROM Employee WHERE Staff_id = 1;

UPDATE Employee
SET Role_title = 'Senior Analyst', EmployeeStatus = 'Active'
WHERE Staff_id = 2;

DELETE FROM Employee WHERE Staff_id = 3;

SELECT * FROM Employee;

SELECT * FROM Employee WHERE Role_title LIKE '%IT%';