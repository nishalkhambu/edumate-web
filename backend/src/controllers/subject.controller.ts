import { Request, Response } from "express";
import { Subject } from "../models/subject.model";
import { authorized } from "../middleware/auth.middleware";
import { ISubject, SubjectResponse } from "../types/user.types";

const toResponse = (s: ISubject & { _id: { toString(): string }; createdAt: Date; updatedAt: Date }): SubjectResponse => ({
  id: s._id.toString(),
  userId: s.user.toString(),
  name: s.name,
  code: s.code,
  instructor: s.instructor,
  color: s.color,
  totalClasses: s.totalClasses,
  attendedClasses: s.attendedClasses,
  attendancePct: s.totalClasses > 0 ? Math.round((s.attendedClasses / s.totalClasses) * 100) : 0,
  createdAt: s.createdAt.toISOString(),
  updatedAt: s.updatedAt.toISOString(),
});

export const createSubject = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const { name, code, instructor, color, totalClasses } = req.body as Partial<ISubject>;
    if (!name || !code) { res.status(400).json({ success: false, message: "Name and code are required" }); return; }
    const subject = await Subject.create({ user: authReq.user._id, name: String(name), code: String(code), instructor: instructor || "", color: color || "#6366f1", totalClasses: Number(totalClasses) || 0, attendedClasses: 0 });
    res.status(201).json({ success: true, data: toResponse(subject as any) });
  } catch (error) { console.error("createSubject error:", error); res.status(500).json({ success: false, message: "Failed to create subject" } as any); }
};

export const getSubjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const subjects = await Subject.find({ user: authReq.user._id }).sort({ name: 1 });
    res.status(200).json({ success: true, data: subjects.map((s) => toResponse(s as any)) });
  } catch (error) { console.error("getSubjects error:", error); res.status(500).json({ success: false, message: "Failed to fetch subjects" } as any); }
};

export const getSubjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const subject = await Subject.findOne({ _id: req.params.id, user: authReq.user._id });
    if (!subject) { res.status(404).json({ success: false, message: "Subject not found" }); return; }
    res.status(200).json({ success: true, data: toResponse(subject as any) });
  } catch (error) { console.error("getSubjectById error:", error); res.status(500).json({ success: false, message: "Failed to fetch subject" } as any); }
};

export const updateSubject = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const subject = await Subject.findOne({ _id: req.params.id, user: authReq.user._id });
    if (!subject) { res.status(404).json({ success: false, message: "Subject not found" }); return; }
    const allowed = ["name", "code", "instructor", "color", "totalClasses", "attendedClasses"] as const;
    allowed.forEach((key) => { if (req.body[key] !== undefined) (subject as any)[key] = req.body[key]; });
    await subject.save();
    res.status(200).json({ success: true, data: toResponse(subject as any) });
  } catch (error) { console.error("updateSubject error:", error); res.status(500).json({ success: false, message: "Failed to update subject" } as any); }
};

export const deleteSubject = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const subject = await Subject.findOne({ _id: req.params.id, user: authReq.user._id });
    if (!subject) { res.status(404).json({ success: false, message: "Subject not found" }); return; }
    await subject.deleteOne();
    res.status(200).json({ success: true, message: "Subject deleted successfully" });
  } catch (error) { console.error("deleteSubject error:", error); res.status(500).json({ success: false, message: "Failed to delete subject" } as any); }
};
