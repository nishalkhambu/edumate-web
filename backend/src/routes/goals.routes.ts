import { Router } from "express";
import { createGoal, getGoals, getGoalById, updateGoal, deleteGoal } from "../controllers/goal.controller";
import { authorized } from "../middleware/auth.middleware";

const router = Router();
router.use(authorized);
router.post("/", createGoal);
router.get("/", getGoals);
router.get("/:id", getGoalById);
router.put("/:id", updateGoal);
router.delete("/:id", deleteGoal);

export default router;
