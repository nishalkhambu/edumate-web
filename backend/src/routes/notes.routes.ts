import { Router } from "express";
import { createNote, getNotes, getNoteById, updateNote, deleteNote } from "../controllers/note.controller";
import { authorized } from "../middleware/auth.middleware";

const router = Router();
router.use(authorized);
router.post("/", createNote);
router.get("/", getNotes);
router.get("/:id", getNoteById);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
