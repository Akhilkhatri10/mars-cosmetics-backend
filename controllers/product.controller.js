import { Product } from "../models/product.model.js";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";



// @desc    Create a new product
// @route   POST /api/products
// @access  Admin
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, brand, discount, images: imageUrls } = req.body;

    // if (!req.files || req.files.length === 0) {
    //   return res.status(400).json({ message: "Please upload at least one image" });
    // }

    // Upload images to Cloudinary
    const uploadedImages = [];

    // Option 1: Upload actual files if present
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "ecommerce_app/products",
          resource_type: "image",
          quality: "auto",
        });

        uploadedImages.push({
          public_id: result.public_id,
          url: result.secure_url,
        });

        fs.unlinkSync(file.path); // remove temp file
      }
    }

    // Option 2: Accept image URLs (for testing / seeding)
    else if (imageUrls && Array.isArray(imageUrls) && imageUrls.length > 0) {
      uploadedImages.push(...imageUrls.map(url => ({ public_id: null, url })));
    }

    // ❌ If neither images nor URLs provided
    if (uploadedImages.length === 0) {
      return res.status(400).json({
        message: "Please upload at least one image or provide image URLs"
      });
    }


    // If discount is empty or null, default to 0
    req.body.discount = Number(req.body.discount) || 0;

    /// Price must be a positive number
    if (req.body.price !== undefined && req.body.price <= 0) {
      return res.status(400).json({ message: "Price must be greater than zero" });
    }

    // Stock can’t be negative
    if (req.body.stock !== undefined && req.body.stock < 0) {
      return res.status(400).json({ message: "Stock cannot be negative" });
    }

    // Discount must be between 0 and 100
    req.body.discount = Number(req.body.discount) || 0;
    if (req.body.discount < 0 || req.body.discount > 100) {
      return res.status(400).json({ message: "Discount must be between 0 and 100" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      brand,
      stock,
      discount,
      images: uploadedImages,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });

  } catch (error) {
    console.error("CreateProduct Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Admin
// export const updateProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product)
//       return res.status(404).json({ message: "Product not found" });

//     let uploadedImages = [];

//     // ✅ Case 1: Images uploaded via form-data
//     if (req.files && req.files.length > 0) {
//       for (const img of product.images) {
//         if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
//       }

//       for (const file of req.files) {
//         const result = await cloudinary.uploader.upload(file.path, {
//           folder: "ecommerce_app/products",
//         });
//         uploadedImages.push({
//           public_id: result.public_id,
//           url: result.secure_url,
//         });
//         fs.unlinkSync(file.path);
//       }
//     }

//     // ✅ Case 2: Images provided as URLs in JSON
//     else if (req.body.images && Array.isArray(req.body.images)) {
//       uploadedImages = req.body.images.map((url) => ({
//         public_id: null,
//         url,
//       }));
//     }

//     // If discount is empty or null, default to 0
//     req.body.discount = Number(req.body.discount) || 0;

//     /// Price must be a positive number
//     if (req.body.price !== undefined && req.body.price <= 0) {
//       return res.status(400).json({ message: "Price must be greater than zero" });
//     }

//     // Stock can’t be negative
//     if (req.body.stock !== undefined && req.body.stock < 0) {
//       return res.status(400).json({ message: "Stock cannot be negative" });
//     }

//     // Discount must be between 0 and 100
//     req.body.discount = Number(req.body.discount) || 0;
//     if (req.body.discount < 0 || req.body.discount > 100) {
//       return res.status(400).json({ message: "Discount must be between 0 and 100" });
//     }


//     // ✅ Merge updated fields
//     Object.assign(product, req.body);

//     // ✅ Replace images only if provided
//     if (uploadedImages.length > 0) {
//       product.images = uploadedImages;
//     }

//     const updatedProduct = await product.save();

//     res.json({
//       success: true,
//       message: "Product updated successfully",
//       product: updatedProduct,
//     });
//   } catch (error) {
//     console.error("UpdateProduct Error:", error);
//     res.status(400).json({ message: error.message });
//   }
// };
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // 1️⃣ Parse existing images sent from frontend
    let keptImages = [];
    if (req.body.existingImages) {
      keptImages = JSON.parse(req.body.existingImages);
    }

    // 2️⃣ Delete images that were REMOVED on frontend
    for (const img of product.images) {
      const stillExists = keptImages.find(
        (i) => i.public_id === img.public_id
      );

      if (!stillExists && img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    // 3️⃣ Upload NEW images (if any)
    let newUploadedImages = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "ecommerce_app/products",
        });

        newUploadedImages.push({
          public_id: result.public_id,
          url: result.secure_url,
        });

        fs.unlinkSync(file.path);
      }
    }

    // 4️⃣ Merge images (kept + new)
    product.images = [...keptImages, ...newUploadedImages];

    // 5️⃣ Handle numeric fields safely
    product.discount = Number(req.body.discount) || 0;

    if (req.body.price !== undefined && req.body.price <= 0) {
      return res.status(400).json({ message: "Price must be greater than zero" });
    }

    if (req.body.stock !== undefined && req.body.stock < 0) {
      return res.status(400).json({ message: "Stock cannot be negative" });
    }

    if (product.discount < 0 || product.discount > 100) {
      return res
        .status(400)
        .json({ message: "Discount must be between 0 and 100" });
    }

    // 6️⃣ Update remaining fields
    Object.assign(product, req.body);

    const updatedProduct = await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("UpdateProduct Error:", error);
    res.status(400).json({ message: error.message });
  }
};



// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Optional: Delete product images from Cloudinary (if integrated)
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DeleteProduct Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// @desc    Get all products (with category + search filter)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

    const filter = {};

    // 🔍 Search by product name
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // Filter by category ObjectId
    if (category) {
      filter.category = category; // <-- THIS is the fix
    }

    const products = await Product.find(filter).populate("category");
    res.json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(10);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get recommended products based on category
// @route   GET /api/products/recommended/:productId
// @access  Public
export const getRecommendedProducts = async (req, res) => {
  const { productId } = req.params;

  const currentProduct = await Product.findById(productId);

  if (!currentProduct) {
    return res.status(404).json({ message: "Product not found" });
  }

  const recommendations = await Product.find({
    category: currentProduct.category,
    _id: { $ne: productId }, // exclude current product
  })
    .limit(8);

  res.json(recommendations);
};






