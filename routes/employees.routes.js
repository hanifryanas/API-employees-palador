const router = require('express').Router();
const OrganizationController = require('../controller/organization.controller');

router.get('/', OrganizationController.getEmployees);
router.get('/:id', OrganizationController.getEmployeeById);
router.post('/', OrganizationController.createEmployee);
router.put('/:id', OrganizationController.updateEmployee);
router.delete('/:id', OrganizationController.deleteEmployee);

module.exports = router;