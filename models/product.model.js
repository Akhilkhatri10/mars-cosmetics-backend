import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter the product name"],
            trim: true,
        },

        description: {
            type: String,
            required: [true, "Please add a product description"],
        },

        price: {
            type: Number,
            required: [true, "Please add a product price"],
            min: [0, "Price cannot be negative"],
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Please specify a category"],
        },

        brand: {
            type: String,
            default: "Mars Cosmetics", // Or dynamic later
        },

        stock: {
            type: Number,
            required: [true, "Please add stock count"],
            default: 0,
        },

        images: [
            {
                public_id: {
                    type: String
                }, // for Cloudinary integration

                url: {
                    type: String,
                    required: true
                },
            },
        ],

        discount: {
            type: Number,
            default: 0, // percentage (e.g. 10 means 10% off)
        },

        rating: {
            type: Number,
            default: 0,
        },

        numReviews: {
            type: Number,
            default: 0,
        },

        isFeatured: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
