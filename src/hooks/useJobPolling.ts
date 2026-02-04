"use client";

import { useEffect, useMemo, useState } from "react";
import type { JobResultsResponse, JobStatusResponse } from "@/types/jobs";
import { getJobResults, getJobStatus } from "@/lib/api/analyzeService";
import { getJobById, upsertJob } from "@/lib/jobs/jobStorage";

export function useJobPolling(jobId: string | null) {
  const [status, setStatus] = useState<JobStatusResponse | null>(null);
  const [results, setResults] = useState<JobResultsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;

    let interval: NodeJS.Timeout | null = null;
    let mounted = true;

    const poll = async () => {
      try {
        const statusData = await getJobStatus(jobId);
        if (!mounted) return;

        setStatus(statusData);
        const existing = getJobById(jobId);
        upsertJob({
          job_id: statusData.job_id,
          status: statusData.status,
          progress: statusData.progress ?? 0,
          message: statusData.message || "",
          coordinates: statusData.coordinates,
          start_year: statusData.start_year,
          end_year: statusData.end_year,
          change_types: existing?.change_types ?? [],
          created_at: existing?.created_at ?? new Date().toISOString(),
          updated_at: new Date().toISOString(),
          results_summary: existing?.results_summary,
        });

        if (statusData.status === "Completed") {
          const resultsData = await getJobResults(jobId);
          setResults(resultsData);
          const existingAfter = getJobById(jobId);
          upsertJob({
            job_id: resultsData.job_id,
            status: "Completed",
            progress: 100,
            message: "Completed",
            coordinates: statusData.coordinates,
            start_year: statusData.start_year,
            end_year: statusData.end_year,
            change_types: existingAfter?.change_types ?? [],
            created_at: existingAfter?.created_at ?? new Date().toISOString(),
            updated_at: new Date().toISOString(),
            results_summary: resultsData.results.statistics,
          });

          if (interval) clearInterval(interval);
        } else if (statusData.status === "Failed") {
          setError(statusData.message || "Job processing failed");
          if (interval) clearInterval(interval);
        }
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || "Polling failed");
        if (interval) clearInterval(interval);
      }
    };

    poll();
    interval = setInterval(poll, 5000);

    return () => {
      mounted = false;
      if (interval) clearInterval(interval);
    };
  }, [jobId]);

  const progress = status?.progress ?? (status?.status === "Completed" ? 100 : 0);
  const isProcessing =
    status?.status === "Queued" || status?.status === "Processing";
  const isCompleted = status?.status === "Completed";

  return {
    status,
    results,
    error,
    isProcessing,
    isCompleted,
    progress,
  };
}
