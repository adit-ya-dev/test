"use client";
import { AlertTriangle, TrendingDown, Droplets } from "lucide-react";

export default function AlertsPreview() {
  const alerts = [
    {
      type: "Illegal Encroachment",
      time: "5 min ago",
      level: "CRITICAL",
      icon: AlertTriangle,
      color: "text-red-500",
    },
    {
      type: "NDVI Drop Detected",
      time: "18 min ago",
      level: "WARNING",
      icon: TrendingDown,
      color: "text-yellow-600 dark:text-yellow-400",
    },
    {
      type: "Waterbody Shrink",
      time: "1 hour ago",
      level: "MODERATE",
      icon: Droplets,
      color: "text-blue-500",
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm h-full">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">
        Alerts Preview
      </p>
      <div className="space-y-3">
        {alerts.map((a, i) => (
          <div
            key={i}
            className="group flex flex-col gap-2 rounded-xl border border-border bg-muted/20 p-4 hover:bg-muted/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <a.icon className={`h-4 w-4 ${a.color}`} />
                <p className="text-xs font-bold text-foreground tracking-tight">
                  {a.type}
                </p>
              </div>
              <span className="text-[9px] font-black px-2 py-0.5 rounded bg-background border border-border text-muted-foreground">
                {a.level}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground font-medium pl-7">
              {a.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
