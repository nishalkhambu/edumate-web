"use client";

import Cookies from "js-cookie";
import {
  registerApi,
  loginApi,
  whoamiApi,
  updateProfileApi,
  forgotPasswordApi,
  resetPasswordApi,
  refreshTokenApi,
} from "@/src/api/auth.api";
import {
  AuthActionResult,
  AuthUser,
  LoginPayload,
  RegisterPayload,
  UpdateSuccessResponse,
} from "@/src/types/auth.types";

export const SESSION_COOKIE_NAME = "edumate_session";
const SESSION_MAX_AGE_DAYS = 7;

const getCookieSecureFlag = () =>
  typeof window !== "undefined" && window.location.protocol === "https:";

export function setSessionToken(token: string): void {
  Cookies.set(SESSION_COOKIE_NAME, token, {
    expires: SESSION_MAX_AGE_DAYS,
    secure: getCookieSecureFlag(),
    sameSite: "lax",
    path: "/",
  });
}

export function clearSessionToken(): void {
  Cookies.remove(SESSION_COOKIE_NAME, { path: "/" });
}

export function getSessionToken(): string | undefined {
  return Cookies.get(SESSION_COOKIE_NAME);
}

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
        role: response.user.role,
        status: response.user.status,
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

export async function loginAction(
  payload: LoginPayload
): Promise<AuthActionResult<AuthUser>> {
  try {
    const response = await loginApi(payload);

    setSessionToken(response.token);

    return {
      success: true,
      data: {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        status: response.user.status,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Login failed",
    };
  }
}

export async function whoamiAction(): Promise<AuthActionResult<AuthUser>> {
  try {
    const response = await whoamiApi();

    return {
      success: true,
      data: {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        status: response.user.status,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch user",
    };
  }
}

export async function updateProfileAction(
  formData: FormData
): Promise<AuthActionResult<AuthUser>> {
  try {
    const response = await updateProfileApi(formData);

    return {
      success: true,
      data: {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        status: response.user.status,
      },
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Profile update failed",
    };
  }
}

export async function changePasswordAction(
  currentPassword: string,
  newPassword: string
): Promise<AuthActionResult<null>> {
  try {
    const formData = new FormData();
    formData.append("currentPassword", currentPassword);
    formData.append("newPassword", newPassword);

    await updateProfileApi(formData);

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Password change failed",
    };
  }
}

export async function forgotPasswordAction(
  email: string
): Promise<AuthActionResult<null>> {
  try {
    await forgotPasswordApi({ email });
    return { success: true, data: null };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to request password reset",
    };
  }
}

export async function resetPasswordAction(
  token: string,
  password: string
): Promise<AuthActionResult<null>> {
  try {
    await resetPasswordApi(token, password);
    return { success: true, data: null };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to reset password",
    };
  }
}

export async function refreshTokenAction(): Promise<AuthActionResult<{ token: string; refreshToken: string }>> {
  try {
    const data = await refreshTokenApi();
    setSessionToken(data.token);
    return { success: true, data: { token: data.token, refreshToken: data.refreshToken } };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to refresh token",
    };
  }
}
