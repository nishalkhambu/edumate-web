import {
  listUsersApi,
  getUserApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
} from "@/src/api/admin.api";
import {
  AdminUser,
  AdminUserListResponse,
  AdminUserResponse,
  CreateUserDTO,
  UpdateUserDTO,
} from "@/src/types/admin.types";
import { AuthActionResult } from "@/src/types/auth.types";

export async function listUsersAction(params: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<AuthActionResult<AdminUserListResponse>> {
  try {
    const response = await listUsersApi(params);
    return { success: true, data: response };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to load users",
    };
  }
}

export async function getUserAction(
  id: string
): Promise<AuthActionResult<AdminUserResponse>> {
  try {
    const response = await getUserApi(id);
    return { success: true, data: response };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to load user",
    };
  }
}

export async function createUserAction(
  payload: CreateUserDTO
): Promise<AuthActionResult<AdminUserResponse>> {
  try {
    const response = await createUserApi(payload);
    return { success: true, data: response };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create user",
    };
  }
}

export async function updateUserAction(
  id: string,
  payload: UpdateUserDTO
): Promise<AuthActionResult<AdminUserResponse>> {
  try {
    const response = await updateUserApi(id, payload);
    return { success: true, data: response };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update user",
    };
  }
}

export async function deleteUserAction(
  id: string
): Promise<AuthActionResult<null>> {
  try {
    await deleteUserApi(id);
    return { success: true, data: null };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete user",
    };
  }
}
