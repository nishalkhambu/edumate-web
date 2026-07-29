import { Router } from "express";
import { createStudyPlan, getStudyPlans, getStudyPlanById, updateStudyPlan, deleteStudyPlan } from "../controllers/studyplan.controller";
import { authorized } from "../middleware/auth.middleware";

const router = Router();
router.use(authorized);
router.post("/", createStudyPlan);
router.get("/", getStudyPlans);
router.get("/:id", getStudyPlanById);
router.put("/:id", updateStudyPlan);
router.delete("/:id", deleteStudyPlan);

export default router;
