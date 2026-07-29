import mongoose, { Schema } from "mongoose";
import { IPomodoroSession, PomodoroMode } from "../types/user.types";

const pomodoroSchema = new Schema<IPomodoroSession>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    mode: { type: String, enum: ["focus", "short-break", "long-break"], default: "focus" },
    duration: { type: Number, required: true, min: 1 },
    completedAt: { type: Date, default: Date.now },
    taskId: { type: Schema.Types.ObjectId, ref: "Task" },
  },
  { timestamps: true }
);

export const PomodoroSession = mongoose.model<IPomodoroSession>("PomodoroSession", pomodoroSchema);
