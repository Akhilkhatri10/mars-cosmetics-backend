import { Category } from "../models/category.model.js";

// @desc    Create new category
// @route   POST /api/categories
// @access  Admin
export const createCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;

        if (!name) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Category name is required"
                }
            );
        }

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(409).json(
                {
                    success: false,
                    message: "Category already exists"
                }
            );
        }

        const category = await Category.create({
            name,
            description,
            image,
        });

        res.status(201).json(
            {
                success: true,
                message: "Category created",
                category
            }
        );
    } catch (error) {
        console.error("CreateCategory Error: ", error);
        res.status(500).json(
            {
                success: false,
                message: "Server error"
            }
        );
    }
};


// @desc    Get all active categories
// @route   GET /api/categories
// @access  Public (for now)
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
