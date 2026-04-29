const express = require('express');
const { getMyCourses } = require('../controllers/studentController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('Student'));

// Student can get courses they are enrolled in
router.get('/courses', getMyCourses);

module.exports = router;
