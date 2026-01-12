import mongoose from "mongoose";
import EnrollModel from "../models/enroll.model.js";

export const enrollCourse = async (req, res) => {
  try {
    const { user, course } = req.body;

    if (!user || !course) {
      return res.status(400).json({ message: "User and Course are required" });
    }

    // prevent duplicate enrollment
    const exists = await EnrollModel.findOne({ user, course });
    if (exists) {
      return res.status(409).json({ message: "Already enrolled or request exists" });
    }

    const enrollment = await EnrollModel.create({ user, course });

    res.status(201).json({
      message: "Enrollment request sent",
      enrollment,
      timestamp: enrollment.createdAt
    });

  } catch (error) {
    console.error("Enrollment failed:", error);
    res.status(500).json({ message: "Enrollment failed" });
  }
};


export const updateEnrollmentStatus = async (req, res) => {
  try {
    const { enrollmentId, status } = req.body;

    if (!enrollmentId || !status) {
      return res.status(400).json({ message: "Enrollment ID and status required" });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const enrollment = await EnrollModel.findByIdAndUpdate(
      enrollmentId,
      { status },
      { new: true }
    );

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    res.json({
      message: `Enrollment ${status}`,
      enrollment,
      timestamp: enrollment.updatedAt
    });

  } catch (error) {
    console.error("Status update failed:", error);
    res.status(500).json({ message: "Status update failed" });
  }
};



export const myEnrolledCourses = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const data = await EnrollModel.aggregate([
      {
        $match: {
          user: userId,
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
      {
        $unwind: "$course",
      },
      {
        $project: {
          _id: 0,
          enrollmentId: "$_id",
          enrolledAt: 1,
          status: 1,

          courseMongoId: "$course._id",
          courseId: "$course.courseId",
          title: { $ifNull: ["$course.title", "$course.tittle"] },
          description: "$course.description",
          category: "$course.category",
          duration: "$course.duration",
          level: "$course.level",
          price: "$course.price",
          price: "$course.price",
          isActive: "$course.isActive",
        },
      },
    ]);

    res.json({
      total: data.length,
      courses: data,
    });

  } catch (error) {
    console.error("myEnrolledCourses error:", error);
    res.status(500).json({ message: error.message });
  }
};

