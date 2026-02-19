import express from "express";
import { signup, login, logout, getCurrentuser } from "../controller/auth.controller.js";
import { loginValidation, signupValidation } from "../validation/auth.validation.js"
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// all tested
router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.post('/logout', logout);

router.get('/me', protectedRoute, getCurrentuser);

export default router;