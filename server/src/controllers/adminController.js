const User = require('../models/User');
const Course = require('../models/Course');
const Attendance = require('../models/Attendance');
const bcrypt = require('bcryptjs');

// @desc    Get counts for users and courses
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
    try {
        const [studentCount, teacherCount, courseCount] = await Promise.all([
            User.countDocuments({ role: 'Student' }),
            User.countDocuments({ role: 'Teacher' }),
            Course.countDocuments()
        ]);

        res.status(200).json({
            students: studentCount,
            teachers: teacherCount,
            courses: courseCount,
        });
    } catch (error) {
        console.error("Error in getStats:", error);
        res.status(500).json({ message: 'Server error fetching stats', error: error.message });
    }
};

// @desc    Create a new user (Student/Teacher)
// @route   POST /api/admin/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Use a default password if not provided
        const userPassword = password || 'password123';

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userPassword, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'Student'
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error("Error in createUser:", error);
        res.status(500).json({ message: 'Server error creating user', error: error.message });
    }
};

// @desc    Get all users based on optional role query
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
    try {
        const { role } = req.query;
        let query = { role: role || { $in: ["Student", "Teacher"] } };
        const users = await User.find(query).select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getUsers:", error);
        res.status(500).json({ message: 'Server error fetching users', error: error.message });
    }
};

// @desc    Update a user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, role },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error in updateUser:", error);
        res.status(500).json({ message: 'Server error updating user', error: error.message });
    }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Cleanup references in courses - explicit removal from student enrolled arrays
        if (user.role === 'Student') {
            await Course.updateMany(
                { enrolledStudents: user._id },
                { $pull: { enrolledStudents: user._id } }
            );
            // Optionally, if the user requested removing from 'enrolledStudents' literal name
            // but the models define it as studentIds, this covers it.
            await Attendance.deleteMany({ studentID: user._id });
        } else if (user.role === 'Teacher') {
            await Course.updateMany(
                { teacherID: user._id },
                { $unset: { teacherID: "" } } // or set to null
            );
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error("Error in deleteUser:", error);
        res.status(500).json({ message: 'Server error deleting user', error: error.message });
    }
};

// @desc    Get student-teacher relationship mapping
// @route   GET /api/admin/student-teacher
// @access  Private/Admin
exports.getStudentTeacherMapping = async (req, res) => {
    try {
        const students = await User.find({ role: 'Student' })
            .select('name email enrolledCourses')
            .populate({
                path: 'enrolledCourses',
                select: 'title teacherID',
                populate: {
                    path: 'teacherID',
                    select: 'name email'
                }
            });

        res.status(200).json(students);
    } catch (error) {
        console.error("Error in getStudentTeacherMapping:", error);
        res.status(500).json({ message: 'Server error fetching mapping', error: error.message });
    }
};

// @desc    Assign a teacher to a course
// @route   POST /api/admin/assign-teacher
// @access  Private/Admin
exports.assignTeacher = async (req, res) => {
    try {
        const { teacherId, courseId } = req.body;

        const teacher = await User.findOne({ _id: teacherId, role: 'Teacher' });
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        const course = await Course.findByIdAndUpdate(
            courseId,
            { teacherID: teacherId },
            { new: true }
        );

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json({ message: 'Teacher assigned successfully', course });
    } catch (error) {
        console.error("Error in assignTeacher:", error);
        res.status(500).json({ message: 'Server error assigning teacher', error: error.message });
    }
};

// @desc    Enroll a student in a course
// @route   POST /api/admin/enroll
// @access  Private/Admin
exports.enrollStudent = async (req, res) => {
    try {
        const { studentId, courseId } = req.body;

        const student = await User.findOne({ _id: studentId, role: 'Student' });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Add using $addToSet to avoid duplicates cleanly
        await Course.findByIdAndUpdate(courseId, {
            $addToSet: { enrolledStudents: studentId }
        });

        await User.findByIdAndUpdate(studentId, {
            $addToSet: { enrolledCourses: courseId }
        });

        res.status(200).json({ message: 'Student enrolled successfully' });
    } catch (error) {
        console.error("Error in enrollStudent:", error);
        res.status(500).json({ message: 'Server error enrolling student', error: error.message });
    }
};

// @desc    Unenroll a student from a course
// @route   POST /api/admin/unenroll
// @access  Private/Admin
exports.unenrollStudent = async (req, res) => {
    try {
        const { studentId, courseId } = req.body;

        const student = await User.findOne({ _id: studentId, role: 'Student' });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Remove from course
        course.enrolledStudents = course.enrolledStudents.filter(id => id.toString() !== studentId);
        await course.save();

        // Remove from user
        student.enrolledCourses = student.enrolledCourses.filter(id => id.toString() !== courseId);
        await student.save();

        res.status(200).json({ message: 'Student unenrolled successfully' });
    } catch (error) {
        console.error("Error in unenrollStudent:", error);
        res.status(500).json({ message: 'Server error unenrolling student', error: error.message });
    }
};

// @desc    Create a new course
// @route   POST /api/admin/courses
// @access  Private/Admin
exports.createCourse = async (req, res) => {
    try {
        const { title, description, teacherID } = req.body;

        if (teacherID) {
            const teacher = await User.findOne({ _id: teacherID, role: 'Teacher' });
            if (!teacher) {
                return res.status(404).json({ message: 'Teacher not found' });
            }
        } else {
            return res.status(400).json({ message: 'Teacher ID is required to create a course' });
        }

        const course = await Course.create({
            title,
            description,
            teacherID
        });

        // Populate teacher for response
        const populatedCourse = await Course.findById(course._id).populate('teacherID', 'name email');

        res.status(201).json(populatedCourse);
    } catch (error) {
        console.error("Error in createCourse:", error);
        res.status(500).json({ message: 'Server error creating course', error: error.message });
    }
};

// @desc    Update a course
// @route   PATCH /api/admin/courses/:id
// @access  Private/Admin
exports.updateCourse = async (req, res) => {
    try {
        const { title, description, teacherID } = req.body;

        if (teacherID) {
            const teacher = await User.findOne({ _id: teacherID, role: 'Teacher' });
            if (!teacher) {
                return res.status(404).json({ message: 'Teacher not found' });
            }
        }

        const course = await Course.findByIdAndUpdate(
            req.params.id,
            { title, description, teacherID },
            { new: true, runValidators: true }
        ).populate('teacherID', 'name email');

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        console.error("Error in updateCourse:", error);
        res.status(500).json({ message: 'Server error updating course', error: error.message });
    }
};

// @desc    Delete a course
// @route   DELETE /api/admin/courses/:id
// @access  Private/Admin
exports.deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Remove course references from students' enrolledCourses
        await User.updateMany(
            { enrolledCourses: courseId },
            { $pull: { enrolledCourses: courseId } }
        );

        // Remove associated attendance records
        await Attendance.deleteMany({ courseID: courseId });

        await Course.findByIdAndDelete(courseId);
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error("Error in deleteCourse:", error);
        res.status(500).json({ message: 'Server error deleting course', error: error.message });
    }
};

// @desc    Get all courses with teacher and student count
// @route   GET /api/admin/courses
// @access  Private/Admin
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('teacherID', 'name email')
            .populate('enrolledStudents', 'name'); // Or just return length if payload is too big

        const mappedCourses = courses.map(course => ({
            _id: course._id,
            title: course.title,
            description: course.description,
            teacher: course.teacherID,
            studentCount: course.enrolledStudents ? course.enrolledStudents.length : 0
        }));

        res.status(200).json(mappedCourses);
    } catch (error) {
        console.error("Error in getCourses:", error);
        res.status(500).json({ message: 'Server error fetching courses', error: error.message });
    }
};
