"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { month: "Jan", ndvi: 0.62 },
  { month: "Feb", ndvi: 0.58 },
  { month: "Mar", ndvi: 0.52 },
  { month: "Apr", ndvi: 0.44 },
  { month: "May", ndvi: 0.39 },
  { month: "Jun", ndvi: 0.32 },
];

export default function NDVITrendChart() {
  return (
    <Card className="bg-[#071225] border-white/10 shadow-xl h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs uppercase tracking-widest text-white/40">
            NDVI Trend
          </CardTitle>
          <span className="text-xs text-white/50">Last 6 months</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" />
              <YAxis stroke="rgba(255,255,255,0.3)" />
              <Tooltip
                contentStyle={{
                  background: "#0B1A33",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white",
                }}
              />
              <Line 
                type="monotone" 
                dataKey="ndvi" 
                strokeWidth={3} 
                dot={false}
                stroke="#10b981"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}