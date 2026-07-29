import { Request, Response } from "express";
import { Goal } from "../models/goal.model";
import { authorized } from "../middleware/auth.middleware";
import { IGoal, GoalResponse, GoalStatus, GoalType } from "../types/user.types";

const toResponse = (g: IGoal & { _id: { toString(): string }; createdAt: Date; updatedAt: Date }): GoalResponse => ({
  id: g._id.toString(),
  userId: g.user.toString(),
  title: g.title,
  description: g.description,
  type: g.type,
  target: g.target,
  current: g.current,
  unit: g.unit,
  deadline: g.deadline.toISOString(),
  status: g.status,
  progressPct: g.target > 0 ? Math.round((g.current / g.target) * 100) : 0,
  createdAt: g.createdAt.toISOString(),
  updatedAt: g.updatedAt.toISOString(),
});

export const createGoal = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const { title, description, type, target, current, unit, deadline, status } = req.body as Partial<IGoal>;
    if (!title || !target || !unit || !deadline) { res.status(400).json({ success: false, message: "title, target, unit and deadline are required" }); return; }
    const goal = await Goal.create({ user: authReq.user._id, title: String(title), description: description || "", type: type || "daily", target: Number(target), current: Number(current) || 0, unit: String(unit), deadline: new Date(deadline), status: status || "active" });
    res.status(201).json({ success: true, data: toResponse(goal as any) });
  } catch (error) { console.error("createGoal error:", error); res.status(500).json({ success: false, message: "Failed to create goal" } as any); }
};

export const getGoals = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const { status, type } = req.query as Record<string, string>;
    const query: Record<string, unknown> = { user: authReq.user._id };
    if (status) query.status = status;
    if (type) query.type = type;
    const goals = await Goal.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: goals.map((g) => toResponse(g as any)) });
  } catch (error) { console.error("getGoals error:", error); res.status(500).json({ success: false, message: "Failed to fetch goals" } as any); }
};

export const getGoalById = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const goal = await Goal.findOne({ _id: req.params.id, user: authReq.user._id });
    if (!goal) { res.status(404).json({ success: false, message: "Goal not found" }); return; }
    res.status(200).json({ success: true, data: toResponse(goal as any) });
  } catch (error) { console.error("getGoalById error:", error); res.status(500).json({ success: false, message: "Failed to fetch goal" } as any); }
};

export const updateGoal = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const goal = await Goal.findOne({ _id: req.params.id, user: authReq.user._id });
    if (!goal) { res.status(404).json({ success: false, message: "Goal not found" }); return; }
    const allowed = ["title", "description", "type", "target", "current", "unit", "deadline", "status"] as const;
    allowed.forEach((key) => { if (req.body[key] !== undefined) (goal as any)[key] = req.body[key]; });
    if (req.body.deadline) goal.deadline = new Date(req.body.deadline);
    await goal.save();
    res.status(200).json({ success: true, data: toResponse(goal as any) });
  } catch (error) { console.error("updateGoal error:", error); res.status(500).json({ success: false, message: "Failed to update goal" } as any); }
};

export const deleteGoal = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const goal = await Goal.findOne({ _id: req.params.id, user: authReq.user._id });
    if (!goal) { res.status(404).json({ success: false, message: "Goal not found" }); return; }
    await goal.deleteOne();
    res.status(200).json({ success: true, message: "Goal deleted successfully" });
  } catch (error) { console.error("deleteGoal error:", error); res.status(500).json({ success: false, message: "Failed to delete goal" } as any); }
};
