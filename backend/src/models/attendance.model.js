import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    Course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["present", "absent"],
      default: "present",
    },

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // teacher
    },

    approvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// prevent duplicate attendance per day
attendanceSchema.index(
  { user: 1, Course: 1, date: 1 },
  { unique: true }
);

export default mongoose.model("Attendance", attendanceSchema);
