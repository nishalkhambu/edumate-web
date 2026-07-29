import { Request, Response } from "express";
import { Note } from "../models/note.model";
import { authorized } from "../middleware/auth.middleware";
import { INote, NoteResponse } from "../types/user.types";

const toResponse = (n: INote & { _id: { toString(): string }; createdAt: Date; updatedAt: Date }): NoteResponse => ({
  id: n._id.toString(),
  userId: n.user.toString(),
  title: n.title,
  content: n.content,
  tag: n.tag,
  favorite: n.favorite,
  createdAt: n.createdAt.toISOString(),
  updatedAt: n.updatedAt.toISOString(),
});

export const createNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const { title, content, tag, favorite } = req.body as Partial<INote>;
    if (!title) { res.status(400).json({ success: false, message: "Title is required" }); return; }
    const note = await Note.create({ user: authReq.user._id, title: String(title), content: content || "", tag: tag || "", favorite: Boolean(favorite) });
    res.status(201).json({ success: true, data: toResponse(note as any) });
  } catch (error) { console.error("createNote error:", error); res.status(500).json({ success: false, message: "Failed to create note" } as any); }
};

export const getNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const { tag } = req.query as Record<string, string>;
    const query: Record<string, unknown> = { user: authReq.user._id };
    if (tag) query.tag = tag;
    const notes = await Note.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notes.map((n) => toResponse(n as any)) });
  } catch (error) { console.error("getNotes error:", error); res.status(500).json({ success: false, message: "Failed to fetch notes" } as any); }
};

export const getNoteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const note = await Note.findOne({ _id: req.params.id, user: authReq.user._id });
    if (!note) { res.status(404).json({ success: false, message: "Note not found" }); return; }
    res.status(200).json({ success: true, data: toResponse(note as any) });
  } catch (error) { console.error("getNoteById error:", error); res.status(500).json({ success: false, message: "Failed to fetch note" } as any); }
};

export const updateNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const note = await Note.findOne({ _id: req.params.id, user: authReq.user._id });
    if (!note) { res.status(404).json({ success: false, message: "Note not found" }); return; }
    const allowed = ["title", "content", "tag", "favorite"] as const;
    allowed.forEach((key) => { if (req.body[key] !== undefined) (note as any)[key] = req.body[key]; });
    await note.save();
    res.status(200).json({ success: true, data: toResponse(note as any) });
  } catch (error) { console.error("updateNote error:", error); res.status(500).json({ success: false, message: "Failed to update note" } as any); }
};

export const deleteNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const note = await Note.findOne({ _id: req.params.id, user: authReq.user._id });
    if (!note) { res.status(404).json({ success: false, message: "Note not found" }); return; }
    await note.deleteOne();
    res.status(200).json({ success: true, message: "Note deleted successfully" });
  } catch (error) { console.error("deleteNote error:", error); res.status(500).json({ success: false, message: "Failed to delete note" } as any); }
};
