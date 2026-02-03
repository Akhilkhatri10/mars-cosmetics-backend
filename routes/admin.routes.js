import express from "express";
import {
  getAdminOverview,
  getSalesAnalytics,
  getAdminOrders,
  getAdminProducts,
} from "../controllers/admin.controller.js";

import { isAuthenticated, isAdmin } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.get("/overview", isAuthenticated, isAdmin, getAdminOverview);
router.get("/sales", isAuthenticated, isAdmin, getSalesAnalytics);
router.get("/orders", isAuthenticated, isAdmin, getAdminOrders);
router.get("/products", isAuthenticated, isAdmin, getAdminProducts);

export default router;
