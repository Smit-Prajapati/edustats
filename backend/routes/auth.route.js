import express from 'express';

import {
    checkAuth,
    forgotPassword,
    loginSchool,
    loginStudent,
    loginTeacher,
    logout,
    registerSchool,
    registerStudent,
    registerTeacher,
    resetPassword,
    verifyEmail
} from '../controllers/auth.controller.js';
import { protectedRoute } from '../middleware/protectedRoute.js';
import { authorizeRoles } from '../middleware/authorizeRole.js';

const router = express.Router();

router.get("/check-auth", protectedRoute, checkAuth);

//school routes
router.post("/school/register", registerSchool);
router.post("/school/login", loginSchool);
router.post("/school/verify-email", verifyEmail);
router.post("/school/forgot-password", forgotPassword);
router.post("/school/reset-password/:token", resetPassword);

//teacher and student routes
router.post("/teacher/register",protectedRoute, authorizeRoles("principal"), registerTeacher);
router.post("/teacher/login", loginTeacher);
router.post("/student/register", registerStudent);
router.post("/student/login", loginStudent);

router.post("/logout", logout);

export default router;