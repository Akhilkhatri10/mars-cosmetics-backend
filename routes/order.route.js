import express from "express";
import {
  addOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  cancelOrder,
  bulkDeliverOrders,
  cancelOrderByAdmin,
  updateOrderToShipped
} from "../controllers/order.controller.js";

import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { isAdmin } from "../middleware/isAuthenticated.js";

const router = express.Router();

// ---------------- PRIVATE ROUTES ----------------

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post("/", isAuthenticated, addOrder);

// @route   GET /api/orders/myorders
// @desc    Get logged-in user's orders
// @access  Private
router.get("/myorders", isAuthenticated, getMyOrders);

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get("/:id", isAuthenticated, getOrderById);

// @route   PUT /api/orders/:id/pay
// @desc    Update order to paid
// @access  Private
router.put("/:id/pay", isAuthenticated, updateOrderToPaid);


// @route   DELETE /api/orders/:orderId/cancel
// @desc    Cancel an order
// @access  Private
router.delete("/:orderId/cancel", isAuthenticated, cancelOrder);


// ---------------- ADMIN ROUTES ----------------

// @route   GET /api/orders
// @desc    Get all orders (admin only)
// @access  Admin
router.get("/", isAuthenticated, isAdmin, getAllOrders);

// @route   PUT /api/orders/bulk-deliver
// @desc    Bulk update orders to delivered
// @access  Admin
router.put("/bulk-deliver", isAuthenticated, isAdmin, bulkDeliverOrders);

// @route   PUT /api/orders/:id/deliver
// @desc    Update order to delivered
// @access  Admin
router.put("/:id/deliver", isAuthenticated, isAdmin, updateOrderToDelivered);

// @route   PUT /api/orders/:id/ship
// @desc    Update order to shipped
// @access  Admin
router.put("/:id/ship", isAuthenticated, isAdmin, updateOrderToShipped);

// @route   DELETE /api/orders/:id/admin-cancel
// @desc    Cancel an order by admin
// @access  Admin
router.delete("/:id/admin-cancel", isAuthenticated, isAdmin, cancelOrderByAdmin);


export default router;
