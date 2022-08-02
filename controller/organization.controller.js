const { json } = require('body-parser');
const e = require('express');
const { getEmployeeByIdWithTree } = require('../model/organization.model');
const OrganizationModel = require('../model/organization.model');

class OrganizationController {
    static getEmployees(req, res) {
        OrganizationModel.getEmployees()
        .then(employees => {
            (employees) ? res.status(200).json(employees) : res.status(404).json({ message: 'Employees not found' });
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        })
    }
    static getEmployeeById(req, res) {
        const reportingTree = req.query.includeReportingTree;
        const id = new Array(req.params.id);
        let result= {};
        if (reportingTree==='true') {
            OrganizationModel.getEmployeeTree(id)
            .then(employees => {
                if(employees.employee){
                    if(employees.employee.directReports){
                        let employeesId = [];
                        for(let i = 0; i < employees.employee.directReports.length; i++) {
                            employeesId.push(employees.employee.directReports[i].employeeId)
                        }
                        result = employees
                        return OrganizationModel.getEmployeeTree(employeesId);
                    }
                    else {
                        result = employees;
                    }
                }
                else {
                    result = 0;
                }
            })
            .then(employees => {
                if(employees){
                    if(employees.employee) {
                        for (let i = 0; i < result.employee.directReports.length; i++) {
                            if(result.employee.directReports[i].employeeId == employees.employee.employeeId) {
                                result.employee.directReports[i].directReports = employees.employee.directReports;
                            }
                        }
                    }
                    let employeesId = [];
                    for(let i = 0; i < result.employee.directReports.length; i++) {
                        employeesId.push(result.employee.directReports[i].employeeId)
                    }
                    return OrganizationModel.getEmployeeTree(employeesId);
                } 
            })
            .then(employees => {
                if(employees==undefined || !employees.length) {
                    if(result !== 0) {
                        res.status(200).json(result);
                    }
                    else {
                        res.status(404).json({ message: 'Employee not found' });
                    }
                }
            })
            .catch(err => {
                res.status(500).json({ message: err.message });
            })
        }
        else {
            OrganizationModel.getEmployeeById(id)
            .then(employee => 
                (employee) ? res.status(200).json(employee) : res.status(404).json({ message: 'Employee not found' })
            )
            .catch(err => {
                res.status(500).json({ message: err.message });
            })
        }
    }
    static createEmployee(req, res) {
        const { employeeId, name, managerId } = req.body;
        const newEmployee = {
            employeeId,
            name,
            managerId
        }
        OrganizationModel.createEmployee(newEmployee)
        .then(employee => {
        employee && res.status(201).json({
            message: 'Employee created successfully',
            employee
            });
        })
        .catch(err => {
            res.status(err.status || 500).json({ message: err.message });
        })
    }
    static updateEmployee(req, res) {
        const { name, managerId } = req.body;
        const paramsId = req.params.id;
        const updatedEmployee = {
            employeeId : paramsId,
            name,
            managerId
        }
        OrganizationModel.updateEmployee(paramsId, updatedEmployee)
        .then(employee => {
            employee && res.status(200).json({
                message: 'Employee updated successfully',
                employee
            });
        })
        .catch(err => {
            res.status(err.status || 500).json({ message: err.message });
        })
    }
    static deleteEmployee(req, res) {
        const paramsId = req.params.id;
        OrganizationModel.deleteEmployee(paramsId)
        .then(employee => {
            employee && res.status(200).json({
                message: 'Employee deleted successfully',
                employee
            });
        })
        .catch(err => {
            res.status(err.status || 500).json({ message: err.message });
        })
    }
}

module.exports = OrganizationController;