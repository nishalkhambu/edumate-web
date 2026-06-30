export type UserRole = "user" | "admin";
export type UserStatus = "active" | "inactive";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserListResponse {
  success: true;
  data: AdminUser[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminUserResponse {
  success: true;
  user: AdminUser;
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
