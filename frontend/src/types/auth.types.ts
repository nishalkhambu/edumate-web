export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export type UserRole = "user" | "admin";
export type UserStatus = "active" | "inactive";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export interface RegisterSuccessResponse {
  success: true;
  user: AuthUser & {
    createdAt: string;
    updatedAt: string;
  };
}

export interface LoginSuccessResponse {
  success: true;
  token: string;
  user: AuthUser;
}

export interface WhoamiSuccessResponse {
  success: true;
  user: AuthUser & {
    createdAt: string;
    updatedAt: string;
  };
}

export interface UpdateSuccessResponse {
  success: true;
  user: AuthUser & {
    createdAt: string;
    updatedAt: string;
  };
}

export type AuthActionResult<T> =
  | { success: true; data: T }
  | { success: false; message: string };
