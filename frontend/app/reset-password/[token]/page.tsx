"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordAction } from "@/src/actions/auth.actions";
import { ResetPasswordSchema, type ResetPasswordFormValues } from "@/src/schemas/auth.schemas";

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setServerError(null);
    setSuccessMessage(null);

    const result = await resetPasswordAction(params.token, values.password);

    if (!result.success) {
      setServerError(result.message);
      return;
    }

    setSuccessMessage("Password reset successful! Redirecting to login...");
    setTimeout(() => router.push("/login"), 2000);
  };

  return (
    <div className="login-container">
      <div className="auth-card">
        <div className="left-section">
          <div className="overlay">
            <h1>EduMate</h1>
            <p>Set your new password below.</p>
          </div>
        </div>

        <div className="right-section">
          <div className="form-box">
            <h2>Reset Password</h2>
            <p className="subtitle">Enter your new password.</p>

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
                <label htmlFor="password">New Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  aria-invalid={errors.password ? "true" : "false"}
                  {...register("password")}
                  suppressHydrationWarning
                />
                {errors.password && (
                  <p className="field-error">{errors.password.message}</p>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                  {...register("confirmPassword")}
                  suppressHydrationWarning
                />
                {errors.confirmPassword && (
                  <p className="field-error">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button type="submit" disabled={isSubmitting} suppressHydrationWarning>
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </button>
            </form>

            <div className="bottom-text">
              <p>
                Remember your password?{" "}
                <Link href="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
