// import mongoose from "mongoose";

// const cartItemSchema = new mongoose.Schema({
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Product",
//     required: true,
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     default: 1,
//   },
// });

// const cartSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       unique: true, // One cart per user
//     },
//     items: [cartItemSchema],
//   },
//   { timestamps: true }
// );

// export const Cart = mongoose.model("Cart", cartSchema);

import mongoose from "mongoose";

// const cartItemSchema = new mongoose.Schema({
//   id: { type: String, required: true }, // Store product ID from frontend
//   title: { type: String, required: true },
//   price: { type: Number, required: true },
//   image: { type: String }, // Optional
//   quantity: { type: Number, default: 1 },
// });

// const cartSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//     unique: true,
//   },
//   items: [cartItemSchema],
// });

// export const Cart = mongoose.model("Cart", cartSchema);


const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  title: String,
  price: Number,
  image: String,
  quantity: { type: Number, default: 1 },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
});

export const Cart = mongoose.model("Cart", cartSchema);