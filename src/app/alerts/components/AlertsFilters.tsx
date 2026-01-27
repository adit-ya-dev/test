"use client";

import type { AlertSeverity } from "@/types/alert";

export default function AlertsFilters({
  value,
  onChange,
}: {
  value: "ALL" | AlertSeverity;
  onChange: (v: "ALL" | AlertSeverity) => void;
}) {
  return (
    <div className="glass-card rounded-2xl p-4 shadow-xl flex gap-3">
      {["ALL", "LOW", "WARNING", "CRITICAL"].map((s) => (
        <button
          key={s}
          onClick={() => onChange(s as any)}
          className={[
            "px-4 py-2 rounded-xl text-sm font-bold transition",
            value === s
              ? "bg-primary/30 text-white"
              : "bg-white/5 text-white/60 hover:bg-white/10",
          ].join(" ")}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
