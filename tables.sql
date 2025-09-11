CREATE DATABASE IF NOT EXISTS company_db;
USE companydb;

SET FOREIGN_KEY_CHECKS = 0;


DROP TABLE IF EXISTS Employee;
CREATE TABLE Employee (
    Staff_id INT PRIMARY KEY,
    Joining_date DATE NOT NULL,
    Job_role VARCHAR(100) NOT NULL,
    EmployeeStatus VARCHAR(50) NOT NULL,
    Manager_id INT DEFAULT NULL
);

DROP TABLE IF EXISTS Manager;
CREATE TABLE Manager(
    Staff_id INT NOT NULL
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
	id INT AUTO_INCREMENT PRIMARY KEY,
    StartDate DATE,
    EndDate DATE,
    ProjectId INT,
    Staff_id INT,
    Project_status ENUM('Not Started', 'In Progress', 'Completed')
);

 

DROP TABLE IF EXISTS project_members;
CREATE TABLE project_members (
	id INT AUTO_INCREMENT PRIMARY KEY,
    ProjectId INT,
    Staff_id INT,
    AssignedDate DATE DEFAULT (CURRENT_DATE),
    StartDate DATE,
    EndDate DATE
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
SHOW COLUMNS FROM Manager;
SHOW COLUMNS FROM projects;
SHOW COLUMNS FROM project_members;
SHOW COLUMNS FROM projects_under_employee;


SELECT * FROM users; 
SELECT * FROM Employee;
SELECT * FROM Manager;
SELECT * FROM projects;
SELECT * FROM project_members;
SELECT * FROM projects_under_employee;


TRUNCATE TABLE Employee;
TRUNCATE TABLE Manager;
TRUNCATE TABLE projects;
TRUNCATE TABLE project_members;
TRUNCATE TABLE projects_under_employee;
TRUNCATE TABLE users;

