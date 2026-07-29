import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { User } from "../models/user.model";
import {
  AdminUserListResponse,
  AdminUserResponse,
  AdminForbiddenResponse,
  CreateUserDTO,
  UpdateUserDTO,
  ApiErrorResponse,
  UserRole,
  UserStatus,
  AuthUser,
} from "../types/user.types";

const BCRYPT_SALT_ROUNDS = 10;
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

const toUserResponse = (user: {
  _id: { toString(): string };
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}): AuthUser & { createdAt: string; updatedAt: string } => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: (user.role as UserRole) || "user",
  status: (user.status as UserStatus) || "active",
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});

export const listUsers = async (
  req: Request,
  res: Response<any>
): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
    const search = (req.query.search as string) || "";

    const query: Record<string, unknown> = {};

    if (search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { email: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const data = users.map((u) => toUserResponse(u));

    const response: AdminUserListResponse = {
      success: true,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("listUsers error:", error);
    const errorResponse: ApiErrorResponse = {
      success: false,
      message: "An unexpected error occurred while fetching users",
    };
    res.status(500).json(errorResponse);
  }
};

export const getUserById = async (
  req: Request,
  res: Response<any>
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        message: "User not found",
      };
      res.status(404).json(errorResponse);
      return;
    }

    const response: AdminUserResponse = {
      success: true,
      user: toUserResponse(user),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("getUserById error:", error);
    const errorResponse: ApiErrorResponse = {
      success: false,
      message: "An unexpected error occurred while fetching user",
    };
    res.status(500).json(errorResponse);
  }
};

export const createUser = async (
  req: Request,
  res: Response<any>
): Promise<void> => {
  try {
    const { name, email, password, role, status } = req.body as CreateUserDTO;

    if (!name?.trim()) {
      res.status(400).json({ success: false, message: "Name is required" });
      return;
    }

    if (!email?.trim() || !EMAIL_REGEX.test(email)) {
      res
        .status(400)
        .json({ success: false, message: "A valid email address is required" });
      return;
    }

    if (!password || password.length < 8) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      res
        .status(400)
        .json({ success: false, message: "Email already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user",
      status: status === "inactive" ? "inactive" : "active",
    });

    const response: AdminUserResponse = {
      success: true,
      user: toUserResponse(user),
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("createUser error:", error);
    const errorResponse: ApiErrorResponse = {
      success: false,
      message: "An unexpected error occurred during user creation",
    };
    res.status(500).json(errorResponse);
  }
};

export const updateUser = async (
  req: Request,
  res: Response<any>
): Promise<void> => {
  try {
    const { name, email, role, status, password } = req.body as UpdateUserDTO;

    const user = await User.findById(req.params.id);

    if (!user) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        message: "User not found",
      };
      res.status(404).json(errorResponse);
      return;
    }

    const updateFields: Record<string, unknown> = {};

    if (name !== undefined && name !== "") {
      updateFields.name = name;
    }

    if (email !== undefined && email !== "") {
      if (!EMAIL_REGEX.test(email)) {
        res.status(400).json({
          success: false,
          message: "A valid email address is required",
        });
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        res
          .status(400)
          .json({ success: false, message: "Email already registered" });
        return;
      }

      updateFields.email = normalizedEmail;
    }

    if (role !== undefined) {
      updateFields.role = role === "admin" ? "admin" : "user";
    }

    if (status !== undefined) {
      updateFields.status = status === "inactive" ? "inactive" : "active";
    }

    if (password !== undefined && password !== "") {
      if (password.length < 8) {
        res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters",
        });
        return;
      }
      updateFields.password = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    }

    Object.assign(user, updateFields);
    await user.save();

    const response: AdminUserResponse = {
      success: true,
      user: toUserResponse(user),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("updateUser error:", error);
    const errorResponse: ApiErrorResponse = {
      success: false,
      message: "An unexpected error occurred while updating user",
    };
    res.status(500).json(errorResponse);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response<any>
): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("deleteUser error:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred while deleting user",
    });
  }
};
