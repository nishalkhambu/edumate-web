import { Request, Response } from "express";
import { Notification } from "../models/notification.model";
import { authorized } from "../middleware/auth.middleware";
import { INotification, NotificationResponse, NotificationType } from "../types/user.types";

const toResponse = (n: INotification & { _id: { toString(): string }; createdAt: Date; updatedAt: Date }): NotificationResponse => ({
  id: n._id.toString(),
  userId: n.user.toString(),
  type: n.type,
  title: n.title,
  message: n.message,
  read: n.read,
  relatedId: n.relatedId?.toString(),
  createdAt: n.createdAt.toISOString(),
});

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const { read, type } = req.query as Record<string, string>;
    const query: Record<string, unknown> = { user: authReq.user._id };
    if (read !== undefined) query.read = read === "true";
    if (type) query.type = type;
    const notifications = await Notification.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notifications.map((n) => toResponse(n as any)) });
  } catch (error) { console.error("getNotifications error:", error); res.status(500).json({ success: false, message: "Failed to fetch notifications" } as any); }
};

export const markNotificationRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const notification = await Notification.findOne({ _id: req.params.id, user: authReq.user._id });
    if (!notification) { res.status(404).json({ success: false, message: "Notification not found" }); return; }
    notification.read = true;
    await notification.save();
    res.status(200).json({ success: true, data: toResponse(notification as any) });
  } catch (error) { console.error("markNotificationRead error:", error); res.status(500).json({ success: false, message: "Failed to update notification" } as any); }
};

export const markAllNotificationsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    await Notification.updateMany({ user: authReq.user._id, read: false }, { $set: { read: true } });
    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error) { console.error("markAllNotificationsRead error:", error); res.status(500).json({ success: false, message: "Failed to update notifications" } as any); }
};
