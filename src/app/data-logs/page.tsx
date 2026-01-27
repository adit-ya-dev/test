"use client";

import DataLogsHeader from "./components/DataLogsHeader";
import DataLogsFilters from "./components/DataLogsFilters";
import DataLogsActions from "./components/DataLogsActions";
import DataLogsTable from "./components/DataLogsTable";

import { useDataLogs } from "@/hooks/useDataLogs";

export default function DataLogsPage() {
  const { logs, total, filters, setFilters, clearAll } = useDataLogs();

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <DataLogsHeader total={total} />

      <div className="flex flex-col xl:flex-row gap-4 xl:items-end">
        <DataLogsFilters filters={filters} onChange={setFilters} />
        <DataLogsActions logs={logs} onClearAll={clearAll} />
      </div>

      <DataLogsTable logs={logs} />
    </div>
  );
}
