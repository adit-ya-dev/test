"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

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
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm h-full">
      <div className="flex items-center justify-between mb-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
          NDVI Trend
        </p>
        <span className="text-[10px] py-1 px-2 rounded-md bg-muted border border-border text-muted-foreground uppercase">
          6 Month Analysis
        </span>
      </div>
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              dy={10}
            />
            <YAxis
              domain={[0, 1]}
              axisLine={false}
              tickLine={false}
              width={40}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              tickFormatter={(v) => v.toFixed(1)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                color: "hsl(var(--foreground))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              itemStyle={{ color: "#10b981" }}
            />
            <Line
              type="monotone"
              dataKey="ndvi"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
