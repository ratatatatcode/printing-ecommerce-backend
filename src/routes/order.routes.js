import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { getCurrentUserOrders, getOrderById, makeOrder, cancelOrder, payOrder } from "../controllers/order.controllers.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.get("/current", isAuthenticated, getCurrentUserOrders);
router.get("/single/:orderId", isAuthenticated, getOrderById);
router.post("/make", isAuthenticated, upload.single("design"), makeOrder);
router.put("/cancel-order", isAuthenticated, cancelOrder);
router.post("/pay-order", isAuthenticated, upload.single("paymentUrl"), payOrder);

export default router;