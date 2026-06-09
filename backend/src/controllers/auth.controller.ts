import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { User } from "../models/user.model";
import {
  LoginUserDTO,
  RegisterUserDTO,
  UserResponse,
} from "../types/user.types";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const BCRYPT_SALT_ROUNDS = 10;
const JWT_EXPIRY = "7d";

/**
 * Maps a Mongoose user document to a safe client-facing response object.
 */
const toUserResponse = (user: {
  _id: { toString(): string };
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}): UserResponse => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

/**
 * Validates registration payload fields before persistence.
 */
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

/**
 * Validates login payload fields.
 */
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

/**
 * POST /api/auth/register
 * Creates a new user account with a securely hashed password.
 */
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

    res.status(201).json({
      success: true,
      user: toUserResponse(user),
    });
  } catch (error) {
    console.error("registerUser error:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred during registration",
    });
  }
};

/**
 * POST /api/auth/login
 * Authenticates a user and returns a signed JWT alongside user details.
 */
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

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign({ userId: user._id.toString() }, jwtSecret, {
      expiresIn: JWT_EXPIRY,
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("loginUser error:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred during login",
    });
  }
};
