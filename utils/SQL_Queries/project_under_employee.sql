DROP TABLE IF EXISTS projects_under_employee;

CREATE TABLE projects_under_employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    StartDate DATE,
    EndDate DATE,
    Project_id INT,
    staff_id INT
);