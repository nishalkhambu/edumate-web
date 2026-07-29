import mongoose, { Schema } from "mongoose";
import { IExamPlan } from "../types/user.types";

const examPlanSchema = new Schema<IExamPlan>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    subject: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    days: { type: Number, required: true },
    prep: { type: Number, default: 0, min: 0, max: 100 },
    priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
    syllabus: { type: Number, default: 0 },
    completed: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ExamPlan = mongoose.model<IExamPlan>("ExamPlan", examPlanSchema);
