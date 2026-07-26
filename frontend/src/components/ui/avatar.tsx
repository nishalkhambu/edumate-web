import * as React from "react";
import { cn } from "@/src/lib/utils";

export function Avatar({
  name,
  className,
}: {
  name?: string;
  className?: string;
}) {
  const initials = (name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        "gradient-primary flex items-center justify-center rounded-full font-bold text-white ring-2 ring-white/10",
        className
      )}
    >
      {initials}
    </div>
  );
}
