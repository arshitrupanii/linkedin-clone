import express from "express";
import { getSuggestedConnections, getPublicProfile, updateProfile } from "../controller/user.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
import upload from "../lib/multer.js";

const router = express.Router();

// all tested
router.get('/suggestions', protectedRoute, getSuggestedConnections)
router.get('/:username', protectedRoute, getPublicProfile)

router.put('/profile', protectedRoute, upload.single("image"), updateProfile)




export default router