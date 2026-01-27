import type { Alert } from "@/types/alert";
import type { ScanResult } from "@/types/scan";

export function generateAlertsFromScans(scans: unknown): Alert[] {
  if (!Array.isArray(scans)) return [];

  const alerts: Alert[] = [];

  for (const scan of scans as ScanResult[]) {
    if (!scan?.scanId) continue;

    const { scanId, createdAt, regionName } = scan;

    // 🔴 CRITICAL: Forest Loss
    if (scan.transitions?.forestToUrbanPercent >= 20) {
      alerts.push({
        id: `${scanId}-DEF`,
        scanId,
        createdAt,
        severity: "CRITICAL",
        type: "DEFORESTATION",
        title: "Severe Deforestation Detected",
        description: `${scan.transitions.forestToUrbanPercent}% forest area converted to urban land.`,
        regionName,
        recommendation: [
          "Immediate field verification required",
          "Deploy forest patrol teams",
          "Initiate legal investigation",
        ],
      });
    }

    // 🟡 WARNING: NDVI Drop
    if (scan.ndvi?.mean !== undefined && scan.ndvi.mean < 0.3) {
      alerts.push({
        id: `${scanId}-NDVI`,
        scanId,
        createdAt,
        severity: "WARNING",
        type: "NDVI_DROP",
        title: "Vegetation Health Decline",
        description: `NDVI mean dropped to ${scan.ndvi.mean.toFixed(2)}.`,
        regionName,
        recommendation: [
          "Monitor vegetation trend",
          "Check for drought or human interference",
        ],
      });
    }

    // 🟠 WARNING: Urban Expansion
    if (scan.transitions?.urbanExpansionPercent >= 15) {
      alerts.push({
        id: `${scanId}-URBAN`,
        scanId,
        createdAt,
        severity: "WARNING",
        type: "URBAN_EXPANSION",
        title: "Rapid Urban Expansion",
        description: `${scan.transitions.urbanExpansionPercent}% increase in urban area detected.`,
        regionName,
        recommendation: [
          "Review zoning permissions",
          "Assess environmental impact",
        ],
      });
    }
  }

  return alerts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
