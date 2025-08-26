import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/order.routes.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

const app = express();
app.use(cors({
  origin: process.env.NEXT_PUBLIC_URL,
  credentials: true,
}));

app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/user/", userRoutes);
app.use("/api/order/", orderRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Listening to ${PORT}...`);
});