import mongoose from "mongoose";
import asyncHandler from "../lib/asyncHandler.js";
import ConnectionRequest from "../model/connectionsRequest.model.js";
import Notification from "../model/notification.model.js";
import User from "../model/user.model.js";

export const sendConnectionRequest = asyncHandler(async (req, res) => {
	const { userId } = req.params; //who get connection request
	const senderId = req.user._id; // who sent connection request

	// Check user id
	const userIdValid = mongoose.Types.ObjectId.isValid(userId);

	if (!userId || !userIdValid) {
		const err = new Error("User Id not Valid")
		err.statusCode = 404;
		throw err;
	}

	if (senderId.toString() === userId) {
		const err = new Error("You can't send a request to yourself")
		err.statusCode = 400;
		throw err;
	}

	if (req.user.connections.includes(userId)) {
		const err = new Error("You are already connected")
		err.statusCode = 400;
		throw err;
	}

	const existingRequest = await ConnectionRequest.findOne({
		sender: senderId,
		recipient: userId,
		status: "pending",
	});

	if (existingRequest) {
		const err = new Error("A connection request already exists")
		err.statusCode = 400;
		throw err;
	}

	const newRequest = new ConnectionRequest({
		sender: senderId,
		recipient: userId,
	});

	await newRequest.save();

	res.status(200).json({ success: true, message: "Connection request sent successfully" });
});

export const acceptConnectionRequest = asyncHandler(async (req, res) => {
	const { requestId } = req.params; // who send connection request
	const userId = req.user._id; // whom have request in inbox

	// Check request id
	const requestIdValid = mongoose.Types.ObjectId.isValid(requestId);

	if (!requestId || !requestIdValid) {
		const err = new Error("Request Id not Valid")
		err.statusCode = 404;
		throw err;
	}

	const request = await ConnectionRequest.findById(requestId)
		.populate("sender", "name email username")
		.populate("recipient", "name username");

	if (!request) {
		const err = new Error("Connection request not found")
		err.statusCode = 404;
		throw err;
	}

	// check if the req is for the current user

	if (request.recipient._id.toString() !== userId.toString()) {
		const err = new Error("Not authorized to accept this request")
		err.statusCode = 403;
		throw err;
	}

	if (request.status !== "pending") {
		const err = new Error("This request has already been processed")
		err.statusCode = 400;
		throw err;
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

	res.status(200).json({ success: true, message: "Connection accepted successfully" });
});

export const rejectConnectionRequest = asyncHandler(async (req, res) => {
	const { requestId } = req.params;
	const userId = req.user._id;

	// Check request id
	const requestIdValid = mongoose.Types.ObjectId.isValid(requestId);

	if (!requestId || !requestIdValid) {
		const err = new Error("Request Id not Valid")
		err.statusCode = 404;
		throw err;
	}

	const request = await ConnectionRequest.findById(requestId);

	if (!request) {
		const err = new Error("Connection request not found")
		err.statusCode = 404;
		throw err;
	}

	if (request.recipient.toString() !== userId.toString()) {
		const err = new Error("Not authorized to reject this request")
		err.statusCode = 403;
		throw err;
	}

	if (request.status !== "pending") {
		const err = new Error("This request has already been processed")
		err.statusCode = 400;
		throw err;
	}

	request.status = "rejected";
	await request.save();

	res.status(200).json({ success: false, message: "Connection request rejected" });
});

export const getConnectionRequests = asyncHandler(async (req, res) => {
	const userId = req.user._id;

	const requests = await ConnectionRequest.find({ recipient: userId, status: "pending" }).populate(
		"sender",
		"name username profilePicture headline connections"
	);

	res.status(200).json({ success: true, requests });
});

export const getUserConnections = asyncHandler(async (req, res) => {
	const userId = req.user._id;

	const user = await User.findById(userId).populate(
		"connections",
		"name username profilePicture headline connections"
	);

	res.status(200).json({ success: true, connections: user.connections });
});

export const removeConnection = asyncHandler(async (req, res) => {
	const myId = req.user._id;
	const { userId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(userId)) {
		const err = new Error("Invalid user ID");
		err.statusCode = 400;
		throw err;
	}

	if (myId.toString() === userId) {
		const err = new Error("You cannot remove yourself");
		err.statusCode = 400;
		throw err;
	}

	const [currentUser, targetUser] = await Promise.all([
		User.findById(myId),
		User.findById(userId),
	]);

	if (!currentUser || !targetUser) {
		const err = new Error("User not found");
		err.statusCode = 404;
		throw err;
	}

	if (!currentUser.connections.includes(userId)) {
		const err = new Error("Connection does not exist");
		err.statusCode = 400;
		throw err;
	}

	await Promise.all([
		User.findByIdAndUpdate(myId, {
			$pull: { connections: userId },
		}),
		User.findByIdAndUpdate(userId, {
			$pull: { connections: myId },
		}),
	]);

	res.status(200).json({
		success: true,
		message: "Connection removed successfully",
	});
});

export const getConnectionStatus = asyncHandler(async (req, res) => {
	const targetUserId = req.params.userId;
	const currentUserId = req.user._id;

	// Check user id
	const targetUserIdValid = mongoose.Types.ObjectId.isValid(targetUserId);

	if (!targetUserId || !targetUserIdValid) {
		const err = new Error("User Id not Valid")
		err.statusCode = 404;
		throw err;
	}

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
	res.status(200).json({ status: "not_connected" });
});