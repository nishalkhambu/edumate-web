import { Router } from "express";
import { createExamPlan, getExamPlans, getExamPlanById, updateExamPlan, deleteExamPlan } from "../controllers/examplan.controller";
import { authorized } from "../middleware/auth.middleware";

const router = Router();
router.use(authorized);
router.post("/", createExamPlan);
router.get("/", getExamPlans);
router.get("/:id", getExamPlanById);
router.put("/:id", updateExamPlan);
router.delete("/:id", deleteExamPlan);

export default router;
