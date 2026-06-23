"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/src/contexts/AuthContext";
import { changePasswordAction, clearSessionToken } from "@/src/actions/auth.actions";
import {
  ChangePasswordFormValues,
  ChangePasswordSchema,
} from "@/src/schemas/auth.schemas";
import Link from "next/link";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

export default function PasswordPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(ChangePasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    setServerError(null);
    setSuccessMessage(null);

    const result = await changePasswordAction(
      values.currentPassword,
      values.newPassword
    );

    if (!result.success) {
      setServerError(result.message);
      return;
    }

    setSuccessMessage("Password changed successfully!");
    reset();
  };

  return (
    <ProtectedRoute>
      <main className="dashboard-container">
        <header className="dashboard-header">
          <h1>EduMate Dashboard</h1>
          <div className="header-actions">
            <Link href="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <Link href="/dashboard/profile" className="nav-link">
              Profile
            </Link>
            <Link href="/dashboard/password" className="nav-link active">
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
          <div className="dashboard-card">
            <h2>Change Password</h2>

            {serverError && (
              <div className="alert alert-error" role="alert">
                {serverError}
              </div>
            )}

            {successMessage && (
              <div className="alert alert-success" role="status">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="input-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter your current password"
                  aria-invalid={errors.currentPassword ? "true" : "false"}
                  {...register("currentPassword")}
                  suppressHydrationWarning
                />
                {errors.currentPassword && (
                  <p className="field-error">{errors.currentPassword.message}</p>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  aria-invalid={errors.newPassword ? "true" : "false"}
                  {...register("newPassword")}
                  suppressHydrationWarning
                />
                {errors.newPassword && (
                  <p className="field-error">{errors.newPassword.message}</p>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="confirmNewPassword">Confirm New Password</label>
                <input
                  id="confirmNewPassword"
                  type="password"
                  placeholder="Confirm new password"
                  aria-invalid={
                    errors.confirmNewPassword ? "true" : "false"
                  }
                  {...register("confirmNewPassword")}
                  suppressHydrationWarning
                />
                {errors.confirmNewPassword && (
                  <p className="field-error">
                    {errors.confirmNewPassword.message}
                  </p>
                )}
              </div>

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Changing Password..." : "Change Password"}
              </button>
            </form>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}
