import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        orderItems: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },

                name: String,
                quantity: Number,
                price: Number,
                image: String,
            },
        ],

        shippingAddress: {
            address: {
                type: String,
                required: true
            },

            city: {
                type: String,
                required: true
            },

            state: {
                type: String
            },

            postalCode: {
                type: String,
                required: true
            },

            country: {
                type: String,
                required: true
            },
        },

        paymentMethod: {
            type: String,
            required: true,
            enum: ["COD", "Credit Card", "UPI", "PayPal", "Razorpay"],
        },

        paymentResult: {
            id: String,       // transaction ID from gateway
            status: String,   // success/failed
            update_time: String,
            email_address: String,
        },

        razorpayOrderId: String,
        razorpayPaymentId: String,
        razorpaySignature: String,

        itemsPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },

        taxPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },

        shippingPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },

        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },

        isPaid: {
            type: Boolean,
            default: false,
        },

        paidAt: {
            type: Date,
        },

        isDelivered: {
            type: Boolean,
            default: false,
        },

        deliveredAt: {
            type: Date,
        },

        orderStatus: {
            type: String,
            enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
            default: "Processing",
        },

        orderNumber: {
            type: Number,
            required: true,
            unique: true,
        }

    },
    { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
