import express from "express";
import { login } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

/* PUBLIC ROUTE */
router.post("/login", login);

/* PROTECTED ROUTES */

// Student profile
router.get("/student/profile", protect, allowRoles("student"),login);

// Teacher profile
router.get("/teacher/profile", protect, allowRoles("teacher"), login);

export default router;
