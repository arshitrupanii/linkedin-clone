import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { deleteNotification, getUserNotification, Notificationasread } from "../controller/notification.controller.js";

const router = express.Router();

router.get('/', protectedRoute, getUserNotification)
router.put('/:id/read', protectedRoute, Notificationasread)
router.delete('/:id', protectedRoute, deleteNotification)


export default router