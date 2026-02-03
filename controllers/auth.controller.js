import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 🔐 Helper: Generate JWT
const generateToken = (user) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET not defined");
    }

    return jwt.sign(
        {
            id: user._id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// 🍪 Cookie options
const cookieOptions = {
    httpOnly: true,
    // secure: true,      
    // sameSite: "none",
    secure: false,       // ✅ REQUIRED for http
    sameSite: "lax",     // ✅ REQUIRED for localhost
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// 🧾 REGISTER USER
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "user",
        });

        const token = generateToken(user);

        user.password = undefined;

        // ✅ Send cookie + response
        res
            .status(201)
            .cookie("token", token, cookieOptions)
            .json({
                success: true,
                message: "Account created successfully",
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                },
            });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// 🧠 LOGIN USER
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user);

        user.password = undefined;

        res
            .status(200)
            .cookie("token", token, cookieOptions)
            .json({
                success: true,
                message: `Welcome back, ${user.name}`,
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                },
            });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

// 👤 GET CURRENT USER
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password")
        // .populate("cart.productId")
        // .populate("wishlist");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("GetCurrentUser Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


// Logout user
export const logout = async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            secure: false,      // 🔥 MUST match login
            sameSite: "lax",    // 🔥 MUST match login
            path: "/",          // 🔥 MUST match login
            expires: new Date(0),
        })
            .status(200).json({
                success: true,
                message: "Logged out successfully"
            });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
