import { generateToken } from '../lib/jwt.js';
import User from '../model/user.model.js'
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        const existingusername = await User.exists({ username });

        if (existingusername) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const existingEmail = await User.exists({ email })

        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            username,
            email,
            password: hashedPassword,
        })

        await user.save();

        generateToken(user._id, res);

        return res.status(201).json({ message: 'Signup successfully' })

    } catch (error) {
        console.error("Error in signup : " + error.message);
        return res.status(500).json({ message: "Error in Signup" });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingEmail = await User.findOne({ email }).select("email password")

        if (!existingEmail) {
            return res.status(400).json({ message: 'Email not found' });
        }

        const isMatch = await bcrypt.compare(password, existingEmail.password);

        if (!isMatch) {
            return res.status(404).json({ message: 'Password mismatch or incorrect.' })
        }

        generateToken(existingEmail._id, res);

        return res.status(200).json({ message: 'Login successfully..' })

    } catch (error) {
        console.error("Error in Login : " + error.message);
        return res.status(500).json({ message: "Error in Login" });
    }
}

export const logout = (req, res) => {
    try {
        res.clearCookie("LinkedinToken");
        return res.status(200).json({ message: 'Logout Success' });
        
    } catch (error) {
        console.error("Error in Logout : " + error.message);
        return res.status(500).json({ message: "Error in Logout" });
    }
}

export const getCurrentuser = async (req, res) => {
    try {
        return res.status(200).json(req.user);

    } catch (error) {
        console.error("Error in getUser : " + error.message);
        return res.status(500).json({ message: "Error in getUser" });
    }
}