import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getRecommendedProducts,
} from "../controllers/product.controller.js";

import { isAuthenticated, isAdmin } from "../middleware/isAuthenticated.js";
import { upload } from "../config/multer.js";

const router = express.Router();

// ---------------- PUBLIC ROUTES ----------------

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get("/", getProducts);


// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get("/featured", getFeaturedProducts);


// @route   GET /api/products/recommended/:productId
// @desc    Get recommended products based on category
// @access  Public
router.get("/recommended/:productId", getRecommendedProducts);


// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get("/:id", getProductById);



// ---------------- ADMIN ROUTES ----------------

// @route   POST /api/products
// @desc    Create new product
// @access  Admin
router.post("/", isAuthenticated, isAdmin, upload.array("images", 5), createProduct);

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Admin
router.put("/:id", isAuthenticated, isAdmin, upload.array("images", 5), updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Admin
router.delete("/:id", isAuthenticated, isAdmin, deleteProduct);

export default router;
