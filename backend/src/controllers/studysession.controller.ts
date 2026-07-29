import { Request, Response } from "express";
import { StudySession } from "../models/studysession.model";
import { authorized } from "../middleware/auth.middleware";
import { IStudySession, StudySessionResponse } from "../types/user.types";

const toResponse = (s: IStudySession & { _id: { toString(): string }; createdAt: Date; updatedAt: Date }): StudySessionResponse => ({
  id: s._id.toString(),
  userId: s.user.toString(),
  subject: s.subject,
  topic: s.topic,
  startTime: s.startTime.toISOString(),
  endTime: s.endTime.toISOString(),
  duration: s.duration,
  notes: s.notes,
  productivity: s.productivity,
  createdAt: s.createdAt.toISOString(),
});

export const createStudySession = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const { subject, topic, startedAt, durationMinutes, startTime, endTime, notes, productivity } = req.body as Partial<IStudySession> & Record<string, unknown>;
    if (!subject) { res.status(400).json({ success: false, message: "Subject is required" }); return; }
    let start: Date;
    let end: Date;
    let duration = 0;
    if (startTime && endTime) {
      start = new Date(startTime as string | number | Date);
      end = new Date(endTime as string | number | Date);
      duration = Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
    } else if (startedAt && durationMinutes) {
      start = new Date(startedAt as string | number | Date);
      end = new Date(start.getTime() + Number(durationMinutes) * 60000);
      duration = Number(durationMinutes);
    } else {
      res.status(400).json({ success: false, message: "Either startTime+endTime or startedAt+durationMinutes are required" }); return;
    }
    const session = await StudySession.create({ user: authReq.user._id, subject: String(subject), topic: topic || "", startTime: start, endTime: end, duration, notes: notes || "", productivity: Number(productivity) || 3 });
    res.status(201).json({ success: true, data: toResponse(session as any) });
  } catch (error) { console.error("createStudySession error:", error); res.status(500).json({ success: false, message: "Failed to create study session" } as any); }
};

export const getStudySessions = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const { from, to } = req.query as Record<string, string>;
    const query: Record<string, unknown> = { user: authReq.user._id };
    const startFilter: Record<string, Date> = {};
    if (from) startFilter.$gte = new Date(from);
    if (to) startFilter.$lte = new Date(to);
    if (Object.keys(startFilter).length) query.startTime = startFilter;
    const sessions = await StudySession.find(query).sort({ startTime: -1 });
    res.status(200).json({ success: true, data: sessions.map((s) => toResponse(s as any)) });
  } catch (error) { console.error("getStudySessions error:", error); res.status(500).json({ success: false, message: "Failed to fetch study sessions" } as any); }
};

export const getStudySessionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const session = await StudySession.findOne({ _id: req.params.id, user: authReq.user._id });
    if (!session) { res.status(404).json({ success: false, message: "Study session not found" }); return; }
    res.status(200).json({ success: true, data: toResponse(session as any) });
  } catch (error) { console.error("getStudySessionById error:", error); res.status(500).json({ success: false, message: "Failed to fetch study session" } as any); }
};

export const updateStudySession = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const session = await StudySession.findOne({ _id: req.params.id, user: authReq.user._id });
    if (!session) { res.status(404).json({ success: false, message: "Study session not found" }); return; }
    const allowed = ["subject", "topic", "startTime", "endTime", "notes", "productivity"] as const;
    allowed.forEach((key) => { if (req.body[key] !== undefined) (session as any)[key] = req.body[key]; });
    if (req.body.startTime || req.body.endTime) {
      const start = new Date(session.startTime);
      const end = new Date(session.endTime);
      session.duration = Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
    }
    await session.save();
    res.status(200).json({ success: true, data: toResponse(session as any) });
  } catch (error) { console.error("updateStudySession error:", error); res.status(500).json({ success: false, message: "Failed to update study session" } as any); }
};

export const deleteStudySession = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const session = await StudySession.findOne({ _id: req.params.id, user: authReq.user._id });
    if (!session) { res.status(404).json({ success: false, message: "Study session not found" }); return; }
    await session.deleteOne();
    res.status(200).json({ success: true, message: "Study session deleted successfully" });
  } catch (error) { console.error("deleteStudySession error:", error); res.status(500).json({ success: false, message: "Failed to delete study session" } as any); }
};
