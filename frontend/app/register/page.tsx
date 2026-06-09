"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerAction } from "@/src/actions/auth.actions";
import {
  RegisterFormValues,
  RegisterSchema,
} from "@/src/schemas/auth.schemas";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    setSuccessMessage(null);

    const result = await registerAction({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    if (!result.success) {
      setServerError(result.message);
      return;
    }

    setSuccessMessage("Account created successfully! Redirecting to login...");
    setTimeout(() => router.push("/login"), 1500);
  };

  return (
    <div className="login-container">
      <div className="auth-card">
        <div className="left-section">
          <div className="overlay">
            <h1>Join EduMate</h1>
            <p>
              Create your account and start planning your studies smarter,
              tracking goals, and improving productivity every day.
            </p>
          </div>
        </div>

        <div className="right-section">
          <div className="form-box">
            <h2>Create Account</h2>
            <p className="subtitle">
              Register to begin your smart learning experience.
            </p>

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
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  aria-invalid={errors.name ? "true" : "false"}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="field-error">{errors.name.message}</p>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  aria-invalid={errors.email ? "true" : "false"}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="field-error">{errors.email.message}</p>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Create password"
                  aria-invalid={errors.password ? "true" : "false"}
                  {...register("password")}
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
                  placeholder="Confirm password"
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="field-error">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Register"}
              </button>
            </form>

            <div className="bottom-text">
              <p>
                Already have an account?{" "}
                <Link href="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
