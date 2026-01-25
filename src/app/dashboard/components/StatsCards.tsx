"use client";

import { useDashboardStats } from "@/hooks/useDashboardStats";
import { formatNdvi, formatPercent } from "@/lib/utils/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatsCards() {
  const { data, loading } = useDashboardStats();

  const stats = [
    { label: "Mean NDVI", value: data ? formatNdvi(data.meanNdvi) : "--" },
    {
      label: "Forest Loss",
      value: data ? formatPercent(data.forestLossPercent) : "--",
    },
    {
      label: "Urban Gain",
      value: data ? formatPercent(data.urbanGainPercent) : "--",
    },
    { label: "Scans Today", value: data ? String(data.scansToday) : "--" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card key={s.label} className="bg-[#071225] border-white/10 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-widest text-white/40">
              {s.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-3xl font-black text-white">
              {loading ? "..." : s.value}
            </h2>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}