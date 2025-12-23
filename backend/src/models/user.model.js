import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["student", "teacher"],
      required: true
    },

    studentId: {
      type: String,
      unique: true,
      sparse: true
    },

    course: String,
    batch: String,

    employeeId: {
      type: String,
      unique: true,
      sparse: true
    },

    department: String,

    isActive: {
      type: Boolean,
      default: true
    },

    lastLogin: Date
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
