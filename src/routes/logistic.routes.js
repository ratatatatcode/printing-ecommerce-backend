import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { getUndeliveredItem, updateDeliveryStatus } from "../controllers/logistic.controller.js";

const router = express.Router();

router.get("/get-undelivered-items", isAuthenticated, getUndeliveredItem);
router.get("/update-status", isAuthenticated, updateDeliveryStatus);

export default router;