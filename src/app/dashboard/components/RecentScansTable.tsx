"use client";
import { Badge } from "@/components/ui/badge";

const scans = [
  {
    id: "SCAN-1001",
    region: "New Delhi",
    status: "COMPLETED",
    severity: "CRITICAL",
    time: "2 min ago",
  },
  {
    id: "SCAN-1002",
    region: "Agra",
    status: "COMPLETED",
    severity: "WARNING",
    time: "18 min ago",
  },
  {
    id: "SCAN-1003",
    region: "Noida",
    status: "PROCESSING",
    severity: "—",
    time: "Just now",
  },
];

export default function RecentScansTable() {
  const getSeverityStyles = (sev: string) => {
    switch (sev) {
      case "CRITICAL":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      case "WARNING":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="p-6 border-b border-border">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
          Recent Scans
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-6 py-4 text-left">Scan ID</th>
              <th className="px-6 py-4 text-left">Region</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {scans.map((s) => (
              <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-mono text-xs font-bold text-primary italic">
                  {s.id}
                </td>
                <td className="px-6 py-4 text-foreground/80 font-medium">
                  {s.region}
                </td>
                <td className="px-6 py-4">
                  <Badge variant="outline" className="text-[10px]">
                    {s.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-[10px] font-black border ${getSeverityStyles(s.severity)}`}
                  >
                    {s.severity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
