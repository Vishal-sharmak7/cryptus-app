import Course from "../models/course.model.js";

export const createCourse = async (req, res) => {
  try {
    const { courseId, title, duration, batch, department } = req.body;

    if (!courseId || !title || !duration) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ teacher comes from JWT
    const teacherId = req.user._id;

    const course = await Course.create({
      courseId,
      title,
      duration,
      batch,
      department,
      teacher: teacherId,
    });

    return res.status(201).json({
      success: true,
      data: course,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Course creation failed",
      error: error.message,
    });
  }
};


export const getCourse = async (req, res) => {
  try {
    const course = await Course.find({ isActive: "true" });
    res.json(course);
  } catch (error) {
    return res.status(500).json({
      message: "Course get failed",
      error: error.message,
    });
  }
};



export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Course id is required" });
    }

    const deleted = await Course.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      course: deleted,
    });
  } catch (error) {
    res.status(500).json({
      message: "Course deletion failed",
      error: error.message,
    });
  }
};
