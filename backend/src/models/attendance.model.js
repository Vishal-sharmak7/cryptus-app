import mongoose from "mongoose";

const attendanceSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    Course: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: "Attendance date cannot be in the future",
      },
    },

    status: {
      type: String,
      enum: ["present", "absent"], 
      default: "absent",
    },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.model("Attendance", attendanceSchema);
