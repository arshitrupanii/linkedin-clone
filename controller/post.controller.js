import cloudinary from '../lib/cloudinary.js'
import Post from '../model/post.model.js'
import Notifications from '../model/notification.model.js'
import mongoose from 'mongoose'
import asyncHandler from '../lib/asyncHandler.js'


export const getFeedpost = asyncHandler(async (req, res) => {
    const posts = await Post.find({ author: { $in: [...req.user.connections, req.user._id] } })
        .populate("author", "name username profilePicture headline")
        .populate("comments.user", "name profilePicture")
        .sort({ createdAt: -1 })

    res.status(200).json({ success: true, posts });
})

export const createPost = asyncHandler(async (req, res) => {
    const { content, image } = req.body;

    if (!content && !image) {
        const err = new Error("Post must have content or image");
        err.statusCode = 400;
        throw err;
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

    res.status(201).json({ success: true, newPost })
})

export const deletePost = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const userId = req.user._id;

    // Check valid params or not
    const postValid = mongoose.Types.ObjectId.isValid(postId);

    if (!postId || !postValid) {
        const err = new Error("Post Id not Valid")
        err.statusCode = 404;
        throw err;
    }

    const post = await Post.findById(postId);

    if (!post) {
        const err = new Error("Post not found!");
        err.statusCode = 404;
        throw err;
    }

    // check if the post has author
    if (post.author.toString() !== userId.toString()) {
        const err = new Error("You are not author of this post.");
        err.statusCode = 401;
        throw err;
    }

    // to do delete image
    // if (post.image) {
    //     await cloudinary.uploader.destroy(post.image.split("/").pop().split(".")[0]);
    // }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ success: true, message: "Post deleted successfully" });
})

export const getPost = asyncHandler(async (req, res) => {
    const postId = req.params.id;

    // Check valid params or not
    const postValid = mongoose.Types.ObjectId.isValid(postId);

    if (!postId || !postValid) {
        const err = new Error("Post Id not Valid")
        err.statusCode = 404;
        throw err;
    }

    const post = await Post.findById(postId)
        .populate("author", "name username profilePicture headline")
        .populate("comments.user", "name profilePicture username headline")
        .select("-createdAt -updatedAt")

    if (!post) {
        const err = new Error("Post not found")
        err.statusCode = 404;
        throw err;
    }

    res.status(200).json({ success: true, post })
})

export const createComment = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const { content } = req.body;

    // Check valid params or not
    const postValid = mongoose.Types.ObjectId.isValid(postId);

    if (!postId || !postValid) {
        const err = new Error("Post Id not Valid")
        err.statusCode = 404;
        throw err;
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

    res.status(200).json({ success: true, post })
})

export const likepost = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const userId = req.user._id;

    // Check valid params or not
    const postValid = mongoose.Types.ObjectId.isValid(postId);

    if (!postId || !postValid) {
        const err = new Error("Post Id not Valid")
        err.statusCode = 404;
        throw err;
    }

    const post = await Post.findById(postId);

    if (!post) {
        const err = new Error("Post not found")
        err.statusCode = 404;
        throw err;
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
    res.status(200).json({ success: true, post });
})