"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, CheckSquare, StickyNote, TrendingUp, Target, GraduationCap, Settings, ChevronLeft, LogOut, Play } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { clearSessionToken } from "@/src/actions/auth.actions";
import { useRouter } from "next/navigation";

import { Shield } from "lucide-react";

const nav = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Timetable", href: "/dashboard/timetable", icon: Calendar },
  { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { name: "Study Sessions", href: "/dashboard/study-sessions", icon: Play },
  { name: "Notes", href: "/dashboard/notes", icon: StickyNote },
  { name: "Progress", href: "/dashboard/progress", icon: TrendingUp },
  { name: "Exam Planner", href: "/dashboard/exam-planner", icon: Target },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

const adminNav = { name: "Admin", href: "/dashboard/admin", icon: Shield };

export function Sidebar({
  name,
  collapsed,
  onToggle,
  isAdmin,
  role,
}: {
  name: string;
  collapsed: boolean;
  onToggle: () => void;
  isAdmin?: boolean;
  role?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <aside
      className={cn(
        "sidebar-collapsed z-40 hidden flex-col border-r border-slate-800/70 bg-[#0c1426]/95 backdrop-blur-xl lg:sticky lg:top-0 lg:flex lg:h-screen",
        collapsed ? "w-[80px]" : "w-[260px]"
      )}
    >
      <div className={cn("flex h-16 items-center border-b border-slate-800/70", collapsed ? "justify-center px-2" : "gap-2.5 px-6")}>
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl gradient-primary shadow-lg shadow-indigo-900/40">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        {!collapsed && <span className="text-lg font-bold tracking-tight text-slate-50">Edumate</span>}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {nav.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                collapsed && "justify-center",
                active
                  ? "bg-indigo-500/15 text-indigo-200"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-indigo-400" />
              )}
              <Icon className={cn("h-5 w-5 flex-shrink-0", active ? "text-indigo-300" : "text-slate-500 group-hover:text-slate-300")} />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
        {isAdmin && (() => {
          const active = isActive(adminNav.href);
          const Icon = adminNav.icon;
          return (
            <Link
              key={adminNav.name}
              href={adminNav.href}
              title={collapsed ? adminNav.name : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                collapsed && "justify-center",
                active
                  ? "bg-rose-500/15 text-rose-200"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-rose-400" />
              )}
              <Icon className={cn("h-5 w-5 flex-shrink-0", active ? "text-rose-300" : "text-slate-500 group-hover:text-slate-300")} />
              {!collapsed && <span className="truncate">{adminNav.name}</span>}
            </Link>
          );
        })()}
      </nav>

      <div className="border-t border-slate-800/70 p-3">
        {!collapsed && (
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="gradient-primary flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">
              {name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-100">{name}</p>
              <p className="text-xs text-slate-400 capitalize">{role || "Student"}</p>
            </div>
          </div>
        )}
        <div className={cn("flex gap-2", collapsed && "flex-col items-center")}>
          <button
            onClick={onToggle}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
            {!collapsed && "Collapse"}
          </button>
          <button
            onClick={() => {
              clearSessionToken();
              router.push("/login");
            }}
            aria-label="Logout"
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-white/5 px-3 py-2 text-xs font-medium text-rose-300 transition-colors hover:bg-rose-500/10",
              collapsed ? "w-9 flex-shrink-0" : "px-3"
            )}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && "Logout"}
          </button>
        </div>
      </div>
    </aside>
  );
}
