import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { getCurrentUser, addReview } from "../controllers/user.controllers.js";

const router = express.Router();

router.get("/current", isAuthenticated, getCurrentUser);
router.post("/add-review", isAuthenticated, addReview);

export default router;