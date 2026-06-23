import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { ApiErrorResponse } from "../types/user.types";

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    email: string;
    name: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const unauthorizedResponse = (res: Response): void => {
  const errorResponse: ApiErrorResponse = {
    success: false,
    message: "Unauthorized - Invalid or missing token",
  };
  res.status(401).json(errorResponse);
};

export const authorized = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      unauthorizedResponse(res);
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      unauthorizedResponse(res);
      return;
    }

    req.user = {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    console.error("authorized middleware error:", error);
    unauthorizedResponse(res);
  }
};
