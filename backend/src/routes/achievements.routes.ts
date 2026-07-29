import { Router } from "express";
import { getAchievements, createAchievement } from "../controllers/achievement.controller";
import { authorized } from "../middleware/auth.middleware";

const router = Router();
router.use(authorized);
router.get("/", getAchievements);
router.post("/", createAchievement);

export default router;
