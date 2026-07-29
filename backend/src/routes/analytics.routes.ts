import { Router } from "express";
import { getAnalytics } from "../controllers/analytics.controller";
import { authorized } from "../middleware/auth.middleware";

const router = Router();
router.use(authorized);
router.get("/", getAnalytics);

export default router;
