import { Router } from "express";
import { createTimetableEntry, getTimetableEntries, getTimetableEntryById, updateTimetableEntry, deleteTimetableEntry } from "../controllers/timetable.controller";
import { authorized } from "../middleware/auth.middleware";

const router = Router();
router.use(authorized);
router.post("/", createTimetableEntry);
router.get("/", getTimetableEntries);
router.get("/:id", getTimetableEntryById);
router.put("/:id", updateTimetableEntry);
router.delete("/:id", deleteTimetableEntry);

export default router;
