import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// Middleware to protect routes
export const isAuthenticated = async (req, res, next) => {
    try {
        let token;

        // 1️⃣ Try to get token from cookies
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
        // 2️⃣ Or from Authorization header (Bearer token)
        else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. Please log in.",
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Attach user to request
        req.user = user;

        next(); // proceed
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

// Middleware to check if user is admin
export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied: Admins only",
        });
    }
    next();
};
