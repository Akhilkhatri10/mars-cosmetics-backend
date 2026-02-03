import express from "express";
import {
    createRazorpayOrder,
    verifyRazorpayPayment,
} from "../controllers/payment.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/razorpay/create", isAuthenticated, createRazorpayOrder);
router.post("/razorpay/verify", isAuthenticated, verifyRazorpayPayment);

export default router;
