import express from "express";
import { getUser, login } from "../controllers/user.controller.js";
import {createCourse, deleteCourse, getCourse} from "../controllers/course.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { enrollCourse, myEnrolledCourses, updateEnrollmentStatus } from "../controllers/enrollCourse.controller.js";
import { approveAttendance, markAttendance, myAttendance, pendingAttendanceByCourse } from "../controllers/markAttendance.controller.js";

const router = express.Router();

/* PUBLIC ROUTE */
router.post("/login", login);
router.get("/getcourse", getCourse);



/* PROTECTED ROUTES */

// Student profile
router.get("/student/profile/:id", protect, allowRoles("student"), getUser);
router.post("/student/enrollCourse", protect, allowRoles("student"), enrollCourse);
router.get("/student/my-courses", protect,allowRoles("student"), myEnrolledCourses);
router.post("/student/markAttendance", protect,allowRoles("student"), markAttendance);
router.get("/student/getAttendance", protect,allowRoles("student"), myAttendance);



// Teacher profile
router.get("/teacher/profile", protect, allowRoles("teacher"), login);
router.post("/teacher/coursecreate", protect, allowRoles("teacher"), createCourse);
router.delete("/teacher/deletecourse/:id", protect, allowRoles("teacher"), deleteCourse);
router.put("/teacher/enroll/status", protect, allowRoles("teacher"), updateEnrollmentStatus);
router.get("/teacher/attendance/pending/:courseId", protect, allowRoles("teacher"), pendingAttendanceByCourse)
router.put("/teacher/attendance/approve", protect, allowRoles("teacher"), approveAttendance)

export default router;
