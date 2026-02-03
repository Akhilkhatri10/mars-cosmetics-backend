import Counter from "../models/Counter.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Cart } from "../models/cart.model.js";



// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
export const addOrder = async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod, taxPrice = 0, shippingPrice = 0 } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: "No order items" });
        }

        // 🔢 STEP 1 — Generate auto-increment orderNumber
        const counter = await Counter.findOneAndUpdate(
            { id: "orderNumber" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        const orderNumber = counter.seq; // ← This becomes #1, #2, #3...

        // STEP 2 — Build detailed items array
        const detailedOrderItems = [];
        let itemsPrice = 0;

        for (const item of orderItems) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }

            const qty = Number(item.quantity);
            if (!qty || qty <= 0) {
                return res.status(400).json({ message: `Invalid quantity for product ${product._id}` });
            }

            detailedOrderItems.push({
                product: product._id,
                name: product.name,
                quantity: qty,
                price: product.price,
                image: product.images[0]?.url || "",
            });

            itemsPrice += product.price * qty;
        }

        itemsPrice = Number(itemsPrice.toFixed(2));
        const totalPrice = Number((itemsPrice + Number(taxPrice) + Number(shippingPrice)).toFixed(2));

        // STEP 3 — Create order
        const order = new Order({
            user: req.user._id,
            orderItems: detailedOrderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            orderNumber, // ← NEW FIELD
        });

        const createdOrder = await order.save();

        // 🔥 STEP 4 — Clear user's cart after successful order
        await Cart.findOneAndDelete({ user: req.user._id });

        res.status(201).json({
            message: "Order created successfully",
            createdOrder,
        });

    } catch (error) {
        console.error("AddOrder Error:", error);
        res.status(400).json({ message: error.message });
    }
};


// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "name email")
            .populate("orderItems.product", "name price images");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Get orders for logged-in user
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Get all orders with pagination, filters & sorting (Admin)
// @route   GET /api/orders
// @access  Admin
export const getAllOrders = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const sortField = req.query.sort || "createdAt";
        const sortOrder = req.query.order === "asc" ? 1 : -1;

        const filter = {};
        if (req.query.status === "PAID") filter.isPaid = true;
        if (req.query.status === "UNPAID") filter.isPaid = false;
        if (req.query.status === "DELIVERED") filter.isDelivered = true;

        const orders = await Order.find(filter)
            .populate("user", "id name email")
            .sort({ [sortField]: sortOrder })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Order.countDocuments(filter);

        res.json({
            orders,
            page,
            pages: Math.max(1, Math.ceil(total / limit)),
            total,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address
        };

        const updatedOrder = await order.save();
        res.json({
            message: "Order marked as paid",
            updatedOrder
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Admin
export const updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Check if order is paid
        if (!order.isPaid) {
            return res.status(400).json({
                message: "Cannot deliver an unpaid order"
            });
        }

        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.orderStatus = "Delivered";

        const updatedOrder = await order.save();
        res.json({
            message: "Order marked as delivered",
            updatedOrder
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order to shipped
// @route   PUT /api/orders/:id/ship
// @access  Admin
export const updateOrderToShipped = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (!order.isPaid) {
            return res.status(400).json({
                message: "Cannot ship an unpaid order",
            });
        }

        if (order.isDelivered) {
            return res.status(400).json({
                message: "Order already delivered",
            });
        }

        order.orderStatus = "Shipped";
        order.shippedAt = Date.now();

        const updatedOrder = await order.save();

        res.json({
            message: "Order marked as shipped",
            updatedOrder,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Bulk deliver orders
// @route   PUT /api/orders/bulk-deliver
// @access  Admin
export const bulkDeliverOrders = async (req, res) => {
    try {
        const { orderIds } = req.body;

        if (!Array.isArray(orderIds) || orderIds.length === 0) {
            return res.status(400).json({
                message: "No order IDs provided"
            });
        }

        const result = await Order.updateMany(
            {
                _id: { $in: orderIds },
                isPaid: true,
                isDelivered: { $ne: true }
            },
            {
                $set: {
                    isDelivered: true,
                    deliveredAt: Date.now(),
                    orderStatus: "Delivered"
                }
            }
        );

        res.json({
            message: "Orders delivered successfully",
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Cancel an order
// @route   DELETE /api/orders/:orderId/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    // 🔐 Ensure user owns the order
    if (order.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
    }

    // 🚫 Business rule
    if (["Shipped", "Delivered"].includes(order.orderStatus)) {
        return res
            .status(400)
            .json({ message: "Order cannot be cancelled at this stage" });
    }

    // hard delete(deletes the order from DB)
    // await order.deleteOne();    

    // soft delete(marking the order as cancelled)
    order.orderStatus = "Cancelled";
    order.isCancelled = true;
    order.cancelledAt = Date.now();

    await order.save();

    res.json({ message: "Order cancelled successfully" });
};


// @desc    Cancel order (Admin)
// @route   DELETE /api/orders/:id/admin-cancel
// @access  Admin
export const cancelOrderByAdmin = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.isDelivered) {
            return res.status(400).json({
                message: "Delivered orders cannot be cancelled",
            });
        }

        order.orderStatus = "Cancelled";
        order.isCancelled = true;
        order.cancelledAt = Date.now();

        const updatedOrder = await order.save();

        res.json({
            message: "Order cancelled by admin",
            updatedOrder,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc Undo cancel (Admin)
// @route PUT /api/orders/:id/undo-cancel
// @access Admin
export const undoCancelOrder = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    if (!order.isCancelled) {
        return res.status(400).json({ message: "Order is not cancelled" });
    }

    order.isCancelled = false;
    order.orderStatus = "Processing";
    order.cancelledAt = null;

    await order.save();

    res.json({ message: "Order restored", order });
};



