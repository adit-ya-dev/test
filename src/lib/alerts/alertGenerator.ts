import type { Alert } from "@/types/alert";
import type { JobHistoryItem } from "@/types/jobs";

export function generateAlertsFromJobs(jobs: unknown): Alert[] {
  if (!Array.isArray(jobs)) return [];

  const alerts: Alert[] = [];

  for (const job of jobs as JobHistoryItem[]) {
    if (!job?.job_id || !job.results_summary) continue;

    const summary = job.results_summary;
    const scanId = job.job_id;
    const createdAt = job.created_at;
    const regionName = `${job.coordinates.lat.toFixed(2)}, ${job.coordinates.lon.toFixed(2)}`;

    if (summary.deforestation_km2 >= 300) {
      alerts.push({
        id: `${scanId}-DEF`,
        scanId,
        createdAt,
        severity: "CRITICAL",
        type: "DEFORESTATION",
        title: "Severe Deforestation Detected",
        description: `${summary.deforestation_km2.toFixed(
          1,
        )} km² deforestation detected.`,
        regionName,
        recommendation: [
          "Immediate field verification required",
          "Deploy forest patrol teams",
          "Initiate legal investigation",
        ],
      });
    } else if (summary.deforestation_km2 >= 100) {
      alerts.push({
        id: `${scanId}-DEF`,
        scanId,
        createdAt,
        severity: "WARNING",
        type: "DEFORESTATION",
        title: "Deforestation Increase",
        description: `${summary.deforestation_km2.toFixed(
          1,
        )} km² deforestation detected.`,
        regionName,
        recommendation: ["Monitor affected zones", "Verify land-use changes"],
      });
    }

    if (summary.urban_expansion_km2 >= 50) {
      alerts.push({
        id: `${scanId}-URBAN`,
        scanId,
        createdAt,
        severity: "WARNING",
        type: "URBAN_EXPANSION",
        title: "Urban Expansion Spike",
        description: `${summary.urban_expansion_km2.toFixed(
          1,
        )} km² urban expansion detected.`,
        regionName,
        recommendation: ["Review zoning permissions", "Assess impact areas"],
      });
    }
  }

  return alerts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
