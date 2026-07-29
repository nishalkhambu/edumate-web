import { Router } from "express";
import { createPomodoroSession, getPomodoroSessions } from "../controllers/pomodoro.controller";
import { authorized } from "../middleware/auth.middleware";

const router = Router();
router.use(authorized);
router.post("/", createPomodoroSession);
router.get("/", getPomodoroSessions);

export default router;
