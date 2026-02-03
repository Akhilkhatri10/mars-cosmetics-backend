import express from "express";
import { createCategory, getAllCategories } from "../controllers/category.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { isAdmin } from "../middleware/isAuthenticated.js";

const router = express.Router();


// @desc    Create new category
// @route   POST /api/categories
// @access  Admin
router.post("/", isAuthenticated, isAdmin, createCategory);


// @desc    Get all active categories
// @route   GET /api/categories
// @access  Public (for now)
router.get("/", getAllCategories);


export default router;

