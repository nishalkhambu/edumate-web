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

  if (!response.ok) {
    const error = data as ApiErrorResponse;
    throw new Error(error.message || "Request failed");
  }

  return data as T;
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
