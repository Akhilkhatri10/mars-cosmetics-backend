// controllers/cartController.js
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

// Get user cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Fetching cart failed", error });
  }
};

// Add to cart
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ SAFE: never causes duplicate key error
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (i) => i.product.toString() === product._id.toString()
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        product: product._id,
        title: product.name,
        price: product.price,
        image: product.images?.[0]?.url || "",
        quantity: 1,
      });
    }

    await cart.save(); // ✅ single atomic save
    res.status(200).json(cart);
  } catch (error) {
    console.error("❌ addToCart error:", error);
    res.status(500).json({
      message: "Adding to cart failed",
      error: error.message,
    });
  }
};



// Remove item
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(200).json({ items: [] });

    cart.items = cart.items.filter((item) => {
      // support legacy + new schema
      if (item.product) {
        return item.product.toString() !== productId;
      }
      return true;
    });

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("❌ removeFromCart:", error);
    res.status(500).json({ message: "Failed to remove item" });
  }
};


// Update quantity
export const updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (i) => i.product && i.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.quantity = quantity;
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error("❌ updateQuantity:", error);
    res.status(500).json({ message: "Failed to update quantity" });
  }
};


// Clear cart
export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.id });
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Clearing cart failed", error });
  }
};
