import {
  AdminUserListResponse,
  AdminUserResponse,
  CreateUserDTO,
  UpdateUserDTO,
} from "@/src/types/admin.types";
import { ApiErrorResponse } from "@/src/types/auth.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

const getToken = (): string | undefined => {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((c) => c.startsWith("edumate_session="))
    ?.split("=")[1];
};

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    const error = data as ApiErrorResponse;
    throw new Error(error.message || "Request failed");
  }

  return data as T;
}

export async function listUsersApi(params: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<AdminUserListResponse> {
  const token = getToken();
  if (!token) throw new Error("No session token found");

  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);

  const response = await fetch(`${API_BASE_URL}/admin/users?${query.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<AdminUserListResponse>(response);
}

export async function getUserApi(id: string): Promise<AdminUserResponse> {
  const token = getToken();
  if (!token) throw new Error("No session token found");

  const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<AdminUserResponse>(response);
}

export async function createUserApi(
  payload: CreateUserDTO
): Promise<AdminUserResponse> {
  const token = getToken();
  if (!token) throw new Error("No session token found");

  const response = await fetch(`${API_BASE_URL}/admin/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<AdminUserResponse>(response);
}

export async function updateUserApi(
  id: string,
  payload: UpdateUserDTO
): Promise<AdminUserResponse> {
  const token = getToken();
  if (!token) throw new Error("No session token found");

  const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<AdminUserResponse>(response);
}

export async function deleteUserApi(id: string): Promise<{ success: true; message: string }> {
  const token = getToken();
  if (!token) throw new Error("No session token found");

  const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<{ success: true; message: string }>(response);
}
