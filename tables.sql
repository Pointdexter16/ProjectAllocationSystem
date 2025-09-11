CREATE DATABASE IF NOT EXISTS companydb;
USE companydb;

SET FOREIGN_KEY_CHECKS = 0;


DROP TABLE IF EXISTS Employee;
CREATE TABLE Employee (
    Staff_id INT PRIMARY KEY,
    Joining_date DATE NOT NULL,
    Job_role VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    EmployeeStatus VARCHAR(50) NOT NULL,
    Manager_id INT DEFAULT NULL,
    FOREIGN KEY (Manager_id) REFERENCES Employee(Staff_id) ON DELETE SET NULL
);

DROP TABLE IF EXISTS Manager;
CREATE TABLE Manager(
    Staff_id INT NOT NULL,
    FOREIGN KEY (Staff_id) REFERENCES Employee(Staff_id)
);

DROP TABLE IF EXISTS projects;
CREATE TABLE projects (
    ProjectId INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    ProjectName VARCHAR(255) NOT NULL,
    ProjectDescription TEXT NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    CompletionDate DATE,
    projectStatus ENUM('Not Started', 'In Progress', 'Completed'),
    projectPriority ENUM('Low', 'Medium', 'High'),
    Manager VARCHAR(255) NOT NULL
); 

DROP TABLE IF EXISTS projects_under_employee;   
CREATE TABLE projects_under_employee (
    StartDate DATE,
    EndDate DATE,
    ProjectId INT,
    Staff_id INT,
    Project_status ENUM('Not Started', 'In Progress', 'Completed'),
    FOREIGN KEY (Staff_id) REFERENCES Employee(Staff_id),
    FOREIGN KEY (ProjectId) REFERENCES projects(ProjectId)
);

 

DROP TABLE IF EXISTS project_members;
CREATE TABLE project_members (
    ProjectId INT,
    Staff_id INT,
    AssignedDate DATE,
    FOREIGN KEY (ProjectId) REFERENCES projects(ProjectId),
    FOREIGN KEY (staff_id) REFERENCES employee(staff_id)
);

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    Staff_id INT NOT NULL PRIMARY KEY,
    First_name VARCHAR(255) NOT NULL,
    Last_name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Password_hash VARCHAR(255) NOT NULL,
    Job_role ENUM('employee', 'manager') NOT NULL
);

