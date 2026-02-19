import Notification from "../model/notification.model.js"

export const getUserNotification = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort({ createdAt: -1 })
            .populate("relatedUser", "name username profilePicture")
            .populate("relatedPost", "content image")

        return res.status(200).json(notifications);

    } catch (error) {
        console.error("error in get user notifications : " , error)
        return res.status(500).json({ message : "Failed get user notifications"})
    }
}

export const Notificationasread = async (req, res) => {
    try {
        const notificationId = req.params.id;

        const notification = await Notification.findOneAndUpdate(
            {_id : notificationId, recipient : req.user._id},
            {read: true},
            {new : true}
        )
        
        return res.status(200).json(notification);

    } catch (error) {
        console.error("error in notifications as read : " , error)
        return res.status(500).json({ message : "Failed notifications as read"})
    }
}

export const deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;

        await Notification.findOneAndDelete({
            _id : notificationId,
            recipient : req.user._id
        })
        
        return res.status(200).json({message : "Notification is deleted successfully."})

    } catch (error) {
        console.error("error in delete notifications : " , error)
        return res.status(500).json({ message : "Failed delete notifications"})
    }
}
