
import attendanceModel from "../models/attendance.model.js";

const normalizeDate = (d) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
};


export const markAttendance = async (req, res) => {
  try {
    const { courseId, date } = req.body;
    const userId = req.user._id;

    const attendanceDate = normalizeDate(date || new Date());

    const exists = await attendanceModel.findOne({
      user: userId,
      Course: courseId,
      date: attendanceDate,
    });

    if (exists) {
      return res.status(409).json({
        message: "Attendance already marked and waiting for approval",
      });
    }

    const attendance = await attendanceModel.create({
      user: userId,
      Course: courseId,
      date: attendanceDate,
      status: "present",
      approvalStatus: "pending",
    });

    res.status(201).json({
      message: "Attendance marked. Waiting for teacher approval",
      attendance,
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Attendance already marked",
      });
    }
    res.status(500).json({ message: error.message });
  }
};


export const approveAttendance = async (req, res) => {
  try {
    const { attendanceId, approvalStatus } = req.body;
    const teacherId = req.user._id;

    if (!["approved", "rejected"].includes(approvalStatus)) {
      return res.status(400).json({ message: "Invalid approval status" });
    }

    const attendance = await attendanceModel.findById(attendanceId);

    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    attendance.approvalStatus = approvalStatus;
    attendance.approvedBy = teacherId;
    attendance.approvedAt = new Date();

    await attendance.save();

    res.json({
      message: `Attendance ${approvalStatus}`,
      attendance,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const pendingAttendanceByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const attendance = await attendanceModel.find({
      Course: courseId,
      approvalStatus: "pending",
    })
      .populate("user", "name email")
      .sort({ date: -1 });

    res.json({
      total: attendance.length,
      attendance,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





export const myAttendance = async (req, res) => {
  try {
    const userId = req.user._id;

    const attendance = await attendanceModel.find({ user: userId })
      .populate("Course", "title courseId duration")
      .sort({ date: -1 });

    res.json({
      total: attendance.length,
      attendance,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
