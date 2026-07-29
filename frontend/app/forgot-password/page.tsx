"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordAction } from "@/src/actions/auth.actions";
import { ForgotPasswordSchema, type ForgotPasswordFormValues } from "@/src/schemas/auth.schemas";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setServerError(null);
    setSuccessMessage(null);

    const result = await forgotPasswordAction(values.email);

    if (!result.success) {
      setServerError(result.message);
      return;
    }

    setSuccessMessage("If an account exists, a reset link has been sent.");
  };

  return (
    <div className="login-container">
      <div className="auth-card">
        <div className="left-section">
          <div className="overlay">
            <h1>EduMate</h1>
            <p>Reset your password and continue your learning journey.</p>
          </div>
        </div>

        <div className="right-section">
          <div className="form-box">
            <h2>Forgot Password</h2>
            <p className="subtitle">Enter your email to receive a reset link.</p>

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
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  aria-invalid={errors.email ? "true" : "false"}
                  {...register("email")}
                  suppressHydrationWarning
                />
                {errors.email && (
                  <p className="field-error">{errors.email.message}</p>
                )}
              </div>

              <button type="submit" disabled={isSubmitting} suppressHydrationWarning>
                {isSubmitting ? "Sending..." : "Send Reset Link"}
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
