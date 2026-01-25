"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingDown, Droplets } from "lucide-react";

export default function AlertsPreview() {
  const alerts = [
    { type: "Illegal Encroachment", time: "5 min ago", level: "CRITICAL", icon: AlertTriangle },
    { type: "NDVI Drop Detected", time: "18 min ago", level: "WARNING", icon: TrendingDown },
    { type: "Waterbody Shrink", time: "1 hour ago", level: "MODERATE", icon: Droplets },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "CRITICAL":
        return "bg-red-500 text-white";
      case "WARNING":
        return "bg-yellow-500 text-black";
      case "MODERATE":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <Card className="bg-[#071225] border-white/10 shadow-xl h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-xs uppercase tracking-widest text-white/40">
          Alerts Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-4 space-y-3">
          {alerts.map((a, i) => {
            const Icon = a.icon;
            return (
              <div
                key={i}
                className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-white/60" />
                    <p className="font-semibold text-white">{a.type}</p>
                  </div>
                  <Badge className={getLevelColor(a.level)}>
                    {a.level}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-white/50">{a.time}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}