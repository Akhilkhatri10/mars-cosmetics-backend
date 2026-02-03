import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String, // Optional category thumbnail
      default: "https://via.placeholder.com/150",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);


export const Category = mongoose.model("Category", categorySchema);
