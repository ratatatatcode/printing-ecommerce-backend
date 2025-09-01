import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { getSales, updatePrice, deleteUser } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/get-sales", isAuthenticated, getSales);
router.put("/update-price", isAuthenticated, updatePrice);
router.delete("/delete-user", isAuthenticated, deleteUser);

export default router;