const express = require('express');
const { getCoursesByTeacher } = require('../controllers/teacherController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('Teacher'));

// Teacher can get courses they instruct
router.get('/my-courses', getCoursesByTeacher);

module.exports = router;
