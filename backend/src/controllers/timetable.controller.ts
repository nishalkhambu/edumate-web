import { Request, Response } from "express";
import { TimetableEntry } from "../models/timetable.model";
import { authorized } from "../middleware/auth.middleware";
import { ITimetableEntry, TimetableEntryResponse } from "../types/user.types";

const toResponse = (t: ITimetableEntry & { _id: { toString(): string }; createdAt: Date; updatedAt: Date }): TimetableEntryResponse => ({
  id: t._id.toString(),
  userId: t.user.toString(),
  subject: t.subject,
  day: t.day,
  start: t.start,
  end: t.end,
  type: t.type,
  color: t.color,
  createdAt: t.createdAt.toISOString(),
  updatedAt: t.updatedAt.toISOString(),
});

export const createTimetableEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const { subject, day, start, end, type, color } = req.body as Partial<ITimetableEntry>;
    if (!subject || day === undefined || !start || !end) { res.status(400).json({ success: false, message: "subject, day, start and end are required" }); return; }
    const entry = await TimetableEntry.create({ user: authReq.user._id, subject: String(subject), day: Number(day), start: String(start), end: String(end), type: type || "class", color: color || "#6366f1" });
    res.status(201).json({ success: true, data: toResponse(entry as any) });
  } catch (error) { console.error("createTimetableEntry error:", error); res.status(500).json({ success: false, message: "Failed to create timetable entry" } as any); }
};

export const getTimetableEntries = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const { day } = req.query as Record<string, string>;
    const query: Record<string, unknown> = { user: authReq.user._id };
    if (day !== undefined) query.day = Number(day);
    const entries = await TimetableEntry.find(query).sort({ day: 1, start: 1 });
    res.status(200).json({ success: true, data: entries.map((t) => toResponse(t as any)) });
  } catch (error) { console.error("getTimetableEntries error:", error); res.status(500).json({ success: false, message: "Failed to fetch timetable" } as any); }
};

export const getTimetableEntryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const entry = await TimetableEntry.findOne({ _id: req.params.id, user: authReq.user._id });
    if (!entry) { res.status(404).json({ success: false, message: "Timetable entry not found" }); return; }
    res.status(200).json({ success: true, data: toResponse(entry as any) });
  } catch (error) { console.error("getTimetableEntryById error:", error); res.status(500).json({ success: false, message: "Failed to fetch timetable entry" } as any); }
};

export const updateTimetableEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const entry = await TimetableEntry.findOne({ _id: req.params.id, user: authReq.user._id });
    if (!entry) { res.status(404).json({ success: false, message: "Timetable entry not found" }); return; }
    const allowed = ["subject", "day", "start", "end", "type", "color"] as const;
    allowed.forEach((key) => { if (req.body[key] !== undefined) (entry as any)[key] = req.body[key]; });
    await entry.save();
    res.status(200).json({ success: true, data: toResponse(entry as any) });
  } catch (error) { console.error("updateTimetableEntry error:", error); res.status(500).json({ success: false, message: "Failed to update timetable entry" } as any); }
};

export const deleteTimetableEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const entry = await TimetableEntry.findOne({ _id: req.params.id, user: authReq.user._id });
    if (!entry) { res.status(404).json({ success: false, message: "Timetable entry not found" }); return; }
    await entry.deleteOne();
    res.status(200).json({ success: true, message: "Timetable entry deleted successfully" });
  } catch (error) { console.error("deleteTimetableEntry error:", error); res.status(500).json({ success: false, message: "Failed to delete timetable entry" } as any); }
};
