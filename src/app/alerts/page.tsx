"use client";

import AlertsHeader from "./components/AlertsHeader";
import AlertsFilters from "./components/AlertsFilters";
import AlertsList from "./components/AlertsList";
import { useAlerts } from "@/hooks/useAlerts";

export default function AlertsPage() {
  const { alerts, total, severity, setSeverity } = useAlerts();

  return (
    <div className="space-y-6">
      <AlertsHeader total={total} />
      <AlertsFilters value={severity} onChange={setSeverity} />
      <AlertsList alerts={alerts} />
    </div>
  );
}
