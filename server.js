// dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');


// establish connection
let connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'jacci',
    database: 'employee_db'
});



connection.connect(function(err) {
    if (err) throw err;
    mainMenu();
});



// validate user input
function validateInput(value) {
    if (value) {
        return true;
    } else {
        return "Please enter a valid input."
    }
};


function validateNum(value) {
    if (isNaN(value) === false) {
        return true;
    } else {
        return 'Please enter a valid number.'
    }
};


// main menu prompt
function mainMenu() {
    inquirer.prompt({
        name: 'task',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'Add departments, roles or employees',
            'View departments, roles or employees',
            'Update employee roles',
            'EXIT'
        ]
    }).then((answers) => {
        switch (answers.task) {
            case 'Add departments, roles or employees':
                add();
                break;

            case 'View departments, roles or employees':
                view();
                break;

            case 'Update employee roles':
                update();
                break;

            case 'EXIT':
                connection.end();
                break;
        }
    });
};


// functions to add items ____________________________________________________________________________________
function add() {
    inquirer.prompt({
            name: 'add',
            type: 'list',
            message: 'What would you like to add?',
            choices: [
                'Departments',
                'Roles',
                'Employees'
            ]
    }).then((answers) => {
        switch (answers.add) {
            case 'Departments':
                addDept();
                break;

            case 'Roles': 
                addRole();
                break;

            case 'Employees':
                addEmployee();
                break;
        };
    });
};



function addDept() {

        inquirer.prompt({
            name: 'deptName',
            type: 'input',
            message: 'Please enter the department name:',
            validate: validateInput
        }).then((answers) => {
            const query = 'INSERT INTO department SET ?';

            connection.query(query,
                {
                    name: answers.deptName
                },
                function (err) {
                    if (err) throw err;

                    console.log(answers.deptName + ' department successfully added!');

                    mainMenu();
                });
        });
};



function addRole() {
    const deptQ = "SELECT CONCAT(department.id, ' ', department.name) AS name FROM department;";
    const view = "SELECT * FROM role";

    connection.query(view, function (err, data) {
        if (err) throw err;

        connection.query(deptQ, function (err, depts) {
            if (err) throw err;


            inquirer.prompt([
                {
                    name: 'roleTitle',
                    type: 'input',
                    message: 'Please enter the role title:',
                    validate: validateInput
                },
                {
                    name: 'roleSalary',
                    type: 'input',
                    message: 'Please enter the role salary:',
                    validate: validateNum
                },
                {
                    name: 'roleDeptId',
                    type: 'list',
                    message: 'Please select the department under which this role falls:',
                    choices: [...depts],
                },
            ]).then((answers) => {
                const query = 'INSERT INTO role (title, salary, department_id) VALUES (? ,? ,?)';
    
                connection.query(query,
                    [
                        answers.roleTitle,
                        answers.roleSalary,
                        answers.roleDeptId.split(" ")[0]
                    ],

                    function (err) {
                        if (err) throw err;

                        console.log(answers.roleTitle + ' role successfully added!')

                        mainMenu();
                    });
            });
        });
    });
};



function addEmployee() {
    const roleQ = "SELECT CONCAT(role.id, ' ', role.title) AS name FROM role;";
    const empQ = "SELECT CONCAT(employee.id, ' ', employee.first_name, ' ', employee.last_name) AS name FROM employee;";

    
    connection.query(roleQ, function (err, res) {
        if (err) throw err;

        connection.query(empQ, function (err, manager) {
            if (err) throw err;


                inquirer.prompt([
                    {
                        name: 'empFirstName',
                        type: 'input',
                        message: "Please enter the employee's first name:",
                        validate: validateInput
                    },
                    {
                        name: 'empLastName',
                        type: 'input',
                        message: "Please enter the employee's last name:",
                        validate: validateInput
                    },
                    {
                        name: 'empRoleId',
                        type: 'list',
                        message: "Please select the employee's role:",
                        choices: [...res]
                    },
                    {
                        name: 'empManagerId',
                        type: 'list',
                        message: "Please select this employee's manager:",
                        choices: [...manager, 'NULL']
                    },
                ]).then((answers) => {
                    const query1 = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (? ,? ,? ,NULL);";
                    if (answers.empManagerId == 'NULL') {
                        connection.query(query1,
                            [
                                answers.empFirstName,
                                answers.empLastName,
                                answers.empRoleId.split(" ")[0],
                            ], function (err, data) {
                                if (err) throw err;

                                console.log(answers.empFirstName + ' ' + answers.empLastName + ' was successfully added to your employees!')
                            
                                mainMenu();
                            });
                    
                    } else {
                        const query2 = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (? ,? ,? ,?);";

                        connection.query(query2,
                            [
                                answers.empFirstName,
                                answers.empLastName,
                                answers.empRoleId.split(" ")[0],
                                answers.empRoleId.split(" ")[0]
                            ], function (err, data) {
                                if (err) throw err;

                                console.log(answers.empFirstName + ' ' + answers.empLastName + ' was successfully added to your employees!')
                            
                                mainMenu();
                            });
                    }
                });
            });
        });
};




// functions to view items _________________________________________________________________________________
function view() {
    inquirer.prompt({
            name: 'view',
            type: 'list',
            message: 'What would you like to view?',
            choices: [
                'Departments',
                'Roles',
                'Employees',
                'All data'
            ]
    }).then((answers) => {
        switch (answers.view) {
            case 'Departments':
                viewDept();
                break;

            case 'Roles':
                viewRole();
                break;

            case 'Employees':
                viewEmployee();
                break;
            
            case 'All data':
                viewAll();
                break;
        };
    });
};



function viewDept() {
    console.log('\n Displaying all departments: \n');

    connection.query('SELECT * FROM department', function (err, data) {
        if (err) throw err;
        console.table(data);

        mainMenu();
    });
};


function viewRole() {
    console.log('\n Displaying all roles: \n');

    connection.query('SELECT * FROM role ORDER BY department_id', function (err, data) {
        if (err) throw err;
        console.table(data);

        mainMenu();
    });
};

function viewEmployee() {
    console.log('\n Displaying all employees: \n');

    connection.query('SELECT * FROM employee', function (err, data) {
        if (err) throw err;
        console.table(data);

        mainMenu();
    })
}

function viewAll() {
    console.log('\n Displaying all data: \n');
    const idQ = "SELECT employee.id, first_name, last_name, role_id, title, salary, department_id, name FROM role INNER JOIN employee INNER JOIN department WHERE employee.role_id = role.id AND department.id = role.department_id ORDER BY department.id";

    connection.query(idQ, function (err, data) {
        if (err) throw err;
        console.table(data);

        mainMenu();
    });
};



// function to update employee roles _________________________________________________________________________________
function update() {
    const roleQ = "SELECT role.title AS name FROM role;";

    connection.query(roleQ, function (err, roles) {
        if (err) throw err;

    connection.query("SELECT CONCAT(employee.id, ' ', employee.first_name, ' ', employee.last_name) AS name FROM employee;",
        function (err, emps) {
            if (err) throw err;

            inquirer.prompt([
                {
                    name: 'update',
                    type: 'list',
                    message: 'Please select the employee you would like to update:',
                    choices: [...emps]
                },
                {
                    name: 'updateRole',
                    type: 'list',
                    message: "Please select this employee's new role:",
                    choices: [...roles]
                }
            ]).then((answers) => {
                const query = 'UPDATE employee INNER JOIN role ON ?= role.title SET employee.role_id = role.id WHERE ? = employee.id;';

                connection.query(query,
                    [
                        answers.updateRole,
                        answers.update.split(" ")[0]
                    ],
                    function (err) {
                        if (err) throw err;

                        console.log(answers.update + "'s role was successfully updated to " + answers.updateRole + '!')

                        mainMenu();
                    });
            });
        });
    });
};