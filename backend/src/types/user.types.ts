import { Document, Types } from "mongoose";

export type UserRole = "user" | "admin";
export type UserStatus = "active" | "inactive";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
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

export interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export interface LoginSuccessResponse {
  success: true;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
  };
}

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

export interface AdminUserListResponse {
  success: true;
  data: UserResponse[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminUserResponse {
  success: true;
  user: UserResponse;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
  password?: string;
}

export interface AdminForbiddenResponse {
  success: false;
  message: string;
}
