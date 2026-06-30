// ✅ Load environment variables FIRST (before anything else)
import "dotenv/config";

import cors from "cors";
import express from "express";
import { connectDB } from "./config/db";
import authRouter from "./routes/auth.routes";
import adminRouter from "./routes/admin.routes";

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// ✅ Middleware
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());

// ✅ Health check route
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Edumate API is running",
  });
});

// ✅ Auth routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);

// ✅ Start server
const startServer = async (): Promise<void> => {
  try {
    // ✅ optional debug (remove later)
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    await connectDB();

    app.listen(PORT, () => {
      console.log(`✅ Edumate backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
