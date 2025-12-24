import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

const formatUserResponse = (user) => {
  const base = {
    id: user._id,
    name: user.name,
    username: user.username,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt
  };

  if (user.role === "student") {
    return {
      ...base,
      studentId: user.studentId,
      course: user.course,
      batch: user.batch
    };
  }

  if (user.role === "teacher") {
    return {
      ...base,
      employeeId: user.employeeId,
      department: user.department
    };
  }

  return base;
};

export const login = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!["student", "teacher"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findOne({ username, role });

    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Optional but recommended
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);


    res.status(200).json({
      success: true,
      token,
      message: "Login successful",
      user: formatUserResponse(user)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
