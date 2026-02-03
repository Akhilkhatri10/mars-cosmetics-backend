import express from "express";
import { subscribeUser } from "../controllers/subscriber.controller.js";

const router = express.Router();

// POST /api/subscribe
router.post("/", subscribeUser);

export default router;
