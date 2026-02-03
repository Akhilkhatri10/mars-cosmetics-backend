
import express from 'express';
import connectDB from './config/db.js';
import cors from "cors";
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import productRoutes from './routes/product.route.js';
import orderRoutes from './routes/order.route.js';
import categoryRoutes from "./routes/category.route.js";
import cartRoutes from "./routes/cart.route.js";
import adminRoutes from "./routes/admin.routes.js";
import subscribeRoutes from "./routes/subscriber.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import paymentRoutes from "./routes/payment.routes.js";


const app = express();

// -------------------- CORS MUST COME FIRST --------------------
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://mars-cosmetics-frontend.vercel.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Handle preflight requests
// app.options("*", cors(corsOptions));
// --------------------------------------------------------------


// ------------------------ MIDDLEWARE -------------------------
app.use(express.json());
app.use(cookieParser());

// Optional logging
// app.use((req, res, next) => {
//   console.log("CORS Check:", req.method, req.headers.origin);
//   next();
// });
// --------------------------------------------------------------


// -------------------------- ROUTES ----------------------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/subscribe", subscribeRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/payment", paymentRoutes);


app.get('/', (req, res) => {
  res.send('Hello World!');
});
// --------------------------------------------------------------


// --------------------- START SERVER ---------------------------
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
};

startServer();
