import { Request, Response } from "express";
import { ExamPlan } from "../models/examplan.model";
import { authorized } from "../middleware/auth.middleware";
import { IExamPlan, ExamPlanResponse } from "../types/user.types";

const toResponse = (e: IExamPlan & { _id: { toString(): string }; createdAt: Date; updatedAt: Date }): ExamPlanResponse => ({
  id: e._id.toString(),
  userId: e.user.toString(),
  subject: e.subject,
  date: e.date,
  days: e.days,
  prep: e.prep,
  priority: e.priority,
  syllabus: e.syllabus,
  completed: e.completed,
  createdAt: e.createdAt.toISOString(),
  updatedAt: e.updatedAt.toISOString(),
});

export const createExamPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const { subject, date, days, prep, priority, syllabus, completed } = req.body as Partial<IExamPlan>;
    if (!subject || !date || days === undefined) { res.status(400).json({ success: false, message: "subject, date and days are required" }); return; }
    const plan = await ExamPlan.create({ user: authReq.user._id, subject: String(subject), date: String(date), days: Number(days), prep: Number(prep) || 0, priority: priority || "Medium", syllabus: Number(syllabus) || 0, completed: Number(completed) || 0 });
    res.status(201).json({ success: true, data: toResponse(plan as any) });
  } catch (error) { console.error("createExamPlan error:", error); res.status(500).json({ success: false, message: "Failed to create exam plan" } as any); }
};

export const getExamPlans = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const { priority } = req.query as Record<string, string>;
    const query: Record<string, unknown> = { user: authReq.user._id };
    if (priority) query.priority = priority;
    const plans = await ExamPlan.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: plans.map((e) => toResponse(e as any)) });
  } catch (error) { console.error("getExamPlans error:", error); res.status(500).json({ success: false, message: "Failed to fetch exam plans" } as any); }
};

export const getExamPlanById = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const plan = await ExamPlan.findOne({ _id: req.params.id, user: authReq.user._id });
    if (!plan) { res.status(404).json({ success: false, message: "Exam plan not found" }); return; }
    res.status(200).json({ success: true, data: toResponse(plan as any) });
  } catch (error) { console.error("getExamPlanById error:", error); res.status(500).json({ success: false, message: "Failed to fetch exam plan" } as any); }
};

export const updateExamPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const plan = await ExamPlan.findOne({ _id: req.params.id, user: authReq.user._id });
    if (!plan) { res.status(404).json({ success: false, message: "Exam plan not found" }); return; }
    const allowed = ["subject", "date", "days", "prep", "priority", "syllabus", "completed"] as const;
    allowed.forEach((key) => { if (req.body[key] !== undefined) (plan as any)[key] = req.body[key]; });
    await plan.save();
    res.status(200).json({ success: true, data: toResponse(plan as any) });
  } catch (error) { console.error("updateExamPlan error:", error); res.status(500).json({ success: false, message: "Failed to update exam plan" } as any); }
};

export const deleteExamPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const plan = await ExamPlan.findOne({ _id: req.params.id, user: authReq.user._id });
    if (!plan) { res.status(404).json({ success: false, message: "Exam plan not found" }); return; }
    await plan.deleteOne();
    res.status(200).json({ success: true, message: "Exam plan deleted successfully" });
  } catch (error) { console.error("deleteExamPlan error:", error); res.status(500).json({ success: false, message: "Failed to delete exam plan" } as any); }
};
