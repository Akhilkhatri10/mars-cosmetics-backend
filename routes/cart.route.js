// routes/cartRoutes.js
import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../controllers/cart.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.get("/", isAuthenticated, getCart);
router.post("/add", isAuthenticated, addToCart);
router.put("/update", isAuthenticated, updateQuantity);
router.delete("/remove/:productId", isAuthenticated, removeFromCart);
router.delete("/clear", isAuthenticated, clearCart);

export default router;
