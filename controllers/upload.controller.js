import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// ---------------- Upload multiple files ----------------
// Expects req.files from multer middleware
export const uploadMultipleFiles = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        const uploadedFiles = [];

        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "ecommerce_app",
                resource_type: "image",
                quality: "auto",
            });

            uploadedFiles.push({
                public_id: result.public_id,
                url: result.secure_url,
            });

            fs.unlinkSync(file.path); // Remove local file
        }

        res.status(200).json({
            success: true,
            files: uploadedFiles,
        });
    } catch (error) {
        console.error("UploadMultipleFiles Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ---------------- Delete a file ----------------
export const deleteFile = async (req, res) => {
    try {
        const { public_id } = req.body;

        if (!public_id) {
            return res.status(400).json({ message: "public_id is required" });
        }

        await cloudinary.uploader.destroy(public_id);

        res.status(200).json({ success: true, message: "File deleted successfully" });
    } catch (error) {
        console.error("DeleteFile Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
