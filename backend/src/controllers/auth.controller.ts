import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Request, Response } from "express";
import { User } from "../models/user.model";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  LoginUserDTO,
  RegisterUserDTO,
  UpdateUserProfileDTO,
  UserResponse,
  ApiErrorResponse,
  LoginSuccessResponse,
  RegisterSuccessResponse,
  WhoamiSuccessResponse,
  UpdateSuccessResponse,
  UserRole,
  UserStatus,
  AuthUser,
} from "../types/user.types";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const BCRYPT_SALT_ROUNDS = 10;
const JWT_EXPIRY = "7d";
const JWT_REFRESH_EXPIRY = "30d";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error("JWT_SECRET and JWT_REFRESH_SECRET are required in environment variables");
}

const uploadDir = path.join(process.cwd(), "uploads", "avatars");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  cb(null, allowed.includes(file.mimetype));
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

const toUserResponse = (user: {
  _id: { toString(): string };
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  avatar?: string;
}): UserResponse => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role || "user",
  status: user.status || "active",
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
  avatar: user.avatar,
});

const unauthorizedResponse = (res: Response): void => {
  res.status(401).json({ success: false, message: "Unauthorized - Invalid or missing token" } as ApiErrorResponse);
};

const validateRegisterInput = (body: Partial<RegisterUserDTO>): string | null => {
  const { name, email, password } = body;
  if (!name?.trim()) return "Name is required";
  if (!email?.trim() || !EMAIL_REGEX.test(email)) return "A valid email address is required";
  if (!password || !PASSWORD_REGEX.test(password)) return "Password must be at least 8 characters and contain at least one letter and one number";
  return null;
};

const validateLoginInput = (body: Partial<LoginUserDTO>): string | null => {
  const { email, password } = body;
  if (!email?.trim() || !EMAIL_REGEX.test(email)) return "A valid email address is required";
  if (!password) return "Password is required";
  return null;
};

const generateTokenPair = (userId: string) => {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRY });
  return { accessToken, refreshToken };
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const validationError = validateRegisterInput(req.body);
    if (validationError) {
      res.status(400).json({ success: false, message: validationError } as ApiErrorResponse);
      return;
    }

    const { name, email, password } = req.body as RegisterUserDTO;
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      res.status(400).json({ success: false, message: "Email already registered" } as ApiErrorResponse);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: hashedPassword });

    const response: RegisterSuccessResponse = {
      success: true,
      user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role, status: user.status, createdAt: user.createdAt.toISOString(), updatedAt: user.updatedAt.toISOString() },
    };
    res.status(201).json(response);
  } catch (error) {
    console.error("registerUser error:", error);
    res.status(500).json({ success: false, message: "An unexpected error occurred during registration" } as ApiErrorResponse);
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const validationError = validateLoginInput(req.body);
    if (validationError) {
      res.status(400).json({ success: false, message: validationError } as ApiErrorResponse);
      return;
    }

    const { email, password } = req.body as LoginUserDTO;
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user) {
      res.status(401).json({ success: false, message: "Invalid email or password" } as ApiErrorResponse);
      return;
    }

    if (!user.password) {
      res.status(401).json({ success: false, message: "Invalid email or password" } as ApiErrorResponse);
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ success: false, message: "Invalid email or password" } as ApiErrorResponse);
      return;
    }

    const { accessToken, refreshToken } = generateTokenPair(user._id.toString());
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("edumate_refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    const response: LoginSuccessResponse = {
      success: true,
      token: accessToken,
      refreshToken,
      user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role, status: user.status, avatar: user.avatar },
    };
    res.status(200).json(response);
  } catch (error) {
    console.error("loginUser error:", error);
    res.status(500).json({ success: false, message: "An unexpected error occurred during login" } as ApiErrorResponse);
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies?.edumate_refresh_token;
    if (!token) {
      res.status(401).json({ success: false, message: "Missing refresh token" } as ApiErrorResponse);
      return;
    }

    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
      res.status(401).json({ success: false, message: "Invalid refresh token" } as ApiErrorResponse);
      return;
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(user._id.toString());
    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("edumate_refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({ success: true, token: accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error("refreshToken error:", error);
    res.status(401).json({ success: false, message: "Invalid or expired refresh token" } as ApiErrorResponse);
  }
};

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies?.edumate_refresh_token;
    if (token) {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
      await User.findByIdAndUpdate(decoded.userId, { $unset: { refreshToken: 1 } });
    }
    res.clearCookie("edumate_refresh_token", { path: "/" });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch {
    res.clearCookie("edumate_refresh_token", { path: "/" });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body as { email?: string };
    if (!email?.trim() || !EMAIL_REGEX.test(email)) {
      res.status(400).json({ success: false, message: "A valid email address is required" } as ApiErrorResponse);
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select("+resetPasswordToken +resetPasswordExpires");

    // Security: always respond success, but only send token if user exists.
    if (!user) {
      res.status(200).json({ success: true, message: "If an account exists, a reset link has been sent." });
      return;
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    // TODO: send email with /api/v1/auth/reset-password/{token}
    console.log("Reset token for", normalizedEmail, ":", rawToken);

    res.status(200).json({ success: true, message: "If an account exists, a reset link has been sent.", devToken: rawToken });
  } catch (error) {
    console.error("forgotPassword error:", error);
    res.status(500).json({ success: false, message: "An unexpected error occurred" } as ApiErrorResponse);
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const resetToken = String(req.params.token || "");
    const { password } = req.body as { password?: string };

    if (!resetToken || !password || !PASSWORD_REGEX.test(password)) {
      res.status(400).json({ success: false, message: "Invalid token or weak password" } as ApiErrorResponse);
      return;
    }

    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: new Date() } }).select("+password");

    if (!user) {
      res.status(400).json({ success: false, message: "Invalid or expired reset token" } as ApiErrorResponse);
      return;
    }

    user.password = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("resetPassword error:", error);
    res.status(500).json({ success: false, message: "An unexpected error occurred" } as ApiErrorResponse);
  }
};

export const whoamiUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) {
      unauthorizedResponse(res);
      return;
    }
    const user = await User.findById(authReq.user._id);
    if (!user) {
      unauthorizedResponse(res);
      return;
    }

    const response: WhoamiSuccessResponse = {
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role || "user",
        status: user.status || "active",
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    };
    res.status(200).json(response);
  } catch (error) {
    console.error("whoamiUser error:", error);
    res.status(500).json({ success: false, message: "An unexpected error occurred while fetching user details" } as ApiErrorResponse);
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    if (!authReq.user) {
      unauthorizedResponse(res);
      return;
    }

    const user = await User.findById(authReq.user._id);
    if (!user) {
      unauthorizedResponse(res);
      return;
    }

    const body = req.body as Record<string, unknown>;
    const updateFields: Record<string, unknown> = {};

    if (body.name !== undefined && body.name !== "") updateFields.name = String(body.name);
    if (body.email !== undefined && body.email !== "") {
      const normalized = String(body.email).trim().toLowerCase();
      if (!EMAIL_REGEX.test(normalized)) {
        res.status(400).json({ success: false, message: "Invalid email address" } as ApiErrorResponse);
        return;
      }
      const exists = await User.findOne({ email: normalized, _id: { $ne: user._id } });
      if (exists) {
        res.status(400).json({ success: false, message: "Email already in use" } as ApiErrorResponse);
        return;
      }
      updateFields.email = normalized;
    }

    const file = (req as Request & { file?: Express.Multer.File }).file;
    if (file) {
      updateFields.avatar = file.filename;
    }

    if (body.currentPassword && body.newPassword) {
      const isCurrentValid = await bcrypt.compare(String(body.currentPassword), user.password as string);
      if (!isCurrentValid) {
        res.status(401).json({ success: false, message: "Current password is incorrect" } as ApiErrorResponse);
        return;
      }
      if (!PASSWORD_REGEX.test(String(body.newPassword))) {
        res.status(400).json({ success: false, message: "New password must be at least 8 characters with a letter and number" } as ApiErrorResponse);
        return;
      }
      updateFields.password = await bcrypt.hash(String(body.newPassword), BCRYPT_SALT_ROUNDS);
    }

    Object.assign(user, updateFields);
    await user.save();

    const response: UpdateSuccessResponse = {
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role || "user",
        status: user.status || "active",
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    };
    res.status(200).json(response);
  } catch (error) {
    console.error("updateUser error:", error);
    res.status(500).json({ success: false, message: "An unexpected error occurred while updating profile" } as ApiErrorResponse);
  }
};
