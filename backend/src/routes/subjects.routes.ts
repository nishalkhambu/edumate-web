import { Router } from "express";
import { createSubject, getSubjects, getSubjectById, updateSubject, deleteSubject } from "../controllers/subject.controller";
import { authorized } from "../middleware/auth.middleware";

const router = Router();
router.use(authorized);
router.post("/", createSubject);
router.get("/", getSubjects);
router.get("/:id", getSubjectById);
router.put("/:id", updateSubject);
router.delete("/:id", deleteSubject);

export default router;
