import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { getCurrentUser, cancelOrder } from "../controllers/user.controllers.js";

const router = express.Router();

router.get("/current", isAuthenticated, getCurrentUser);
router.put("/cancel-order", isAuthenticated, cancelOrder);

export default router;