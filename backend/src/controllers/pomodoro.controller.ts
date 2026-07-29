import { Request, Response } from "express";
import { PomodoroSession } from "../models/pomodorosession.model";
import { authorized } from "../middleware/auth.middleware";
import { IPomodoroSession, PomodoroSessionResponse } from "../types/user.types";

const toResponse = (p: IPomodoroSession & { _id: { toString(): string }; createdAt: Date; updatedAt: Date }): PomodoroSessionResponse => ({
  id: p._id.toString(),
  userId: p.user.toString(),
  mode: p.mode,
  duration: p.duration,
  completedAt: p.completedAt.toISOString(),
  taskId: p.taskId?.toString(),
});

export const createPomodoroSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const { mode, duration, taskId } = req.body as Partial<IPomodoroSession>;
    if (!mode || !duration) { res.status(400).json({ success: false, message: "mode and duration are required" }); return; }
    const session = await PomodoroSession.create({ user: authReq.user._id, mode: String(mode), duration: Number(duration), completedAt: new Date(), taskId: taskId ? new (require("mongoose").default)(taskId) as any : undefined });
    res.status(201).json({ success: true, data: toResponse(session as any) });
  } catch (error) { console.error("createPomodoroSession error:", error); res.status(500).json({ success: false, message: "Failed to create pomodoro session" } as any); }
};

export const getPomodoroSessions = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const { mode, from, to } = req.query as Record<string, string>;
    const query: Record<string, unknown> = { user: authReq.user._id };
    if (mode) query.mode = mode;
    const dateFilter: Record<string, Date> = {};
    if (from) dateFilter.$gte = new Date(from);
    if (to) dateFilter.$lte = new Date(to);
    if (Object.keys(dateFilter).length) query.completedAt = dateFilter;
    const sessions = await PomodoroSession.find(query).sort({ completedAt: -1 });
    res.status(200).json({ success: true, data: sessions.map((s) => toResponse(s as any)) });
  } catch (error) { console.error("getPomodoroSessions error:", error); res.status(500).json({ success: false, message: "Failed to fetch pomodoro sessions" } as any); }
};
