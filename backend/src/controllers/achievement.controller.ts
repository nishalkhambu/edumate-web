import { Request, Response } from "express";
import { Achievement } from "../models/achievement.model";
import { authorized } from "../middleware/auth.middleware";
import { IAchievement, AchievementResponse } from "../types/user.types";

const toResponse = (a: IAchievement & { _id: { toString(): string }; createdAt: Date; updatedAt: Date }): AchievementResponse => ({
  id: a._id.toString(),
  userId: a.user.toString(),
  badge: a.badge,
  title: a.title,
  description: a.description,
  earnedAt: a.earnedAt.toISOString(),
});

export const getAchievements = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const badges = await Achievement.find({ user: authReq.user._id }).sort({ earnedAt: -1 });
    res.status(200).json({ success: true, data: badges.map((a) => toResponse(a as any)) });
  } catch (error) { console.error("getAchievements error:", error); res.status(500).json({ success: false, message: "Failed to fetch achievements" } as any); }
};

export const createAchievement = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const { badge, title, description } = req.body as Partial<IAchievement>;
    if (!badge || !title) { res.status(400).json({ success: false, message: "badge and title are required" }); return; }
    const achievement = await Achievement.create({ user: authReq.user._id, badge: String(badge), title: String(title), description: description || "" });
    res.status(201).json({ success: true, data: toResponse(achievement as any) });
  } catch (error) { console.error("createAchievement error:", error); res.status(500).json({ success: false, message: "Failed to create achievement" } as any); }
};
