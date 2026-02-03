import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logout,
} from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post("/register", registerUser);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", loginUser);

// @route   GET /api/auth/me
// @desc    Get logged-in user details
// @access  Private
router.get("/me", isAuthenticated, getCurrentUser);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post("/logout", isAuthenticated, logout);

export default router;
