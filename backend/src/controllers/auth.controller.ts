import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
} from "../types/user.types";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const BCRYPT_SALT_ROUNDS = 10;
const JWT_EXPIRY = "7d";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const uploadDir = path.join(process.cwd(), "uploads", "avatars");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed."));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const toUserResponse = (user: {
  _id: { toString(): string };
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}): UserResponse => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const unauthorizedResponse = (res: Response): void => {
  const errorResponse: ApiErrorResponse = {
    success: false,
    message: "Unauthorized - Invalid or missing token",
  };
  res.status(401).json(errorResponse);
};

const validateRegisterInput = (
  body: Partial<RegisterUserDTO>
): string | null => {
  const { name, email, password } = body;

  if (!name?.trim()) {
    return "Name is required";
  }

  if (!email?.trim() || !EMAIL_REGEX.test(email)) {
    return "A valid email address is required";
  }

  if (!password || !PASSWORD_REGEX.test(password)) {
    return "Password must be at least 8 characters and contain at least one letter and one number";
  }

  return null;
};

const validateLoginInput = (body: Partial<LoginUserDTO>): string | null => {
  const { email, password } = body;

  if (!email?.trim() || !EMAIL_REGEX.test(email)) {
    return "A valid email address is required";
  }

  if (!password) {
    return "Password is required";
  }

  return null;
};

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validationError = validateRegisterInput(req.body);

    if (validationError) {
      res.status(400).json({ success: false, message: validationError });
      return;
    }

    const { name, email, password } = req.body as RegisterUserDTO;
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
    });

    const response: RegisterSuccessResponse = {
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role || "user",
        status: user.status || "active",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("registerUser error:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred during registration",
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const validationError = validateLoginInput(req.body);

    if (validationError) {
      res.status(400).json({ success: false, message: validationError });
      return;
    }

    const { email, password } = req.body as LoginUserDTO;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password"
    );

    if (!user) {
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
      return;
    }

    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    });

    const response: LoginSuccessResponse = {
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role || "user",
        status: user.status || "active",
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("loginUser error:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred during login",
    });
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
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("whoamiUser error:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred while fetching user details",
    });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as { user?: { _id: string } };
    const updateData = req.body as UpdateUserProfileDTO;

    if (!authReq.user) {
      unauthorizedResponse(res);
      return;
    }

    const user = await User.findById(authReq.user._id);

    if (!user) {
      unauthorizedResponse(res);
      return;
    }

    const updateFields: Record<string, unknown> = {};

    if (updateData.name !== undefined && updateData.name !== "") {
      updateFields.name = updateData.name;
    }

    if (updateData.email !== undefined && updateData.email !== "") {
      updateFields.email = updateData.email;
    }

    // multer writes the uploaded file to req.file (not req.body.avatar)
    const file = (req as Request & { file?: Express.Multer.File }).file;
    if (file) {
      updateFields.avatar = file.filename;
    }


    if (updateData.newPassword && updateData.currentPassword) {
      const isCurrentValid = await bcrypt.compare(
        updateData.currentPassword,
        user.password
      );

      if (!isCurrentValid) {
        res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
        return;
      }

      updateFields.password = await bcrypt.hash(
        updateData.newPassword,
        BCRYPT_SALT_ROUNDS
      );
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
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("updateUser error:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred while updating profile",
    });
  }
};
