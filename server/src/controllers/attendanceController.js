const Attendance = require('../models/Attendance');
const Course = require('../models/Course');
const mongoose = require('mongoose');

// @desc    Mark attendance for a specific course session (Student)
// @route   POST /api/attendance/mark
// @access  Private/Student
exports.markAttendance = async (req, res) => {
    try {
        const { courseID } = req.body;
        const studentID = req.user._id;

        // Check if attendance already marked for today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const existingAttendance = await Attendance.findOne({
            studentID,
            courseID,
            date: { $gte: startOfDay, $lte: endOfDay },
        });

        if (existingAttendance) {
            return res.status(400).json({ message: 'Attendance already marked for today.' });
        }

        const attendance = await Attendance.create({
            studentID,
            courseID,
            status: 'pending',
        });

        res.status(201).json({ message: 'Attendance marked successfully', attendance });
    } catch (error) {
        console.error("Error in markAttendance:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Approve or Reject attendance marked by students (Teacher)
// @route   PATCH /api/attendance/:id/approve
// @access  Private/Teacher
exports.approveAttendance = async (req, res) => {
    try {
        const { status } = req.body; // 'approved' or 'rejected'
        const teacherID = req.user._id;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const attendance = await Attendance.findById(req.params.id).populate('courseID');

        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }

        // Verify that the logged-in teacher handles this course
        if (attendance.courseID.teacherID.toString() !== teacherID.toString()) {
            return res.status(403).json({ message: 'Not authorized to approve attendance for this course' });
        }

        attendance.status = status;
        const updatedAttendance = await attendance.save();

        res.json({ message: `Attendance ${status}`, attendance: updatedAttendance });
    } catch (error) {
        console.error("Error in approveAttendance:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all pending attendance requests for logged-in teacher's courses
// @route   GET /api/attendance/pending
// @access  Private/Teacher
exports.getPendingAttendance = async (req, res) => {
    try {
        const teacherID = req.user._id;

        // Find all courses taught by this teacher
        const teacherCourses = await Course.find({ teacherID }).select('_id');
        const courseIds = teacherCourses.map(c => c._id);

        // Find pending attendance for these courses
        const pendingRequests = await Attendance.find({
            courseID: { $in: courseIds },
            status: 'pending'
        })
            .populate('studentID', 'name email')
            .populate('courseID', 'title')
            .sort('-date');

        res.json(pendingRequests);
    } catch (error) {
        console.error("Error in getPendingAttendance:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get weekly attendance summaries across the institute (Admin)
// @route   GET /api/attendance/reports/weekly
// @access  Private/Admin
exports.getWeeklyReport = async (req, res) => {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // MongoDB Aggregation Pipeline for weekly summary
        const report = await Attendance.aggregate([
            {
                $match: {
                    date: { $gte: oneWeekAgo },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$date" },
                    },
                    totalAttendance: { $sum: 1 },
                    approvedCount: {
                        $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
                    },
                    pendingCount: {
                        $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
                    },
                    rejectedCount: {
                        $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
                    },
                },
            },
            {
                $sort: { _id: 1 }, // Sort by date ascending
            },
            {
                $project: {
                    _id: 1,
                    totalAttendance: 1,
                    approvedCount: 1,
                    pendingCount: 1,
                    rejectedCount: 1,
                    attendancePercentage: {
                        $cond: [
                            { $eq: ["$totalAttendance", 0] },
                            0,
                            { $multiply: [{ $divide: ["$approvedCount", "$totalAttendance"] }, 100] }
                        ]
                    }
                }
            }
        ]);

        res.json({ report });
    } catch (error) {
        console.error("Error in getWeeklyReport:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
