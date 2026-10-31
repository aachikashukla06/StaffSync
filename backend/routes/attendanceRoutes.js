const express = require('express');
const protect = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');
const attendanceController = require('../controllers/attendanceController');

const router = express.Router();

router.get('/my', protect, verifyRole(['employee']), attendanceController.getMyAttendance);
router.get('/', protect, verifyRole(['admin', 'hr']), attendanceController.getAllAttendance);
router.post('/check-in', protect, verifyRole(['employee']), attendanceController.checkIn);
router.post('/check-out', protect, verifyRole(['employee']), attendanceController.checkOut);

module.exports = router;
