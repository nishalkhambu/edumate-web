import mongoose, { Schema } from "mongoose";
import { INotification, NotificationType } from "../types/user.types";

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["deadline", "reminder", "achievement", "system"], default: "system" },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false },
    relatedId: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>("Notification", notificationSchema);
