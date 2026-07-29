import mongoose, { Schema } from "mongoose";
import { INote } from "../types/user.types";

const noteSchema = new Schema<INote>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, default: "" },
    tag: { type: String, default: "" },
    favorite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Note = mongoose.model<INote>("Note", noteSchema);
