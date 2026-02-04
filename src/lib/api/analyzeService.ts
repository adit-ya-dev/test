import type {
  AnalyzeRequest,
  AnalyzeResponse,
  JobResultsResponse,
  JobStatusResponse,
} from "@/types/jobs";

export async function submitAnalysis(
  payload: AnalyzeRequest,
): Promise<AnalyzeResponse> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Submit failed: ${res.status} - ${error}`);
  }

  return res.json();
}

export async function getJobStatus(
  jobId: string,
): Promise<JobStatusResponse> {
  const res = await fetch(`/api/status/${jobId}`);
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Status failed: ${res.status} - ${error}`);
  }
  return res.json();
}

export async function getJobResults(
  jobId: string,
): Promise<JobResultsResponse> {
  const res = await fetch(`/api/results/${jobId}`);
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Results failed: ${res.status} - ${error}`);
  }
  return res.json();
}
