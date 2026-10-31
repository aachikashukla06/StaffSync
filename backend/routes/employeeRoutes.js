const express = require('express');
const {
  createEmployeeProfile,
  getAllEmployees,
  getEmployeeById,
  getMyEmployeeProfile,
  updateEmployee,
} = require('../controllers/employeeController');
const protect = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/me', protect, verifyRole(['employee']), getMyEmployeeProfile);
router.get('/', protect, verifyRole(['admin', 'hr']), getAllEmployees);
router.post('/create', protect, verifyRole(['hr', 'admin']), createEmployeeProfile);
router.put('/user/:id', protect, verifyRole(['admin', 'hr']), updateEmployee);
router.get('/:id', protect, verifyRole(['employee', 'hr', 'admin']), getEmployeeById);

module.exports = router;
