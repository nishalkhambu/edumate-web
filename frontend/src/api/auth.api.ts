import {
  ApiErrorResponse,
  LoginPayload,
  LoginSuccessResponse,
  RegisterPayload,
  RegisterSuccessResponse,
} from "@/src/types/auth.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

const JSON_HEADERS = {
  "Content-Type": "application/json",
} as const;

/**
 * Parses a fetch response into typed data or throws a descriptive error.
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    const error = data as ApiErrorResponse;
    throw new Error(error.message || "Request failed");
  }

  return data as T;
}

/**
 * Registers a new user account via POST /api/auth/register.
 */
export async function registerApi(
  payload: RegisterPayload
): Promise<RegisterSuccessResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });

  return handleResponse<RegisterSuccessResponse>(response);
}

/**
 * Authenticates a user via POST /api/auth/login.
 */
export async function loginApi(
  payload: LoginPayload
): Promise<LoginSuccessResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });

  return handleResponse<LoginSuccessResponse>(response);
}
