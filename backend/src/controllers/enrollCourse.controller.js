import mongoose from "mongoose";
import EnrollModel from "../models/enroll.model.js";
import Course from "../models/course.model.js"; 


export const enrollCourse = async (req, res) => {
  try {
    const student = req.user._id; 
    const { course } = req.body;

    if (!course) {
      return res.status(400).json({ message: "Course is required" });
    }

    const exists = await EnrollModel.findOne({ student, course });
    if (exists) {
      return res.status(409).json({ message: "Enrollment already exists" });
    }

    const enrollment = await EnrollModel.create({
      student,
      course,
    });

    res.status(201).json({
      message: "Enrollment request sent",
      enrollment,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




 export const updateEnrollmentStatus = async (req, res) => {
  try {
    const { enrollmentId, status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const enrollment = await EnrollModel.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    enrollment.status = status;
    await enrollment.save();

    // ✅ add student to course ONLY if approved
    if (status === "approved") {
      await Course.findByIdAndUpdate(enrollment.course, {
        $addToSet: { students: enrollment.student },
      });
    }

    res.json({
      message: `Enrollment ${status}`,
      enrollment,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const myEnrolledCourses = async (req, res) => {
  try {
    const studentId = new mongoose.Types.ObjectId(req.user._id);

    const data = await EnrollModel.aggregate([
      {
        $match: {
          student: studentId,
          status: "approved",
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
      {
        $project: {
          enrollmentId: "$_id",
          status: 1,
          enrolledAt: "$createdAt",

          courseId: "$course.courseId",
          title: "$course.title",
          duration: "$course.duration",
          isActive: "$course.isActive",
        },
      },
    ]);

    res.json({
      total: data.length,
      courses: data,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
