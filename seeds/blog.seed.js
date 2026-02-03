import mongoose from "mongoose";
import Blog from "../models/blog.model.js";
import dotenv from "dotenv";

dotenv.config();

const blogs = [
  {
    title: "Beat the Heat: Your Guide to Long-Lasting, Sweat-Proof Summer Makeup",
    coverImage:
      "https://marscosmetics.in/cdn/shop/articles/blog_cover_beat_the_heat.jpg?v=1747117069&width=1500",
    content: `
      <p>Summer in India? We know the drill: scorching heat, humidity, and the constant battle
      against melting makeup. But fear not, beauty warriors!</p>

      <h2>Tips for a Long-Lasting Makeup Look in Summer</h2>

      <h3>1. Skincare is Your First Line of Defence</h3>
      <p>A good skincare routine prepares your skin for makeup and helps it last longer.</p>

      <h3>2. Priming for Perfection</h3>
      <p>Primer minimizes pores and controls oil, keeping makeup intact.</p>

      <ul>
        <li>Use a mattifying primer</li>
        <li>Don’t forget eye primer</li>
      </ul>
    `,
  },
  {
    title: "Your Makeup's Happy Place: How to Properly Store Your Cosmetics",
    coverImage:
      "https://marscosmetics.in/cdn/shop/articles/your_makeup_happy_place.jpg?v=1743228044&width=1380",
    content: `
      <p>Proper storage is key to maintaining makeup hygiene and longevity.</p>

      <h2>Makeup Storage Tips</h2>
      <ul>
        <li>Keep products away from heat and sunlight</li>
        <li>Clean brushes regularly</li>
        <li>Declutter expired products</li>
      </ul>
    `,
  },
  {
    title: "The Correct Order to Apply Makeup: Your Step-by-Step Makeup Routine",
    coverImage:
      "https://marscosmetics.in/cdn/shop/articles/the_correct_order_d74b43ad-a7e0-47b9-9e2f-10045cc3c996.jpg?v=1743061252&width=1380",
    content: `
      <p>Proper storage is key to maintaining makeup hygiene and longevity.</p>

      <h2>Makeup Storage Tips</h2>
      <ul>
        <li>Keep products away from heat and sunlight</li>
        <li>Clean brushes regularly</li>
        <li>Declutter expired products</li>
      </ul>
    `,
  },
  {
    title: "Makeup Trends to Watch in Summer 2025",
    coverImage:
      "https://marscosmetics.in/cdn/shop/articles/SUMMER_ef093e8a-b1d4-4fd1-a663-3451a4d5d775.jpg?v=1742970117&width=1380",
    content: `
      <p>Summer 2025 is all about effortless glow and playful colors.</p>

      <h2>Top Trends</h2>
      <ul>
        <li>Glass skin finish</li>
        <li>Bold blush</li>
        <li>Soft glossy lips</li>
      </ul>
    `,
  },
  {
    title: "Beginner's Guide to Eyeliner: From Classic Lines to Winged Perfection",
    coverImage:
      "https://marscosmetics.in/cdn/shop/articles/beginers_guide_to_eyeliner.jpg?v=1742538368&width=1500",
    content: `
      <p>Summer 2025 is all about effortless glow and playful colors.</p>

      <h2>Top Trends</h2>
      <ul>
        <li>Glass skin finish</li>
        <li>Bold blush</li>
        <li>Soft glossy lips</li>
      </ul>
    `,
  },
];

const seedBlogs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Optional: clear existing blogs
    await Blog.deleteMany();
    console.log("Existing blogs removed");

    await Blog.insertMany(blogs);
    console.log("Blogs seeded successfully");

    process.exit();
  } catch (error) {
    console.error("Error seeding blogs:", error);
    process.exit(1);
  }
};

seedBlogs();
