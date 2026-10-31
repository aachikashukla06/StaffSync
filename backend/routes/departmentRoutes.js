const express = require('express');
const departmentController = require('../controllers/departmentController');
const protect = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/create', protect, verifyRole(['admin']), departmentController.createDepartment);
router.get('/', protect, verifyRole(['admin', 'hr']), departmentController.getAllDepartments);
router.get('/:id', protect, verifyRole(['admin', 'hr']), departmentController.getDepartmentById);

module.exports = router;
