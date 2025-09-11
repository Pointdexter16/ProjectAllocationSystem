DROP TABLE IF EXISTS project_members;

CREATE TABLE project_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Project_id INT,
    staff_id INT,
    AssignedDate DATE
);