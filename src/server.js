import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user/", userRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Listening to ${PORT}...`);
});