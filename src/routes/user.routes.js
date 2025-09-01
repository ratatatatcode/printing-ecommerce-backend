import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { getCurrentUser } from "../controllers/user.controllers.js";

const router = express.Router();

router.get("/current", isAuthenticated, getCurrentUser);

export default router;