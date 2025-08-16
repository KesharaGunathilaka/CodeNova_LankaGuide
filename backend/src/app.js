import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";
import officerAuthRoutes from "./routes/officerAuth.routes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Security & common middleware
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// CORS (adjust as needed)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173"],
    credentials: true,
  })
);

// Basic rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});
app.use("/api/", apiLimiter);

// User Routes
app.use("/api/auth", authRoutes);
// Officer auth routes
app.use("/api/auth/officer", officerAuthRoutes);

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

// 404 & Error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
