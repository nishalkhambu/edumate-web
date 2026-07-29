import "dotenv/config";

import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";
import authRouter from "./routes/auth.routes";
import adminRouter from "./routes/admin.routes";
import studyPlansRouter from "./routes/studyplans.routes";
import tasksRouter from "./routes/tasks.routes";
import subjectsRouter from "./routes/subjects.routes";
import goalsRouter from "./routes/goals.routes";
import studySessionsRouter from "./routes/studysessions.routes";
import pomodoroRouter from "./routes/pomodoro.routes";
import notificationsRouter from "./routes/notifications.routes";
import achievementsRouter from "./routes/achievements.routes";
import analyticsRouter from "./routes/analytics.routes";
import notesRouter from "./routes/notes.routes";
import timetableRouter from "./routes/timetable.routes";
import examsRouter from "./routes/exams.routes";

const sanitize = (obj: unknown): unknown => {
  if (Array.isArray(obj)) return obj.map(sanitize);
  if (obj && typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith("$") || key.includes(".")) continue;
      out[key] = sanitize(value);
    }
    return out;
  }
  return obj;
};

const sanitizeReq = (req: express.Request, _res: express.Response, next: express.NextFunction): void => {
  (req as any).body = sanitize((req).body);
  next();
};

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(sanitizeReq);

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: true, legacyHeaders: false });
if (process.env.NODE_ENV !== 'test') {
  app.use("/api/", limiter);
}

app.get("/api/health", (_req, res) => {
  res.status(200).json({ success: true, message: "Edumate API is running" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/study-plans", studyPlansRouter);
app.use("/api/v1/tasks", tasksRouter);
app.use("/api/v1/subjects", subjectsRouter);
app.use("/api/v1/goals", goalsRouter);
app.use("/api/v1/study-sessions", studySessionsRouter);
app.use("/api/v1/pomodoro", pomodoroRouter);
app.use("/api/v1/notifications", notificationsRouter);
app.use("/api/v1/achievements", achievementsRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/notes", notesRouter);
app.use("/api/v1/timetable", timetableRouter);
app.use("/api/v1/exams", examsRouter);

const startServer = async (): Promise<void> => {
  try {
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
