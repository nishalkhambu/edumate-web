import mongoose, { Schema } from "mongoose";
import { IGoal, GoalType, GoalStatus } from "../types/user.types";

const goalSchema = new Schema<IGoal>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    type: { type: String, enum: ["daily", "weekly", "monthly", "long-term"], default: "daily" },
    target: { type: Number, required: true, min: 0 },
    current: { type: Number, default: 0, min: 0 },
    unit: { type: String, required: true },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ["active", "paused", "completed"], default: "active" },
  },
  { timestamps: true }
);

export const Goal = mongoose.model<IGoal>("Goal", goalSchema);
