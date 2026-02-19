
import ConnectionRequest from "../model/connectionsRequest.model.js";
import Notification from "../model/notification.model.js";
import User from "../model/user.model.js";

export const sendConnectionRequest = async (req, res) => {
	try {
		const { userId } = req.params; //who get connection request
		const senderId = req.user._id; // who sent connection request

		if (senderId.toString() === userId) {
			return res.status(400).json({ message: "You can't send a request to yourself" });
		}

		if (req.user.connections.includes(userId)) {
			return res.status(400).json({ message: "You are already connected" });
		}

		const existingRequest = await ConnectionRequest.findOne({
			sender: senderId,
			recipient: userId,
			status: "pending",
		});

		if (existingRequest) {
			return res.status(400).json({ message: "A connection request already exists" });
		}

		const newRequest = new ConnectionRequest({
			sender: senderId,
			recipient: userId,
		});

		await newRequest.save();

		return res.status(200).json({ message: "Connection request sent successfully" });

	} catch (error) {
		console.error("Error in send connection : ", error);
		return res.status(500).json({ message: "Failed to send connection request" });
	}
};

export const acceptConnectionRequest = async (req, res) => {
	try {
		const { requestId } = req.params; // who send connection request
		const userId = req.user._id; // whom have request in inbox

		const request = await ConnectionRequest.findById(requestId)
			.populate("sender", "name email username")
			.populate("recipient", "name username");

		if (!request) {
			return res.status(404).json({ message: "Connection request not found" });
		}

		// check if the req is for the current user
		if (request.recipient._id.toString() !== userId.toString()) {
			return res.status(403).json({ message: "Not authorized to accept this request" });
		}

		if (request.status !== "pending") {
			return res.status(400).json({ message: "This request has already been processed" });
		}

		request.status = "accepted";
		await request.save();

		// if im your friend then ur also my friend ;)
		await User.findByIdAndUpdate(request.sender._id, { $addToSet: { connections: userId } });
		await User.findByIdAndUpdate(userId, { $addToSet: { connections: request.sender._id } });

		const notification = new Notification({
			recipient: request.sender._id,
			type: "connectionAccepted",
			relatedUser: userId,
		});

		await notification.save();

		return res.status(200).json({ message: "Connection accepted successfully" });

	} catch (error) {
		console.error("Error in accept request : ", error);
		return res.status(500).json({ message: "Failed accept request" });
	}
};

export const rejectConnectionRequest = async (req, res) => {
	try {
		const { requestId } = req.params;
		const userId = req.user._id;

		const request = await ConnectionRequest.findById(requestId);

		if (request.recipient.toString() !== userId.toString()) {
			return res.status(403).json({ message: "Not authorized to reject this request" });
		}

		if (request.status !== "pending") {
			return res.status(400).json({ message: "This request has already been processed" });
		}

		request.status = "rejected";
		await request.save();

		return res.status(200).json({ message: "Connection request rejected" });

	} catch (error) {
		console.error("Error in reject connection request: ", error);
		return res.status(500).json({ message: "Failed to reject request" });
	}
};

export const getConnectionRequests = async (req, res) => {
	try {
		const userId = req.user._id;

		const requests = await ConnectionRequest.find({ recipient: userId, status: "pending" }).populate(
			"sender",
			"name username profilePicture headline connections"
		);

		return res.status(200).json(requests);

	} catch (error) {
		console.error("Error in get connection request: ", error);
		return res.status(500).json({ message: "Failed get connection request" });
	}
};

export const getUserConnections = async (req, res) => {
	try {
		const userId = req.user._id;

		const user = await User.findById(userId).populate(
			"connections",
			"name username profilePicture headline connections"
		);

		return res.status(200).json(user.connections);

	} catch (error) {
		console.error("Error in get user connection: ", error);
		return res.status(500).json({ message: "Failed get user connection" });
	}
};

export const removeConnection = async (req, res) => {
	try {
		const myId = req.user._id;
		const { userId } = req.params;

		await User.findByIdAndUpdate(myId, { $pull: { connections: userId } });
		await User.findByIdAndUpdate(userId, { $pull: { connections: myId } });

		return res.status(200).json({ message: "Connection removed successfully" });

	} catch (error) {
		console.error("Error in remove connection: ", error);
		return res.status(500).json({ message: "Failed remove connection" });
	}
};

export const getConnectionStatus = async (req, res) => {
	try {
		const targetUserId = req.params.userId;
		const currentUserId = req.user._id;

		const currentUser = req.user;
		if (currentUser.connections.includes(targetUserId)) {
			return res.status(200).json({ status: "connected" });
		}

		const pendingRequest = await ConnectionRequest.findOne({
			$or: [
				{ sender: currentUserId, recipient: targetUserId },
				{ sender: targetUserId, recipient: currentUserId },
			],
			status: "pending",
		});

		if (pendingRequest) {
			if (pendingRequest.sender.toString() === currentUserId.toString()) {
				return res.status(200).json({ status: "pending" });
			} else {
				return res.status(200).json({ status: "received", requestId: pendingRequest._id });
			}
		}

		// if no connection or pending req found
		return res.status(200).json({ status: "not_connected" });

	} catch (error) {
		console.error("Error in get connection status: ", error);
		return res.status(500).json({ message: "Failed get connection status" });
	}
};