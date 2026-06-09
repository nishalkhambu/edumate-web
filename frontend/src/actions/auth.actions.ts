"use client";

import Cookies from "js-cookie";
import { loginApi, registerApi } from "@/src/api/auth.api";
import {
  AuthActionResult,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "@/src/types/auth.types";

export const SESSION_COOKIE_NAME = "edumate_session";
const SESSION_MAX_AGE_DAYS = 7;

/**
 * Persists the JWT session token in a secure client-side cookie.
 */
export function setSessionToken(token: string): void {
  Cookies.set(SESSION_COOKIE_NAME, token, {
    expires: SESSION_MAX_AGE_DAYS,
    secure: true,
    sameSite: "strict",
    path: "/",
  });
}

/**
 * Removes the session cookie on logout.
 */
export function clearSessionToken(): void {
  Cookies.remove(SESSION_COOKIE_NAME, { path: "/" });
}

/**
 * Reads the current session token from cookies.
 */
export function getSessionToken(): string | undefined {
  return Cookies.get(SESSION_COOKIE_NAME);
}

/**
 * Registers a new user and returns the created user profile on success.
 */
export async function registerAction(
  payload: RegisterPayload
): Promise<AuthActionResult<AuthUser>> {
  try {
    const response = await registerApi(payload);

    return {
      success: true,
      data: {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
      },
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Registration failed",
    };
  }
}

/**
 * Logs a user in, stores the JWT in a cookie, and redirects to the dashboard.
 */
export async function loginAction(
  payload: LoginPayload
): Promise<AuthActionResult<AuthUser>> {
  try {
    const response = await loginApi(payload);

    setSessionToken(response.token);

    return {
      success: true,
      data: response.user,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Login failed",
    };
  }
}
