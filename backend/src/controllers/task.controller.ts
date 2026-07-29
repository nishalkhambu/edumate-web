import { Request, Response } from "express";
import { Task } from "../models/task.model";
import { authorized } from "../middleware/auth.middleware";
import { ITask, TaskResponse, TaskCategory, Priority } from "../types/user.types";

const toResponse = (t: ITask & { _id: { toString(): string }; createdAt: Date; updatedAt: Date }): TaskResponse => ({
  id: t._id.toString(),
  userId: t.user.toString(),
  title: t.title,
  description: t.description,
  category: t.category,
  priority: t.priority,
  dueDate: t.dueDate.toISOString(),
  status: t.status,
  isRecurring: t.isRecurring,
  recurringPattern: t.recurringPattern,
  createdAt: t.createdAt.toISOString(),
  updatedAt: t.updatedAt.toISOString(),
});

const mapBody = (body: Partial<ITask> & Record<string, unknown>) => {
  const out: Record<string, unknown> = {};
  if (body.title) out.title = String(body.title);
  if (body.description !== undefined) out.description = String(body.description);
  if (body.category) out.category = String(body.category);
  if (body.priority) out.priority = String(body.priority);
  if (body.dueDate) out.dueDate = new Date(String(body.dueDate));
  if (body.status) out.status = String(body.status);
  if (body.isRecurring !== undefined) out.isRecurring = Boolean(body.isRecurring);
  if (body.recurringPattern) out.recurringPattern = String(body.recurringPattern);
  return out;
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const { title, description, category, priority, dueDate, status } = req.body as Partial<ITask>;
    if (!title) { res.status(400).json({ success: false, message: "Title is required" }); return; }
    const task = await Task.create({ user: authReq.user._id, title: String(title), description: description || "", category: category || "study", priority: priority || "medium", dueDate: new Date(dueDate || Date.now()), status: status || "pending" });
    res.status(201).json({ success: true, data: toResponse(task as any) });
  } catch (error) { console.error("createTask error:", error); res.status(500).json({ success: false, message: "Failed to create task" } as any); }
};

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const { status, category, priority } = req.query as Record<string, string>;
    const query: Record<string, unknown> = { user: authReq.user._id };
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tasks.map((t) => toResponse(t as any)) });
  } catch (error) { console.error("getTasks error:", error); res.status(500).json({ success: false, message: "Failed to fetch tasks" } as any); }
};

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const task = await Task.findOne({ _id: req.params.id, user: authReq.user._id });
    if (!task) { res.status(404).json({ success: false, message: "Task not found" }); return; }
    res.status(200).json({ success: true, data: toResponse(task as any) });
  } catch (error) { console.error("getTaskById error:", error); res.status(500).json({ success: false, message: "Failed to fetch task" } as any); }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const task = await Task.findOne({ _id: req.params.id, user: authReq.user._id });
    if (!task) { res.status(404).json({ success: false, message: "Task not found" }); return; }
    Object.assign(task, mapBody(req.body));
    await task.save();
    res.status(200).json({ success: true, data: toResponse(task as any) });
  } catch (error) { console.error("updateTask error:", error); res.status(500).json({ success: false, message: "Failed to update task" } as any); }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const task = await Task.findOne({ _id: req.params.id, user: authReq.user._id });
    if (!task) { res.status(404).json({ success: false, message: "Task not found" }); return; }
    await task.deleteOne();
    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) { console.error("deleteTask error:", error); res.status(500).json({ success: false, message: "Failed to delete task" } as any); }
};
