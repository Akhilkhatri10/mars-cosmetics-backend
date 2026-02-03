import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import { Order } from "../models/order.model.js";

// STEP 1: Create Razorpay order
export const createRazorpayOrder = async (req, res) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(order.totalPrice * 100), // ₹ → paise
        currency: "INR",
        receipt: `order_${order.orderNumber}`,
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.json(razorpayOrder);
};

// STEP 2: Verify payment
export const verifyRazorpayPayment = async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderId,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(sign)
        .digest("hex");

    if (expectedSign !== razorpay_signature) {
        return res.status(400).json({ message: "Payment verification failed" });
    }

    const order = await Order.findById(orderId);

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
        id: razorpay_payment_id,
        status: "SUCCESS",
    };

    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;

    await order.save();

    res.json({ message: "Payment verified successfully" });
};
