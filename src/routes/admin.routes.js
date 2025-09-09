import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { getAllUsers, getSales, getAllOrders, getReviews, updatePrice, deleteUser } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/get-users", isAuthenticated, getAllUsers);
router.get("/get-sales", isAuthenticated, getSales);
router.get("/get-orders", isAuthenticated, getAllOrders);
router.get("/get-reviews", isAuthenticated, getReviews);
router.put("/update-price", isAuthenticated, updatePrice);
router.delete("/delete-user", isAuthenticated, deleteUser);

export default router;