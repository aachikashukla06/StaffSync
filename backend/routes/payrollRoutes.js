const express = require('express');
const payrollController = require('../controllers/payrollController');
const protect = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/create', protect, verifyRole(['admin', 'hr']), payrollController.createPayroll);
router.get('/my', protect, verifyRole(['employee']), payrollController.getEmployeePayrollHistory);
router.get('/employee/:id', protect, verifyRole(['admin', 'hr']), payrollController.getEmployeePayrollHistory);
router.get('/', protect, verifyRole(['admin', 'hr']), payrollController.getAllPayroll);

module.exports = router;
