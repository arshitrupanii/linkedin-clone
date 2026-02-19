import cloudinary from '../lib/cloudinary.js'
import Post from '../model/post.model.js'
import Notifications from '../model/notification.model.js'
import mongoose from 'mongoose'


export const getFeedpost = async (req, res) => {
    try {
        const posts = await Post.find({ author: { $in: [...req.user.connections, req.user._id] } })
            .populate("author", "name username profilePicture headline")
            .populate("comments.user", "name profilePicture")
            .sort({ createdAt: -1 })

        return res.status(200).json(posts);
    } catch (error) {
        console.error("Error in get Feed Posts : ", error);
        return res.status(500).json({ message: "Failed in Get Post" });
    }
}

export const createPost = async (req, res) => {
    try {
        const { content, image } = req.body;

        if (!content && !image) {
            return res.status(400).json({ message: "Post must have content or image" });
        }

        let imageUrl = "";

        if (image) {
            const result = await cloudinary.uploader.upload(image, {
                folder: "linkedin-clone/posts",
                transformation: [
                    { width: 1000, crop: "limit" },
                    { quality: "auto" },
                ],
            });

            imageUrl = result.secure_url;
        }

        const newPost = await Post.create({
            author: req.user._id,
            content,
            image: imageUrl,
        });

        await newPost.save();

        return res.status(201).json(newPost)

    } catch (error) {
        console.error("Error creating post : ", error)
        return res.status(500).json({ message: "Failed to create post" })
    }

}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const postValid = mongoose.Types.ObjectId.isValid(postId);

        if (!postValid) {
            return res.status(404).json({ message: "Post not found!" })
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found!" })
        }

        // check if the post has author
        if (post.author.toString() !== userId.toString()) {
            return res.status(401).json({ message: "You are not author of this post." })
        }

        // to do delete image
        // if (post.image) {
        //     await cloudinary.uploader.destroy(post.image.split("/").pop().split(".")[0]);
        // }

        await Post.findByIdAndDelete(postId)
        return res.status(200).json({ message: "Post deleted successfully" });

    } catch (error) {
        console.error("Error in delete post ", error)
        return res.status(500).json({ message: "Failed to delete post" });
    }
}

export const getPost = async (req, res) => {
    try {
        const postId = req.params.id;

        const postValid = mongoose.Types.ObjectId.isValid(postId);

        if (!postValid) {
            return res.status(404).json({ message: "Post not found!" })
        }

        const post = await Post.findById(postId)
            .populate("author", "name username profilePicture headline")
            .populate("comments.user", "name profilePicture username headline")
            .select("-createdAt -updatedAt")

        if (!post) {
            return res.status(404).json({ message: "Post not found!" })
        }

        return res.status(200).json(post)

    } catch (error) {
        console.error("Error in Get post : ", error)
        return res.status(500).json({ message: "Failed to Get post" });
    }
}

export const createComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const { content } = req.body;

        const postValid = mongoose.Types.ObjectId.isValid(postId);

        if (!postValid) {
            return res.status(404).json({ message: "Post not found!" })
        }

        const post = await Post.findByIdAndUpdate(postId, {
            $push: {
                comments: { user: req.user._id, content }
            }
        }, { new: true }).populate("author", "name email username headline profilePicture");

        if (post.author._id.toString() !== req.user._id.toString()) {
            const newNotifications = new Notifications({
                recipient: post.author,
                type: "comment",
                relatedUser: req.user._id,
                relatedPost: postId
            })
            await newNotifications.save()
        }

        return res.status(200).json(post)

    } catch (error) {
        console.error("error in create comment ", error)
        return res.status(500).json({ message: "Failed to create comment" })
    }
}

export const likepost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        const userId = req.user._id;
        const postValid = mongoose.Types.ObjectId.isValid(postId);

        if (!postValid) {
            return res.status(404).json({ message: "Post not found!" })
        }

        if (post.likes.includes(userId)) {
            // unlike the post
            post.likes = post.likes.filter(id => id.toString() !== userId.toString());
        }

        else {
            // like the post
            post.likes.push(userId);

            const newNotifications = new Notifications({
                recipient: post.author,
                type: "like",
                relatedUser: userId,
                relatedPost: postId
            })

            await newNotifications.save()
        }

        await post.save();
        return res.status(200).json(post);

    } catch (error) {
        console.error("Error in like post :", error)
        return res.status(500).json({ message: "Failed to like post" })
    }
}

