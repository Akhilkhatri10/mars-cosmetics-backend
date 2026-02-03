import express from "express";
import {
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { isAdmin } from "../middleware/isAuthenticated.js";

const router = express.Router();

// @route   PUT /api/users/profile
// @desc    Update logged-in user's profile
// @access  Private
router.put("/profile", isAuthenticated, updateUserProfile);

// ------------------- ADMIN ROUTES -------------------

// @route   GET /api/users
// @desc    Get all users
// @access  Admin
router.get("/", isAuthenticated, isAdmin, getUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Admin
router.get("/:id", isAuthenticated, isAdmin, getUserById);

// @route   PUT /api/users/:id
// @desc    Update a user (by admin)
// @access  Admin
router.put("/:id", isAuthenticated, isAdmin, updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete a user (by admin)
// @access  Admin
router.delete("/:id", isAuthenticated, isAdmin, deleteUser);

export default router;
