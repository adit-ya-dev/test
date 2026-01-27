"use client";

import type { ScanResult } from "@/types/scan";
import { downloadJson } from "@/lib/download/downloadFile";

export default function DataLogsActions({
  logs,
  onClearAll,
}: {
  logs: ScanResult[];
  onClearAll: () => void;
}) {
  return (
    <div className="flex flex-row gap-3">
      <button
        onClick={() => downloadJson(logs, `sentinel-eye-data-logs.json`)}
        className="flex-1 sm:flex-none rounded-xl bg-secondary px-6 py-2 text-sm font-black text-secondary-foreground hover:opacity-80 transition border border-border uppercase tracking-widest"
      >
        Export JSON
      </button>

      <button
        onClick={onClearAll}
        className="flex-1 sm:flex-none rounded-xl px-6 py-2 text-sm font-black bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive hover:text-destructive-foreground transition uppercase tracking-widest"
      >
        Clear Logs
      </button>
    </div>
  );
}
