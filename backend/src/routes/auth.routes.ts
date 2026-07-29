import { Router } from "express";
import {
  loginUser,
  registerUser,
  whoamiUser,
  updateUser,
  upload,
  forgotPassword,
  resetPassword,
  refreshToken,
  logoutUser,
} from "../controllers/auth.controller";
import { authorized } from "../middleware/auth.middleware";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/refresh", refreshToken);
authRouter.post("/logout", logoutUser);
authRouter.get("/whoami", authorized, whoamiUser);
authRouter.put("/update", authorized, upload.single("avatar"), updateUser);
authRouter.post("/reset-password/:token", resetPassword);

export default authRouter;
