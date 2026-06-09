/**
 * Shared authentication types used across API and action layers.
 */

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
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

export type AuthActionResult<T> =
  | { success: true; data: T }
  | { success: false; message: string };
