"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import {
  listUsersAction,
  createUserAction,
  updateUserAction,
  deleteUserAction,
} from "@/src/actions/admin.actions";
import {
  CreateUserFormValues,
  CreateUserSchema,
  EditUserFormValues,
  EditUserSchema,
} from "@/src/schemas/admin.schemas";
import { AdminUser } from "@/src/types/admin.types";
import {
  clearSessionToken,
} from "@/src/actions/auth.actions";
import Link from "next/link";

function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/login");
      } else if (user.role !== "admin") {
        router.replace("/dashboard");
      }
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}

function AccessDenied() {
  const router = useRouter();
  return (
    <main className="dashboard-container">
      <header className="dashboard-header">
        <h1>Admin Panel</h1>
        <div className="header-actions">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="admin-cancel-btn"
          >
            Back to Dashboard
          </button>
        </div>
      </header>
      <section className="dashboard-content">
        <div className="admin-panel-card">
          <h2>Access Denied</h2>
          <p>You do not have admin privileges.</p>
        </div>
      </section>
    </main>
  );
}

function UserForm({
  editingUser,
  onSubmit,
  isSubmitting,
  message,
}: {
  editingUser: AdminUser | null;
  onSubmit: (values: CreateUserFormValues | EditUserFormValues) => Promise<void>;
  isSubmitting: boolean;
  message: { type: "success" | "error"; text: string } | null;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormValues | EditUserFormValues>({
    resolver: zodResolver(editingUser ? EditUserSchema : CreateUserSchema),
    defaultValues: {
      name: editingUser?.name || "",
      email: editingUser?.email || "",
      password: "",
      role: editingUser?.role || "user",
      status: editingUser?.status || "active",
    },
  });

  const handleClose = () => {
    reset();
  };

  return (
    <>
      <h2>{editingUser ? "Edit User" : "Create User"}</h2>
      {message && (
        <div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="input-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter full name"
            {...register("name")}
            suppressHydrationWarning
          />
          {errors.name && <p className="field-error">{errors.name.message}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter email"
            {...register("email")}
            suppressHydrationWarning
          />
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>

        {!editingUser && (
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              {...register("password")}
              suppressHydrationWarning
            />
            {errors.password && <p className="field-error">{errors.password.message}</p>}
          </div>
        )}

        {editingUser && (
          <div className="input-group">
            <label htmlFor="password">New Password (optional)</label>
            <input
              id="password"
              type="password"
              placeholder="Leave blank to keep current"
              {...register("password")}
              suppressHydrationWarning
            />
            {errors.password && <p className="field-error">{errors.password.message}</p>}
          </div>
        )}

        <div className="input-group">
          <label htmlFor="role">Role</label>
          <select id="role" {...register("role")} suppressHydrationWarning>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="status">Status</label>
          <select id="status" {...register("status")} suppressHydrationWarning>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="admin-modal-actions">
          <button type="button" onClick={handleClose} className="admin-cancel-btn">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="admin-submit-btn">
            {isSubmitting ? "Saving..." : editingUser ? "Update User" : "Create User"}
          </button>
        </div>
      </form>
    </>
  );
}

export default function AdminUsersPage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user || user.role !== "admin") {
    return <AccessDenied />;
  }

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [serverMessage, setServerMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchUsers = async (page: number, searchTerm: string) => {
    setIsLoading(true);
    setError(null);
    const result = await listUsersAction({ page, limit: 10, search: searchTerm });
    if (result.success && "data" in result) {
      setUsers(result.data.data);
      setMeta(result.data.meta);
    } else {
      setError(result.message || "Failed to load users");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchUsers(1, search);
    }
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(1, search);
  };

  const handlePageChange = (newPage: number) => {
    fetchUsers(newPage, search);
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setServerMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (adminUser: AdminUser) => {
    setEditingUser(adminUser);
    setServerMessage(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setServerMessage(null);
  };

  const onSubmit = async (values: CreateUserFormValues | EditUserFormValues) => {
    setIsSubmitting(true);
    setServerMessage(null);

    let result;
    if (editingUser) {
      const { password, ...rest } = values as EditUserFormValues;
      const payload: {
        name?: string;
        email?: string;
        role?: "user" | "admin";
        status?: "active" | "inactive";
        password?: string;
      } = {
        ...rest,
        ...(password ? { password } : {}),
      };
      result = await updateUserAction(editingUser.id, payload);
    } else {
      result = await createUserAction(values as CreateUserFormValues);
    }

    if (result.success) {
      setServerMessage({ type: "success", text: editingUser ? "User updated successfully" : "User created successfully" });
      closeModal();
      fetchUsers(meta.page, search);
    } else {
      setServerMessage({ type: "error", text: result.message });
    }

    setIsSubmitting(false);
  };

  const handleDeleteClick = (adminUser: AdminUser) => {
    setDeleteTarget(adminUser);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const result = await deleteUserAction(deleteTarget.id);
    if (result.success) {
      setServerMessage({ type: "success", text: "User deleted successfully" });
      fetchUsers(meta.page, search);
    } else {
      setServerMessage({ type: "error", text: result.message });
    }
    setDeleteTarget(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <AdminProtectedRoute>
      <main className="dashboard-container">
        <header className="dashboard-header">
          <h1>Admin Panel</h1>
          <div className="header-actions">
            <Link href="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <Link href="/dashboard/admin/users" className="nav-link active">
              Users
            </Link>
            <Link href="/dashboard/profile" className="nav-link">
              Profile
            </Link>
            <Link href="/dashboard/password" className="nav-link">
              Password
            </Link>
            <button
              type="button"
              onClick={() => {
                clearSessionToken();
                router.push("/login");
              }}
              className="logout-btn"
            >
              Logout
            </button>
          </div>
        </header>

        <section className="dashboard-content">
          <div className="admin-panel-card">
            {serverMessage && !isModalOpen && (
              <div className={`alert ${serverMessage.type === "success" ? "alert-success" : "alert-error"}`}>
                {serverMessage.text}
              </div>
            )}

            <div className="admin-toolbar">
              <form onSubmit={handleSearch} className="admin-search-form">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="admin-search-input"
                />
                <button type="submit" className="admin-search-btn">
                  Search
                </button>
              </form>
              <button type="button" onClick={openCreateModal} className="admin-create-btn">
                + Create User
              </button>
            </div>

            {isLoading ? (
              <div className="dashboard-loading">
                <p>Loading users...</p>
              </div>
            ) : error ? (
              <div className="alert alert-error">{error}</div>
            ) : users.length === 0 ? (
              <div className="admin-empty-state">
                <p>No users found.</p>
                {search && (
                  <button type="button" onClick={() => { setSearch(""); fetchUsers(1, ""); }} className="admin-clear-search-btn">
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td className="admin-id-cell">{u.id}</td>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`admin-badge admin-badge-${u.role}`}>
                              {u.role}
                            </span>
                          </td>
                          <td>
                            <span className={`admin-badge admin-badge-${u.status}`}>
                              {u.status}
                            </span>
                          </td>
                          <td>{formatDate(u.createdAt)}</td>
                          <td className="admin-actions-cell">
                            <button
                              type="button"
                              onClick={() => openEditModal(u)}
                              className="admin-edit-btn"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteClick(u)}
                              className="admin-delete-btn"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="admin-pagination">
                  <button
                    type="button"
                    disabled={meta.page <= 1}
                    onClick={() => handlePageChange(meta.page - 1)}
                    className="admin-page-btn"
                  >
                    Previous
                  </button>
                  <span className="admin-page-info">
                    Page {meta.page} of {meta.totalPages} (Total: {meta.total})
                  </span>
                  <button
                    type="button"
                    disabled={meta.page >= meta.totalPages}
                    onClick={() => handlePageChange(meta.page + 1)}
                    className="admin-page-btn"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        {isModalOpen && (
          <div className="admin-modal-overlay" onClick={closeModal}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <UserForm
                key={editingUser ? `edit-${editingUser.id}` : "create"}
                editingUser={editingUser}
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
                message={serverMessage}
              />
            </div>
          </div>
        )}

        {deleteTarget && (
          <div className="admin-modal-overlay" onClick={() => setDeleteTarget(null)}>
            <div className="admin-modal admin-confirm-modal" onClick={(e) => e.stopPropagation()}>
              <h2>Delete User</h2>
              <p>Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.</p>
              <div className="admin-modal-actions">
                <button type="button" onClick={() => setDeleteTarget(null)} className="admin-cancel-btn">
                  Cancel
                </button>
                <button type="button" onClick={confirmDelete} className="admin-delete-btn-full">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AdminProtectedRoute>
  );
}
