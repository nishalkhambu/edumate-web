import mongoose, { Schema } from "mongoose";
import { ITask, TaskCategory, TaskStatus, Priority } from "../types/user.types";

const taskSchema = new Schema<ITask>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: { type: String, enum: ["study", "assignment", "exam", "personal"], default: "study" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["pending", "in_progress", "completed"], default: "pending" },
    isRecurring: { type: Boolean, default: false },
    recurringPattern: { type: String, enum: ["daily", "weekly", "monthly"], default: undefined },
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>("Task", taskSchema);
