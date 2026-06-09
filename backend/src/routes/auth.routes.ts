import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller";

const authRouter = Router();

/**
 * Authentication routes for user registration and login.
 */
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

export default authRouter;
