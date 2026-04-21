import Notification from "../model/notification.model.js"
import asyncHandler from "../lib/asyncHandler.js"

export const getUserNotification = asyncHandler(async (req, res) => {
    const notifications = await Notification.find(
        { recipient: req.user._id })
        .sort({ createdAt: -1 })
        .populate("relatedUser", "name username profilePicture")
        .populate("relatedPost", "content image")

    res.status(200).json({ success: true, notifications });
})

export const Notificationasread = asyncHandler(async (req, res) => {
    const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, recipient: req.user._id },
        { read: true },
        { new: true }
    )

    res.status(200).json({ success: true, notification });
})

export const deleteNotification = asyncHandler(async (req, res) => {
    const deleted = await Notification.findOneAndDelete({
        _id: req.params.id,
        recipient: req.user._id
    })

    if (!deleted) {
        const err = new Error("Notification not found");
        err.statusCode = 404;
        throw err;
    }

    res.status(200).json({ success: true, message: "Notification is deleted successfully." })
}
)