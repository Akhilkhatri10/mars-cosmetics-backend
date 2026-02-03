import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

// ---------------- User Profile ----------------

// @desc    Update logged-in user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // update text fields
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // if password is provided, hash it
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        // ✅ Handle avatar image upload (if new file provided)
        if (req.file) {

            // If user already has an old avatar on Cloudinary, delete it first
            if (user.avatarPublicId) {
                await cloudinary.uploader.destroy(user.avatarPublicId);
            }

            // Upload new image
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "ecommerce_app/avatars",
                resource_type: "image",
            });

            // Update user's avatar data
            user.avatar = result.secure_url;
            user.avatarPublicId = result.public_id; // save public_id for future deletion
        }

        const updatedUser = await user.save();
        updatedUser.password = undefined; // hide password

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("UpdateUserProfile Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// ---------------- Admin Routes ----------------

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Admin
export const getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("name email role createdAt avatar")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        console.error("GetUsers Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Admin
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("GetUserById Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Update user by admin
// @route   PUT /api/users/:id
// @access  Admin
export const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.role) user.role = req.body.role; // e.g., admin or user

        const updatedUser = await user.save();
        updatedUser.password = undefined;

        res.status(200).json({ success: true, message: "User updated", user: updatedUser });
    } catch (error) {
        console.error("UpdateUser Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await user.deleteOne();
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("DeleteUser Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
