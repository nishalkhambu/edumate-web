import {
  ApiErrorResponse,
  LoginPayload,
  LoginSuccessResponse,
  RegisterPayload,
  RegisterSuccessResponse,
  WhoamiSuccessResponse,
  UpdateSuccessResponse,
} from "@/src/types/auth.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

const JSON_HEADERS = {
  "Content-Type": "application/json",
} as const;

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.status) {
    const error = data as ApiErrorResponse;
    throw new Error(error.message || "Request failed");
  }

  return data as T;
}

let isRefreshing = false;
let refreshPromise: Promise<{ success: true; token: string; refreshToken: string }> | null = null;

export async function authFetch(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
  const token = getSessionToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");

  let response = await fetch(input, { ...init, headers, credentials: "include" });

  if (response.status === 401 && token && !(input as string | Request).toString().includes("/auth/refresh")) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshTokenApi().finally(() => { isRefreshing = false; });
    }
    try {
      const refreshed = await refreshPromise!;
      setSessionToken(refreshed.token);
      const retryHeaders = new Headers(headers);
      retryHeaders.set("Authorization", `Bearer ${refreshed.token}`);
      response = await fetch(input, { ...init, headers: retryHeaders, credentials: "include" });
    } catch {
      clearSessionToken();
      if (typeof window !== "undefined") window.location.href = "/login";
      return response;
    }
  }

  return response;
}

export function getSessionToken(): string | undefined {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((c) => c.startsWith("edumate_session="))
    ?.split("=")[1];
}

function setSessionToken(token: string): void {
  const maxAge = 7 * 24 * 60 * 60;
  document.cookie = `edumate_session=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function clearSessionToken(): void {
  document.cookie = "edumate_session=; path=/; max-age=0; SameSite=Lax";
}

export async function registerApi(
  payload: RegisterPayload
): Promise<RegisterSuccessResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });

  return handleResponse<RegisterSuccessResponse>(response);
}

export async function loginApi(
  payload: LoginPayload
): Promise<LoginSuccessResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });

  return handleResponse<LoginSuccessResponse>(response);
}

export async function whoamiApi(): Promise<WhoamiSuccessResponse> {
  const token = document.cookie
    .split("; ")
    .find((c) => c.startsWith("edumate_session="))
    ?.split("=")[1];

  if (!token) {
    throw new Error("No session token found");
  }

  const response = await fetch(`${API_BASE_URL}/auth/whoami`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<WhoamiSuccessResponse>(response);
}

export async function updateProfileApi(
  formData: FormData
): Promise<UpdateSuccessResponse> {
  const token = document.cookie
    .split("; ")
    .find((c) => c.startsWith("edumate_session="))
    ?.split("=")[1];

  if (!token) {
    throw new Error("No session token found");
  }

  const response = await fetch(`/api/v1/auth/update`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return handleResponse<UpdateSuccessResponse>(response);
}

export async function forgotPasswordApi(payload: { email: string }): Promise<{ success: true; message: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });

  return handleResponse<{ success: true; message: string }>(response);
}

export async function resetPasswordApi(token: string, password: string): Promise<{ success: true; message: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password/${token}`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ password }),
  });

  return handleResponse<{ success: true; message: string }>(response);
}

export async function refreshTokenApi(): Promise<{ success: true; token: string; refreshToken: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  return handleResponse<{ success: true; token: string; refreshToken: string }>(response);
}
