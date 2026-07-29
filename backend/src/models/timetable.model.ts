import mongoose, { Schema } from "mongoose";
import { ITimetableEntry } from "../types/user.types";

const timetableSchema = new Schema<ITimetableEntry>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    subject: { type: String, required: true, trim: true },
    day: { type: Number, required: true, min: 0, max: 6 },
    start: { type: String, required: true },
    end: { type: String, required: true },
    type: { type: String, enum: ["class", "lab", "study"], default: "class" },
    color: { type: String, default: "#6366f1" },
  },
  { timestamps: true }
);

export const TimetableEntry = mongoose.model<ITimetableEntry>("TimetableEntry", timetableSchema);
