const e = require('express');
const fs = require('fs');

class OrganizationModel {
    static getEmployees() {
        return new Promise((resolve, reject) => {
            fs.readFile('./data/organization-tree.json', (err, data) => {
                (err) ? reject(err) : resolve(JSON.parse(data));
            });
        });
    }
    static getEmployeeById(id) {
        return new Promise((resolve, reject) => {
            fs.readFile('./data/organization-tree.json', (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    const employees = JSON.parse(data);
                    const employee = employees.find(employee => employee.employeeId == id);
                    resolve(employee);
                }
            });
        });        
    }
    static getEmployeeTree(id) {
        return new Promise((resolve, reject) => {
            fs.readFile('./data/organization-tree.json', 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    let resolvedData = {};
                    for(let i = 0; i < id.length; i++) {
                    const employees = JSON.parse(data);
                    const targetEmployee = employees.find(employee => employee.employeeId == id[i]);
                    if(targetEmployee){
                        const reportEmployee = employees.filter(employee => employee.managerId == targetEmployee.employeeId);
                        if(reportEmployee.length>0){
                            resolvedData.employee = targetEmployee;
                            resolvedData.employee.directReports = reportEmployee;
                        }
                        else if (id.length == 1) {
                            resolvedData.employee = targetEmployee;
                        }
                    }
                }
                resolve(resolvedData);
                }
            });
        })
    }
    static createEmployee(newEmployee) {
        return new Promise((resolve, reject) => {
            fs.readFile('./data/organization-tree.json', (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    if(!newEmployee.employeeId || !newEmployee.name || !newEmployee.managerId) {
                        reject({ status:400, message: 'Input data not complete' }) 
                    }
                    else {
                        const employees = JSON.parse(data);
                        const targetEmployee = employees.find(employee => employee.employeeId == newEmployee.employeeId);
                        if(targetEmployee) {
                            reject({ status : 409, message: 'Employee already exist' });
                        }
                        else {
                            employees.push(newEmployee);
                            fs.writeFile('./data/organization-tree.json', JSON.stringify(employees), (err) => {
                                (err) ? reject(err) : resolve(newEmployee);
                            });
                        }   
                    }
                }
            });
        });
    }
    static updateEmployee(id, employee) {
        return new Promise((resolve, reject) => {
            fs.readFile('./data/organization-tree.json', (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    const employees = JSON.parse(data);
                    const targetEmployee = employees.find(employee => employee.employeeId == id);
                    if(!targetEmployee) {
                        reject({ status : 404, message: 'Employee not found' });
                    }
                    else {
                        (!employee.name || !employee.managerId) ? reject({ status:400, message: 'Input data not complete' }) : 
                        targetEmployee.name = employee.name;
                        targetEmployee.managerId = employee.managerId;
                        fs.writeFile('./data/organization-tree.json', JSON.stringify(employees), (err) => {
                            (err) ? reject(err) : resolve(targetEmployee);
                        });
                    }
                }
            });
        });
    }
    static deleteEmployee(id) {
        return new Promise((resolve, reject) => {
            fs.readFile('./data/organization-tree.json', (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    const employees = JSON.parse(data);
                    const targetEmployee = employees.find(employee => employee.employeeId == id);
                    if(!targetEmployee) {
                        reject({ status : 404, message: 'Employee not found' });
                    }
                    else {
                        employees.splice(employees.indexOf(targetEmployee), 1);
                        fs.writeFile('./data/organization-tree.json', JSON.stringify(employees), (err) => {
                            (err) ? reject(err) : resolve(targetEmployee);
                        });
                    }
                }
            });
        });
    }
}

module.exports = OrganizationModel;