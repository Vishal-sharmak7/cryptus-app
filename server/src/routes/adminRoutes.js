const express = require('express');
const {
    getStats,
    getUsers,
    updateUser,
    deleteUser,
    getStudentTeacherMapping,
    assignTeacher,
    enrollStudent,
    unenrollStudent,
    getCourses,
    createUser,
    createCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/adminController');
const { getWeeklyReport } = require('../controllers/attendanceController');
const { protect, verifyAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(verifyAdmin);

// Stats and Reports
router.get('/stats', getStats);
router.get('/weekly-report', getWeeklyReport);

// User Management
router.route('/users')
    .get(getUsers)
    .post(createUser);

router.route('/users/:id')
    .put(updateUser)
    .patch(updateUser)
    .delete(deleteUser);

// Courses & Enrollment
router.route('/courses')
    .get(getCourses)
    .post(createCourse);

router.route('/courses/:id')
    .patch(updateCourse)
    .delete(deleteCourse);

router.patch('/assign-teacher', assignTeacher);
router.post('/enroll', enrollStudent);
router.post('/unenroll', unenrollStudent);

// Relationships
router.get('/student-teacher', getStudentTeacherMapping);

module.exports = router;
