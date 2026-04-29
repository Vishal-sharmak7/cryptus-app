const Course = require('../models/Course');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

// @desc    Get courses the logged in student is enrolled in
// @route   GET /api/student/courses
// @access  Private/Student
exports.getMyCourses = async (req, res) => {
    try {
        const studentID = req.user._id;

        // Populate enrolledCourses directly on the user and return those courses
        const user = await User.findById(studentID).populate({
            path: 'enrolledCourses',
            populate: {
                path: 'teacherID',
                select: 'name'
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const courses = user.enrolledCourses || [];

        // Check today's attendance status for each course
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Map over courses to append attendance status
        const coursesWithStatus = await Promise.all(courses.map(async (course) => {
            const tempCourse = {
                _id: course._id,
                title: course.title,
                teacher: course.teacherID?.name || 'Unknown',
            };

            const attendance = await Attendance.findOne({
                studentID,
                courseID: course._id,
                date: { $gte: startOfDay, $lte: endOfDay },
            });

            tempCourse.attendanceStatus = attendance ? attendance.status : 'none';
            return tempCourse;
        }));

        res.json(coursesWithStatus);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching courses', error: error.message });
    }
};
