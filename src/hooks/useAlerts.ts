"use client";

import { useEffect, useState } from "react";
import type { Alert, AlertSeverity } from "@/types/alert";
import { generateAlertsFromScans } from "@/lib/alerts/alertGenerator";
import { getScanHistory } from "@/lib/scans/scanStorage";

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [severity, setSeverity] = useState<"ALL" | AlertSeverity>("ALL");

  useEffect(() => {
    setLoading(true);

    const scans = getScanHistory();
    const generated = generateAlertsFromScans(scans);

    setAlerts(Array.isArray(generated) ? generated : []);
    setLoading(false);
  }, []);

  const filtered =
    severity === "ALL" ? alerts : alerts.filter((a) => a.severity === severity);

  return {
    alerts: filtered,
    total: filtered.length,
    loading,
    severity,
    setSeverity,
  };
}
