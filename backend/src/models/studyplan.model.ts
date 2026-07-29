import mongoose, { Schema } from "mongoose";
import { IStudyPlan, StudyPlanStatus, Priority } from "../types/user.types";

const studyPlanSchema = new Schema<IStudyPlan>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    topic: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    studyHours: { type: Number, required: true, min: 0 },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ["not-started", "in-progress", "completed", "paused"], default: "not-started" },
    progress: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

export const StudyPlan = mongoose.model<IStudyPlan>("StudyPlan", studyPlanSchema);
