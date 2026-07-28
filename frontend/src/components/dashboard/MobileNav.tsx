"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CheckSquare, Play, StickyNote, User, Settings, Shield } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useAuth } from "@/src/contexts/AuthContext";

const nav = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { name: "Sessions", href: "/dashboard/study-sessions", icon: Play },
  { name: "Notes", href: "/dashboard/notes", icon: StickyNote },
  { name: "Profile", href: "/dashboard/settings", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-slate-800/70 bg-[#0c1426]/95 backdrop-blur-xl lg:hidden pb-safe">
      {nav.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 py-2 px-2 text-[10px] font-medium transition-colors",
              active ? "text-indigo-300" : "text-slate-500 hover:text-slate-300"
            )}
          >
            <Icon className={cn("h-5 w-5", active && "text-indigo-400")} />
            <span className="truncate">{item.name}</span>
          </Link>
        );
      })}
      {user?.role === "admin" && (
        <Link
          href="/dashboard/admin"
          className={cn(
            "flex flex-col items-center gap-0.5 py-2 px-2 text-[10px] font-medium transition-colors",
            pathname.startsWith("/dashboard/admin") ? "text-rose-300" : "text-slate-500 hover:text-slate-300"
          )}
        >
          <Shield className={cn("h-5 w-5", pathname.startsWith("/dashboard/admin") && "text-rose-400")} />
          <span className="truncate">Admin</span>
        </Link>
      )}
    </nav>
  );
}
