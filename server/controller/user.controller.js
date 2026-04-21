import User from "../model/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import asyncHandler from "../lib/asyncHandler.js";


export const getSuggestedConnections = asyncHandler(async (req, res) => {

    const SuggestUser = await User.find({
        _id: {
            $ne: req.user._id, $nin: req.user.connections || []
        }
    }).select("name username profilePicture headline").limit(3);

    res.status(200).json({ success: true, SuggestUser });
})

export const getPublicProfile = asyncHandler(async (req, res) => {

    const user = await User.findOne({ username: req.params.username }).select("-password -createdAt -updatedAt")

    if (!user) {
        const err = new Error("User not found!");
        err.statusCode = 404;
        throw err;
    }

    res.status(200).json({ success: true, user });
})

export const updateProfile = asyncHandler(async (req, res) => {
    const allowedFields = [
        "name",
        "headline",
        "about",
        "location",
        "profilePicture",
        "bannerImg",
        "skills",
        "experience",
        "education"
    ]

    const updateData = {};

    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            updateData[field] = req.body[field]
        }
    }

    if (req.body.profilePicture) {
        const result = await cloudinary.uploader.upload(
            req.body.profilePicture,
            {
                folder: "linkedin-clone/profile",
                transformation: [
                    { width: 500, height: 500, crop: "fill" },
                    { quality: "auto" },
                ],
            }
        );

        updateData.profilePicture = result.secure_url;
    }

    if (req.body.bannerImg) {
        const result = await cloudinary.uploader.upload(
            req.body.bannerImg,
            {
                folder: "linkedin-clone/banner",
                transformation: [
                    { width: 1200, height: 300, crop: "fill" },
                    { quality: "auto" },
                ],
            }
        );

        updateData.bannerImg = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(req.user._id, { $set: updateData }, { new: true }).select("-password -createdAt -updatedAt");

    res.status(200).json({ success: true, user });
})