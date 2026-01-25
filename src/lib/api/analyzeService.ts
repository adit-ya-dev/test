import type { AOIRequest } from "@/types/geo";
import type { AnalyzeResponse } from "@/types/analysis";

export async function analyzeRegion(
  payload: AOIRequest,
): Promise<AnalyzeResponse> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Analyze request failed");
  }

  return res.json();
}
