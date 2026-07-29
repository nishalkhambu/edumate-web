import mongoose, { Schema } from "mongoose";
import { IAchievement } from "../types/user.types";

const achievementSchema = new Schema<IAchievement>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    badge: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    earnedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Achievement = mongoose.model<IAchievement>("Achievement", achievementSchema);
