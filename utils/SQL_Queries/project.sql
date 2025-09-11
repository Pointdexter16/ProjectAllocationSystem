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