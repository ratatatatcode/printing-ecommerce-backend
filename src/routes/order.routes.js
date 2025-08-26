import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { getCurrentUserOrders, makeOrder } from "../controllers/order.controllers.js";

const router = express.Router();

router.get("/current", isAuthenticated, getCurrentUserOrders);
router.post("/make", isAuthenticated, makeOrder);

export default router;