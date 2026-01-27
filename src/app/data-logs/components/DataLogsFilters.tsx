"use client";

import type { DataLogsFilters } from "@/types/dataLogs";

export default function DataLogsFilters({
  filters,
  onChange,
}: {
  filters: DataLogsFilters;
  onChange: (next: DataLogsFilters) => void;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 md:items-center md:justify-between flex-1">
      {/* Search */}
      <input
        value={filters.query}
        onChange={(e) => onChange({ ...filters, query: e.target.value })}
        placeholder="Search by Scan ID or Region..."
        className="w-full md:w-[320px] rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-all"
      />

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Severity */}
        <select
          value={filters.severity}
          onChange={(e) =>
            onChange({ ...filters, severity: e.target.value as any })
          }
          className="rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground outline-none cursor-pointer hover:bg-muted transition-colors"
        >
          <option value="ALL">All Severity</option>
          <option value="LOW">LOW</option>
          <option value="WARNING">WARNING</option>
          <option value="CRITICAL">CRITICAL</option>
        </select>

        {/* Sort */}
        <select
          value={filters.sort}
          onChange={(e) =>
            onChange({ ...filters, sort: e.target.value as any })
          }
          className="rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground outline-none cursor-pointer hover:bg-muted transition-colors"
        >
          <option value="NEWEST">Newest First</option>
          <option value="OLDEST">Oldest First</option>
        </select>
      </div>
    </div>
  );
}
