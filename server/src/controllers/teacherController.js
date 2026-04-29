const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Get courses that belong to the logged-in teacher
// @route   GET /api/teacher/courses
// @access  Private/Teacher
exports.getCoursesByTeacher = async (req, res) => {
    try {
        const teacherID = req.user._id;

        // Find courses where the teacherID matches
        const courses = await Course.find({ teacherID })
            .populate('enrolledStudents', 'name email');

        // Create a structured response showing title, student count, and raw IDs
        const managedCourses = courses.map((course) => ({
            _id: course._id,
            title: course.title,
            studentCount: course.enrolledStudents ? course.enrolledStudents.length : 0,
            students: course.enrolledStudents || []
        }));

        res.status(200).json(managedCourses);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching teacher courses', error: error.message });
    }
};
