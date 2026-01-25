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
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await analyzeRegion(payload);
      setResult(res);
      return res;
    } catch (e: any) {
      setError(e.message || "Something went wrong");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { run, loading, result, error };
}
