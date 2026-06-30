import { Router } from "express";
import {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/admin.controller";
import { authorized, adminOnly } from "../middleware/auth.middleware";

const adminRouter = Router();

adminRouter.use(authorized);
adminRouter.use(adminOnly);

adminRouter.get("/users", listUsers);
adminRouter.get("/users/:id", getUserById);
adminRouter.post("/users", createUser);
adminRouter.put("/users/:id", updateUser);
adminRouter.delete("/users/:id", deleteUser);

export default adminRouter;
