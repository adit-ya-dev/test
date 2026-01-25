"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, TrendingDown, Activity } from "lucide-react";

export default function ThreatLevelCard() {
  return (
    <Card className="bg-[#071225] border-white/10 shadow-xl h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-xs uppercase tracking-widest text-white/40">
          Threat Level
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-4">
          <h2 className="text-4xl font-black text-red-500">CRITICAL</h2>
          <p className="mt-2 text-sm text-white/60">
            Forest → Urban transition exceeded 20% threshold.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-400" />
              <span className="text-white/60">Forest Loss</span>
            </div>
            <span className="font-bold text-white">24%</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-yellow-400" />
              <span className="text-white/60">NDVI Drop</span>
            </div>
            <span className="font-bold text-white">0.31</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-400" />
              <span className="text-white/60">Alert Confidence</span>
            </div>
            <span className="font-bold text-white">0.92</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}