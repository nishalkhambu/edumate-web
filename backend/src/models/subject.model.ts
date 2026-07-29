import mongoose, { Schema } from "mongoose";
import { ISubject } from "../types/user.types";

const subjectSchema = new Schema<ISubject>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true },
    instructor: { type: String, default: "" },
    color: { type: String, default: "#6366f1" },
    totalClasses: { type: Number, default: 0, min: 0 },
    attendedClasses: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export const Subject = mongoose.model<ISubject>("Subject", subjectSchema);
