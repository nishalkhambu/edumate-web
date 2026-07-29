import mongoose, { Schema } from "mongoose";
import { IStudySession } from "../types/user.types";

const studySessionSchema = new Schema<IStudySession>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    subject: { type: String, required: true, trim: true },
    topic: { type: String, required: true, trim: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true, min: 0 },
    notes: { type: String, default: "" },
    productivity: { type: Number, min: 1, max: 5, default: 3 },
  },
  { timestamps: true }
);

export const StudySession = mongoose.model<IStudySession>("StudySession", studySessionSchema);
