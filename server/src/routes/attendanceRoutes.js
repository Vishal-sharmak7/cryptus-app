const express = require('express');
const { markAttendance, approveAttendance, getPendingAttendance } = require('../controllers/attendanceController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

// Student can mark attendance
router.post('/mark', protect, authorizeRoles('Student'), markAttendance);

// Teacher can approve/reject attendance
router.patch('/:id/approve', protect, authorizeRoles('Teacher'), approveAttendance);

// Teacher can get pending requests
router.get('/pending', protect, authorizeRoles('Teacher'), getPendingAttendance);

module.exports = router;
