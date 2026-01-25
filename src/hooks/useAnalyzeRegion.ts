"use client";

import { useState } from "react";
import type { AOIRequest } from "@/types/geo";
import type { AnalyzeResponse } from "@/types/analysis";
import { analyzeRegion } from "@/lib/api/analyzeService";

export function useAnalyzeRegion() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async (payload: AOIRequest) => {
    console.log("useAnalyzeRegion: Starting analysis with payload:", payload);
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await analyzeRegion(payload);
      console.log("useAnalyzeRegion: Analysis successful:", res);
      setResult(res);
      return res;
    } catch (e: any) {
      console.error("useAnalyzeRegion: Analysis failed:", e);
      const errorMessage = e.message || "Something went wrong during analysis";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { run, loading, result, error };
}
