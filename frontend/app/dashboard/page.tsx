"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  clearSessionToken,
  getSessionToken,
} from "@/src/actions/auth.actions";
import { useAuth } from "@/src/contexts/AuthContext";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const token = getSessionToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    setIsAuthorized(true);
  }, [router]);

  const handleLogout = () => {
    clearSessionToken();
    router.push("/login");
  };

  if (!isAuthorized || (!user && !isLoading)) {
    return (
      <div className="dashboard-loading">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <main className="dashboard-container">
      <header className="dashboard-header">
        <h1>EduMate Dashboard</h1>
        <div className="header-actions">
          <Link href="/dashboard" className="nav-link active">
            Dashboard
          </Link>
          <Link href="/dashboard/profile" className="nav-link">
            Profile
          </Link>
          <Link href="/dashboard/password" className="nav-link">
            Password
          </Link>
          {user?.role === "admin" && (
            <Link href="/dashboard/admin/users" className="nav-link">
              Users
            </Link>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="logout-btn"
          >
            Logout
          </button>
        </div>
      </header>

      <section className="dashboard-content">
        <div className="dashboard-card">
          <h2>Welcome to EduMate</h2>
          <p>
            You are successfully authenticated. This dashboard is a placeholder
            for upcoming study planning features.
          </p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Study Planner</h3>
            <p>Organize your courses and daily study sessions.</p>
          </div>

          <div className="dashboard-card">
            <h3>Task Tracker</h3>
            <p>Keep assignments and deadlines in one place.</p>
          </div>

          <div className="dashboard-card">
            <h3>Progress Insights</h3>
            <p>Monitor your learning goals and achievements.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
