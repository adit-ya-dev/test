"use client";

import type { DataLogsFilters } from "@/types/dataLogs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        <Select
          value={filters.severity}
          onValueChange={(value) =>
            onChange({ ...filters, severity: value as any })
          }
        >
          <SelectTrigger className="w-[180px] rounded-xl bg-background">
            <SelectValue placeholder="All Severity" />
          </SelectTrigger>

          <SelectContent
            position="popper"
            sideOffset={6}
            className="w-[var(--radix-select-trigger-width)] rounded-xl border border-border bg-popover shadow-lg"
          >
            <SelectItem value="ALL">All Severity</SelectItem>
            <SelectItem value="LOW">LOW</SelectItem>
            <SelectItem value="WARNING">WARNING</SelectItem>
            <SelectItem value="CRITICAL">CRITICAL</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={filters.sort}
          onValueChange={(value) =>
            onChange({ ...filters, sort: value as any })
          }
        >
          <SelectTrigger className="w-[180px] rounded-xl bg-background">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>

          <SelectContent
            position="popper"
            sideOffset={6}
            className="w-[var(--radix-select-trigger-width)] rounded-xl border border-border bg-popover shadow-lg"
          >
            <SelectItem value="NEWEST">Newest First</SelectItem>
            <SelectItem value="OLDEST">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
