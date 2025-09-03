import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { getSales, getPendingItem, updatePrice, deleteUser } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/get-sales", isAuthenticated, getSales);
router.get("/get-undelivered-items", isAuthenticated, getPendingItem);
router.put("/update-price", isAuthenticated, updatePrice);
router.delete("/delete-user", isAuthenticated, deleteUser);

export default router;