import { Router } from "express";
import { createStudySession, getStudySessions, getStudySessionById, updateStudySession, deleteStudySession } from "../controllers/studysession.controller";
import { authorized } from "../middleware/auth.middleware";

const router = Router();
router.use(authorized);
router.post("/", createStudySession);
router.get("/", getStudySessions);
router.get("/:id", getStudySessionById);
router.put("/:id", updateStudySession);
router.delete("/:id", deleteStudySession);

export default router;
