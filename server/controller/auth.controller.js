import asyncHandler from '../lib/asyncHandler.js';
import { generateToken } from '../lib/jwt.js';
import User from '../model/user.model.js'
import bcrypt from 'bcryptjs';

export const signup = asyncHandler(async (req, res) => {
    const { name, username, email, password } = req.body;

    const existingusername = await User.exists({ username });

    if (existingUsername) {
        const err = new Error("Username already exists");
        err.statusCode = 409;
        throw err;
    }

    const existingEmail = await User.exists({ email })

    if (existingEmail) {
        const err = new Error("Email already exists");
        err.statusCode = 409;
        throw err;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
        name,
        username,
        email,
        password: hashedPassword,
    })

    await user.save();

    generateToken(user._id, res);

    res.status(201).json({ success: true, message: 'Signup successfully' })
})

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        const err = new Error("Invalid credentials");
        err.statusCode = 400;
        throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        const err = new Error("Invalid credentials");
        err.statusCode = 400;
        throw err;
    }

    generateToken(user._id, res);

    res.status(200).json({ success: true, message: 'Login successfully..' })
})

export const logout = asyncHandler((req, res) => {
    res.clearCookie("LinkedinToken");
    return res.status(200).json({ success: true, message: 'Logout Success' });
})

export const getCurrentUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user,
    });
});