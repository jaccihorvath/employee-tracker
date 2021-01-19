DROP DATABASE IF EXISTS employee_db;
CREATE database employee_db;

USE employee_db;

INSERT INTO department (name) VALUES 
('Administrative'), 
('Government Affairs'), 
('Marketing'), 
('Economic Development'), 
('Sales');

INSERT INTO role (title, salary, department_id) VALUES 
('CEO', 250000, 1),
('COO', 120000, 1),
('Executive Assistant', 40000, 1),
('Director, Government Affairs', 85000, 2),
('Graphic Designer', 50000, 3),
('VP of Marketing', 100000, 3),
('Manager, Business Development', 55000, 4),
('Director of Research', 85000, 4),
('Account Executive', 65000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Timothy', 'Hawthorne', 1, NULL),
('Susan', 'Blake', 2, 1),
('Janet', 'Tiger', 3, 1),
('Gabe', 'Costello', 4, 1),
('Jamie', 'Herr', 5, 6),
('Kimberly', 'Cannon', 6, 1),
('Scott', 'Myers', 7, 2),
('Mindy', 'Phillips', 8, 2),
('Matt', 'Kemp', 9, 6);
