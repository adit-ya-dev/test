"use client";

import { AlertTriangle, TrendingDown, Activity } from "lucide-react";
import { useJobHistory } from "@/hooks/useJobHistory";
import { computeThreatMetrics } from "@/lib/jobs/metrics";

export default function ThreatLevelCard() {
  const { history } = useJobHistory();
  const metrics = computeThreatMetrics(history);

  const severityLabel =
    metrics.recentRate >= 0.5
      ? "CRITICAL"
      : metrics.recentRate >= 0.25
        ? "HIGH"
        : metrics.recentRate >= 0.1
          ? "ELEVATED"
          : "LOW";

  const severityColor =
    severityLabel === "CRITICAL"
      ? "text-destructive"
      : severityLabel === "HIGH"
        ? "text-rose-500"
        : severityLabel === "ELEVATED"
          ? "text-amber-500"
          : "text-emerald-500";

  const details = [
    {
      label: "High Severity Rate",
      val: `${Math.round(metrics.recentRate * 100)}%`,
      icon: TrendingDown,
      color: "text-rose-500",
    },
    {
      label: "Jobs (30d)",
      val: String(metrics.recentJobs),
      icon: Activity,
      color: "text-amber-500",
    },
    {
      label: "Active Threats",
      val: String(metrics.recentHigh),
      icon: AlertTriangle,
      color: "text-orange-500",
    },
  ];

  const hasRecent = metrics.recentJobs > 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm h-full">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">
        Threat Level
      </p>
      <div className="space-y-1">
        <h2 className={`text-4xl font-black tracking-tighter ${severityColor}`}>
          {severityLabel}
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {hasRecent ? (
            <>
              Based on last 30 days. Trend:{" "}
              <span className="text-foreground font-bold">{metrics.trend}</span>
            </>
          ) : (
            <>No completed jobs in the last 30 days.</>
          )}
        </p>
      </div>
      <div className="mt-8 space-y-4">
        {details.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b border-border pb-2"
          >
            <div className="flex items-center gap-3">
              <item.icon className={`h-4 w-4 ${item.color}`} />
              <span className="text-xs font-medium text-muted-foreground">
                {item.label}
              </span>
            </div>
            <span className="text-sm font-bold text-foreground">
              {item.val}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
