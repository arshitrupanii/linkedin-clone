import User from "../model/user.model.js";
// import cloudinary from "../lib/cloudinary.js";


export const getSuggestedConnections = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id).select("connections")
    
        const SuggestUser = await User.find({
            _id: {
                $ne: req.user._id, $nin: currentUser.connections
            }
        }).select("name username profilePicture headline").limit(3);

        return res.status(200).json(SuggestUser);

    } catch (error) {
        console.error("Error in Suggest connection : " + error.message);
        return res.status(500).json({ message: "Error in Suggest connection" });
    }

}

export const getPublicProfile = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select("-password -createdAt -updatedAt")

        if (!user) {
            return res.status(404).json({ message: "User not found!" })
        }

        return res.status(200).json(user);

    } catch (error) {
        console.error("Error in public profile : " + error.message);
        return res.status(500).json({ message: "Error in Get Profile" });
    }
}

export const updateProfile = async (req, res) => {

    try {
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

        console.log(req);

        if (req.body.profilePicture) {
            // const result = await cloudinary.uploader.upload(req.body.profilePicture)
            // updateData.profilePicture = result.secure_url
        }

        for (const field of allowedFields) {
            if (req.body[field]) {
                updateData[field] = req.body[field]
            }
        }

        const user = await User.findByIdAndUpdate(req.user._id, { $set: updateData }, { new: true }).select("-password -createdAt -updatedAt")

        return res.status(200).json(user);

    } catch (error) {
        console.error("Error in Update profile : " + error.message);
        return res.status(500).json({ message: "Error in Update profile" });
    }
}
