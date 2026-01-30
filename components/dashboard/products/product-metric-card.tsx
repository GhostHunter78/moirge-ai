"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

const accentClasses: Record<
  "emerald" | "indigo" | "amber",
  { ring: string; chip: string; glow: string }
> = {
  emerald: {
    ring: "ring-emerald-100",
    chip: "bg-emerald-600 text-emerald-50",
    glow: "shadow-[0_0_40px_rgba(16,185,129,0.25)]",
  },
  indigo: {
    ring: "ring-indigo-100",
    chip: "bg-indigo-600 text-indigo-50",
    glow: "shadow-[0_0_40px_rgba(79,70,229,0.25)]",
  },
  amber: {
    ring: "ring-amber-100",
    chip: "bg-amber-500 text-amber-50",
    glow: "shadow-[0_0_40px_rgba(245,158,11,0.25)]",
  },
};

export function ProductMetricCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent: "emerald" | "indigo" | "amber";
}) {
  const styles = accentClasses[accent];

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-none bg-linear-to-br from-white via-slate-50 to-slate-100/80 p-4 sm:p-5",
        "ring-1",
        styles.ring,
      )}
    >
      <div className="absolute -top-10 -right-6 h-24 w-24 rounded-full bg-linear-to-br from-slate-200/60 to-slate-50/0 blur-2xl" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-slate-50 px-2 py-1 text-[10px] uppercase tracking-[0.16em]">
            <span className={cn("h-1.5 w-1.5 rounded-full", styles.chip)} />
            {label}
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
              {value}
            </p>
          </div>
          <p className="mt-1 text-xs text-slate-500">{hint}</p>
        </div>
        <div
          className={cn(
            "hidden sm:flex items-center justify-center rounded-full bg-white/80",
            "h-10 w-10 border border-slate-100 backdrop-blur-sm",
            styles.glow,
          )}
        >
          <Star className="h-4 w-4 text-amber-400" />
        </div>
      </div>
    </Card>
  );
}
