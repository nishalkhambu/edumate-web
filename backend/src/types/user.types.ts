import { Document, Types } from "mongoose";

/**
 * Core User document shape stored in MongoDB.
 */
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Public user representation returned to clients (password excluded).
 */
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserProfileDTO {
  name?: string;
  email?: string;
  avatar?: string;
  currentPassword?: string;
  newPassword?: string;
}

/**
 * Payload accepted by the registration endpoint.
 */
export interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
}

/**
 * Payload accepted by the login endpoint.
 */
export interface LoginUserDTO {
  email: string;
  password: string;
}

/**
 * Standardized API error response shape.
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
}

/**
 * Successful login response including JWT and sanitized user details.
 */
export interface LoginSuccessResponse {
  success: true;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

/**
 * Successful registration response with created user details.
 */
export interface RegisterSuccessResponse {
  success: true;
  user: UserResponse;
}

export interface WhoamiSuccessResponse {
  success: true;
  user: UserResponse;
}

export interface UpdateSuccessResponse {
  success: true;
  user: UserResponse;
}
