import express from "express";
import { getAllBlogs, getBlogById } from "../controllers/blog.controller.js";

const router = express.Router();

router.get("/", getAllBlogs);
router.get("/:id", getBlogById);

export default router;
