import { Request, Response } from "express";
import { StudyPlan } from "../models/studyplan.model";
import { authorized } from "../middleware/auth.middleware";
import { IStudyPlan, StudyPlanStatus, Priority, StudyPlanResponse } from "../types/user.types";

const toResponse = (p: IStudyPlan & { _id: { toString(): string }; createdAt: Date; updatedAt: Date }): StudyPlanResponse => ({
  id: p._id.toString(),
  userId: p.user.toString(),
  title: p.title,
  subject: p.subject,
  topic: p.topic,
  description: p.description,
  studyHours: p.studyHours,
  priority: p.priority,
  deadline: p.deadline.toISOString(),
  status: p.status,
  progress: p.progress,
  createdAt: p.createdAt.toISOString(),
  updatedAt: p.updatedAt.toISOString(),
});

export const createStudyPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }

    const { title, subject, topic, description, studyHours, priority, deadline, status, progress } = req.body as Partial<IStudyPlan>;
    if (!title || !subject || !topic || !deadline) {
      res.status(400).json({ success: false, message: "title, subject, topic and deadline are required" });
      return;
    }

    const plan = await StudyPlan.create({
      user: authReq.user._id,
      title: String(title),
      subject: String(subject),
      topic: String(topic),
      description: description ? String(description) : "",
      studyHours: studyHours ?? 0,
      priority: priority || "medium",
      deadline: new Date(deadline),
      status: status || "not-started",
      progress: typeof progress === "number" ? progress : 0,
    });
    res.status(201).json({ success: true, data: toResponse(plan as any) });
  } catch (error) {
    console.error("createStudyPlan error:", error);
    res.status(500).json({ success: false, message: "Failed to create study plan" } as any);
  }
};

export const getStudyPlans = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }

    const { status, priority } = req.query as Record<string, string>;
    const query: Record<string, unknown> = { user: authReq.user._id };
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const plans = await StudyPlan.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: plans.map((p) => toResponse(p as any)) });
  } catch (error) {
    console.error("getStudyPlans error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch study plans" } as any);
  }
};

export const getStudyPlanById = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }

    const plan = await StudyPlan.findOne({ _id: req.params.id, user: authReq.user._id });
    if (!plan) { res.status(404).json({ success: false, message: "Study plan not found" }); return; }

    res.status(200).json({ success: true, data: toResponse(plan as any) });
  } catch (error) {
    console.error("getStudyPlanById error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch study plan" } as any);
  }
};

export const updateStudyPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }

    const plan = await StudyPlan.findOne({ _id: req.params.id, user: authReq.user._id });
    if (!plan) { res.status(404).json({ success: false, message: "Study plan not found" }); return; }

    const allowed = ["title", "subject", "topic", "description", "studyHours", "priority", "deadline", "status", "progress"] as const;
    allowed.forEach((key) => { if (req.body[key] !== undefined) (plan as any)[key] = req.body[key]; });

    if (req.body.deadline) plan.deadline = new Date(req.body.deadline);

    await plan.save();
    res.status(200).json({ success: true, data: toResponse(plan as any) });
  } catch (error) {
    console.error("updateStudyPlan error:", error);
    res.status(500).json({ success: false, message: "Failed to update study plan" } as any);
  }
};

export const deleteStudyPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }

    const plan = await StudyPlan.findOne({ _id: req.params.id, user: authReq.user._id });
    if (!plan) { res.status(404).json({ success: false, message: "Study plan not found" }); return; }

    await plan.deleteOne();
    res.status(200).json({ success: true, message: "Study plan deleted successfully" });
  } catch (error) {
    console.error("deleteStudyPlan error:", error);
    res.status(500).json({ success: false, message: "Failed to delete study plan" } as any);
  }
};
