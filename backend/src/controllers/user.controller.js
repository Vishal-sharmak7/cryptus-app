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
    const { username, password } = req.body;

    // 1️⃣ Basic validation
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    // 2️⃣ Find user (ROLE COMES FROM DB)
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    // 3️⃣ Verify password (⚠️ use bcrypt in production)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 4️⃣ Update last login
    user.lastLogin = new Date();
    await user.save();

    // 5️⃣ Generate JWT (includes role)
    const token = generateToken(user);

    // 6️⃣ Send response
    res.status(200).json({
      success: true,
      token,
      message: "Login successful",
      user: formatUserResponse(user), // includes role
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getUser = async (req, res) => {
  try {
    const { id } = req.params; // get user id from URL

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

