"use client";
import { AlertTriangle, TrendingDown, Activity } from "lucide-react";

export default function ThreatLevelCard() {
  const metrics = [
    {
      label: "Forest Loss",
      val: "24%",
      icon: TrendingDown,
      color: "text-rose-500",
    },
    {
      label: "NDVI Drop",
      val: "0.31",
      icon: Activity,
      color: "text-amber-500",
    },
    {
      label: "Alert Confidence",
      val: "0.92",
      icon: AlertTriangle,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm h-full">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">
        Threat Level
      </p>
      <div className="space-y-1">
        <h2 className="text-4xl font-black tracking-tighter text-destructive">
          CRITICAL
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Forest → Urban transition exceeded{" "}
          <span className="text-foreground font-bold">20%</span> threshold.
        </p>
      </div>
      <div className="mt-8 space-y-4">
        {metrics.map((item, i) => (
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
