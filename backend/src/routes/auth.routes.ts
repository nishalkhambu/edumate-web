import { Router } from "express";
import {
  loginUser,
  registerUser,
  whoamiUser,
  updateUser,
  upload,
} from "../controllers/auth.controller";
import { authorized } from "../middleware/auth.middleware";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

authRouter.get("/whoami", authorized, whoamiUser);
authRouter.put("/update", authorized, upload.single("avatar"), updateUser);

export default authRouter;
