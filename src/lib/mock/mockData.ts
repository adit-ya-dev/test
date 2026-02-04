import type { Scan } from "@/types/scan";
import type { Alert } from "@/types/alert"; // Changed from AlertItem
import type { DashboardStats } from "@/types/analysis";

export const mockDashboardStats: DashboardStats = {
  totalScans: 12,
  activeThreats: 3,
  areaMonitoredKm2: 842.5,
  recentChanges: 156,
};

export const mockRecentScans: Scan[] = [
  {
    id: "SCAN-1001",
    regionName: "New Delhi",
    createdAt: new Date().toISOString(),
    status: "COMPLETED",
    severity: "CRITICAL",
    forestLossPercent: 24,
    urbanGainPercent: 13,
    meanNdvi: 0.32,
  },
  {
    id: "SCAN-1002",
    regionName: "Agra",
    createdAt: new Date().toISOString(),
    status: "COMPLETED",
    severity: "WARNING",
    forestLossPercent: 14,
    urbanGainPercent: 9,
    meanNdvi: 0.41,
  },
];

export const mockAlerts: Alert[] = [
  {
    id: "ALERT-01",
    scanId: "SCAN-1001",
    createdAt: new Date().toISOString(),
    severity: "CRITICAL",
    type: "DEFORESTATION",
    title: "Illegal Encroachment",
    description: "Forest → Urban conversion detected above threshold.",
    regionName: "New Delhi",
    recommendation: [
      "Immediate field verification",
      "Stop construction activity",
    ],
  },
  {
    id: "ALERT-02",
    scanId: "SCAN-1002",
    createdAt: new Date().toISOString(),
    severity: "WARNING",
    type: "NDVI_DROP",
    title: "NDVI Drop",
    description: "NDVI dropped below 0.30 indicating vegetation stress.",
    regionName: "Agra",
    recommendation: ["Monitor water levels", "Assess soil quality"],
  },
];
