"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/src/contexts/AuthContext";
import {
  updateProfileAction,
  whoamiAction,
  clearSessionToken,
} from "@/src/actions/auth.actions";
import {
  UpdateProfileFormValues,
  UpdateProfileSchema,
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

export default function ProfilePage() {
  const { setUser, user } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(UpdateProfileSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      const result = await whoamiAction();
      if (result.success && "data" in result) {
        const authUser = {
          id: result.data.id,
          name: result.data.name,
          email: result.data.email,
          role: result.data.role,
          status: result.data.status,
        };
        setUser(authUser);
        setValue("name", authUser.name);
        setValue("email", authUser.email);
      }
      setIsLoadingUser(false);
    };
    fetchUser();
  }, [setUser, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: UpdateProfileFormValues) => {
    setServerError(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    if (selectedFile) {
      formData.append("avatar", selectedFile);
    }

    const result = await updateProfileAction(formData);

    if (!result.success) {
      setServerError(result.message);
      return;
    }

    if ("data" in result) {
      setUser({
        id: result.data.id,
        name: result.data.name,
        email: result.data.email,
        role: result.data.role,
        status: result.data.status,
      });
    }

    setSuccessMessage("Profile updated successfully!");
  };

  if (isLoadingUser) {
    return (
      <div className="dashboard-loading">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <main className="dashboard-container">
        <header className="dashboard-header">
          <h1>EduMate Dashboard</h1>
          <div className="header-actions">
            <Link href="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <Link href="/dashboard/profile" className="nav-link active">
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
          <div className="dashboard-card">
            <h2>Update Profile</h2>

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
              <div className="avatar-upload">
                <div className="avatar-preview">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Avatar preview" />
                  ) : (
                    <div className="avatar-placeholder">
                      {user?.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                  )}
                </div>
                <div className="avatar-input">
                  <label htmlFor="avatar" className="avatar-label">
                    Upload Avatar
                  </label>
                  <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="avatar-file-input"
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  aria-invalid={errors.name ? "true" : "false"}
                  {...register("name")}
                  suppressHydrationWarning
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
                  suppressHydrationWarning
                />
                {errors.email && (
                  <p className="field-error">{errors.email.message}</p>
                )}
              </div>

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}
