import express from "express";
import { signup, login, logout, getCurrentUser } from "../controller/auth.controller.js";
import { loginValidation, signupValidation } from "../validation/auth.validation.js"
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();


router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.post('/logout', logout);

router.get('/me', protectedRoute, getCurrentUser);

export default router;