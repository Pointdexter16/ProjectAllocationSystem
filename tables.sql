CREATE DATABASE IF NOT EXISTS companydb;
USE companydb;

SET FOREIGN_KEY_CHECKS = 0;
SET FOREIGN_KEY_CHECKS = 1;


DROP TABLE IF EXISTS Employee;
CREATE TABLE Employee (
    Staff_id INT PRIMARY KEY,
    Joining_date DATE NOT NULL,
    Job_title VARCHAR(100) NOT NULL,
    EmployeeStatus VARCHAR(50) NOT NULL,
    Manager_id INT DEFAULT NULL,
    CONSTRAINT fk_manager
        FOREIGN KEY (Manager_id)
        REFERENCES users(Staff_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
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
    Manager_id INT NOT NULL,
    CONSTRAINT fk_project_manager FOREIGN KEY (Manager_id)
        REFERENCES users(Staff_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
); 

DROP TABLE IF EXISTS project_members;
CREATE TABLE project_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ProjectId INT NOT NULL,
    Staff_id INT NOT NULL,
    AssignedDate DATE DEFAULT (CURRENT_DATE),
    StartDate DATE,
    EndDate DATE,
    Project_status ENUM('Not Started', 'In Progress', 'Completed') DEFAULT 'Not Started',
    CONSTRAINT fk_pm_project FOREIGN KEY (ProjectId)
        REFERENCES projects(ProjectId)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_pm_employee FOREIGN KEY (Staff_id)
        REFERENCES Employee(Staff_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
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

SHOW TABLES;
SHOW COLUMNS FROM users;
SHOW COLUMNS FROM Employee;
SHOW COLUMNS FROM projects;
SHOW COLUMNS FROM project_members;


SELECT * FROM users; 
SELECT * FROM Employee;
SELECT * FROM projects;
SELECT * FROM project_members;


TRUNCATE TABLE Employee;
TRUNCATE TABLE projects;
TRUNCATE TABLE project_members;
TRUNCATE TABLE users;

DROP TABLE Employee;
DROP TABLE projects;
DROP TABLE project_members;
DROP TABLE users;



