"use client";

import { useState, useEffect } from "react";
import { PageShell, SectionHeader, FadeIn } from "@/src/components/dashboard/PageShell";
import {
  listNotificationsAction,
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/src/actions/study.actions";
import type { Notification } from "@/src/api/study.api";
import { Bell, CheckCheck } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    setLoading(true);
    const result = await listNotificationsAction();
    if (result.success && "data" in result) {
      setNotifications(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    const result = await markNotificationReadAction(id);
    if (result.success && "data" in result) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? result.data : n))
      );
    }
  };

  const handleMarkAllRead = async () => {
    const result = await markAllNotificationsReadAction();
    if (result.success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const typeStyles: Record<string, string> = {
    info: "border-indigo-500/40 bg-indigo-500/10 text-indigo-200",
    success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
    warning: "border-amber-500/40 bg-amber-500/10 text-amber-200",
    error: "border-rose-500/40 bg-rose-500/10 text-rose-200",
  };

  return (
    <PageShell>
      <FadeIn>
        <SectionHeader
          label="Updates"
          title="Notifications"
          action={
            unreadCount > 0 ? (
             <button
               onClick={handleMarkAllRead}
               className="flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-500/20 px-4 py-2 text-base font-semibold text-indigo-200 transition-colors hover:bg-indigo-500/30"
             >
                <CheckCheck className="h-4 w-4" />
                Mark all read
              </button>
            ) : null
          }
        />
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="glass-card card-shadow rounded-3xl border border-slate-800/70">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500/30 border-t-indigo-500" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-400">
              <Bell className="h-10 w-10 text-slate-600" />
              <p>No notifications yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/70">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-5 transition-colors ${
                    !notification.read ? "bg-white/[0.02]" : ""
                  }`}
                >
                  <div
                    className={`mt-0.5 h-2.5 w-2.5 flex-shrink-0 rounded-full border ${
                      typeStyles[notification.type] || typeStyles.info
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                       <h4 className="text-base font-semibold text-slate-100">
                         {notification.title}
                       </h4>
                       <span className="flex-shrink-0 text-sm text-slate-500">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                     <p className="mt-1 text-base text-slate-400">{notification.message}</p>
                  </div>
                  {!notification.read && (
                       <button
                         onClick={() => handleMarkRead(notification.id)}
                         className="flex-shrink-0 rounded-lg border border-slate-700 bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:border-indigo-500/50 hover:text-indigo-200"
                       >
                      Mark read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </FadeIn>
    </PageShell>
  );
}
