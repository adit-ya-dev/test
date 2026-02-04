"use client";

import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Activity, AlertTriangle, Map, TrendingUp } from "lucide-react";

export default function StatsCards() {
  const { data, loading } = useDashboardStats();

  const stats = [
    {
      label: "Total Scans",
      value: String(data.totalScans),
      icon: Activity,
      color: "text-emerald-500",
    },
    {
      label: "Active Threats",
      value: String(data.activeThreats),
      icon: AlertTriangle,
      color: "text-rose-500",
    },
    {
      label: "Area Monitored",
      value: `${data.areaMonitoredKm2.toFixed(1)} km2`,
      icon: Map,
      color: "text-blue-500",
    },
    {
      label: "Recent Changes",
      value: String(data.recentChanges),
      icon: TrendingUp,
      color: "text-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 px-6">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors"
          >
            <div
              className={`absolute -right-2 -top-2 h-12 w-12 rounded-full blur-3xl opacity-10 ${s.color.replace("text", "bg")}`}
            />
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  {s.label}
                </p>
                <div
                  className={`p-2 rounded-lg bg-muted border border-border ${s.color}`}
                >
                  <Icon size={16} />
                </div>
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-foreground">
                {loading ? (
                  <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
                ) : (
                  s.value
                )}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <div
                  className={`h-1.5 w-1.5 rounded-full animate-pulse ${s.color.replace("text", "bg")}`}
                />
                <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">
                  Live Feed
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
