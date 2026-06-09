"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginAction } from "@/src/actions/auth.actions";
import { LoginFormValues, LoginSchema } from "@/src/schemas/auth.schemas";

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);

    const result = await loginAction({
      email: values.email,
      password: values.password,
    });

    if (!result.success) {
      setServerError(result.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="login-container">
      <div className="auth-card">
        <div className="left-section">
          <div className="overlay">
            <h1>EduMate</h1>
            <p>
              Your smart study planner to organize tasks, manage time, and
              achieve academic goals easily.
            </p>
          </div>
        </div>

        <div className="right-section">
          <div className="form-box">
            <h2>Welcome Back</h2>
            <p className="subtitle">
              Login to continue your learning journey.
            </p>

            {serverError && (
              <div className="alert alert-error" role="alert">
                {serverError}
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
                  placeholder="Enter your password"
                  aria-invalid={errors.password ? "true" : "false"}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="field-error">{errors.password.message}</p>
                )}
              </div>

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Login"}
              </button>
            </form>

            <div className="bottom-text">
              <p>
                Don&apos;t have an account?{" "}
                <Link href="/register">Register</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
