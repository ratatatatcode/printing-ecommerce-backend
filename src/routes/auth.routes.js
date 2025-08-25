import express from "express";
import { register, login, activateAccount } from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/activate/:token", activateAccount);

export default router;