import Notification from "../model/notification.model.js"
import asyncHandler from "../lib/asyncHandler.js"
import mongoose from "mongoose";

export const getUserNotification = asyncHandler(async (req, res) => {
    const notifications = await Notification.find(
        { recipient: req.user._id })
        .sort({ createdAt: -1 })
        .populate("relatedUser", "name username profilePicture")
        .populate("relatedPost", "content image")

    res.status(200).json({ success: true, notifications });
})

export const Notificationasread = asyncHandler(async (req, res) => {
    const { id: NotificationId } = req.params;

    // Check request id
    const NotificationIdValid = mongoose.Types.ObjectId.isValid(NotificationId);

    if (!NotificationId || !NotificationIdValid) {
        const err = new Error("Notification Id not Valid")
        err.statusCode = 404;
        throw err;
    }

    const notification = await Notification.findOneAndUpdate(
        { _id: NotificationId, recipient: req.user._id },
        { read: true },
        { new: true }
    )

    res.status(200).json({ success: true, notification });
})

export const deleteNotification = asyncHandler(async (req, res) => {
    const { id: NotificationId } = req.params;

    // Check request id
    const NotificationIdValid = mongoose.Types.ObjectId.isValid(NotificationId);

    if (!NotificationId || !NotificationIdValid) {
        const err = new Error("Notification Id not Valid")
        err.statusCode = 404;
        throw err;
    }

    const deleted = await Notification.findOneAndDelete({
        _id: NotificationId,
        recipient: req.user._id
    })

    if (!deleted) {
        const err = new Error("Notification not found");
        err.statusCode = 404;
        throw err;
    }

    res.status(200).json({ success: true, message: "Notification is deleted successfully." })
})