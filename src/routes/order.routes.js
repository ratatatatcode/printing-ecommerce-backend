import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { getCurrentUserOrders, makeOrder } from "../controllers/order.controllers.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.get("/current", isAuthenticated, getCurrentUserOrders);
router.post("/make", isAuthenticated, upload.single("design"), makeOrder);

export default router;