"use client";

import { AlertTriangle, TrendingDown, Droplets } from "lucide-react";
import { useAlerts } from "@/hooks/useAlerts";

function timeAgo(value: string) {
  const ts = new Date(value).getTime();
  if (Number.isNaN(ts)) return "Just now";
  const diff = Date.now() - ts;
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.round(hours / 24);
  return `${days} days ago`;
}

export default function AlertsPreview() {
  const { alerts, loading } = useAlerts();
  const topAlerts = alerts.slice(0, 3);

  const getIcon = (severity: string) => {
    if (severity === "CRITICAL") return AlertTriangle;
    if (severity === "WARNING") return TrendingDown;
    return Droplets;
  };

  const getColor = (severity: string) => {
    if (severity === "CRITICAL") return "text-red-500";
    if (severity === "WARNING")
      return "text-yellow-600 dark:text-yellow-400";
    return "text-blue-500";
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm h-full">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">
        Alerts Preview
      </p>
      <div className="space-y-3">
        {loading ? (
          <div className="rounded-xl border border-border bg-muted/20 p-4 text-xs text-muted-foreground">
            Loading alerts...
          </div>
        ) : topAlerts.length === 0 ? (
          <div className="rounded-xl border border-border bg-muted/20 p-4 text-xs text-muted-foreground">
            No alerts yet. Run an analysis to generate alerts.
          </div>
        ) : (
          topAlerts.map((a, i) => {
            const Icon = getIcon(a.severity);
            const color = getColor(a.severity);
            return (
              <div
                key={i}
                className="group flex flex-col gap-2 rounded-xl border border-border bg-muted/20 p-4 hover:bg-muted/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${color}`} />
                    <p className="text-xs font-bold text-foreground tracking-tight">
                      {a.title}
                    </p>
                  </div>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded bg-background border border-border text-muted-foreground">
                    {a.severity}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground font-medium pl-7">
                  {timeAgo(a.createdAt)}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
