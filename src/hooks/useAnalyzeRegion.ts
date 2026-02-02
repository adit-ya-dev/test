"use client";

import { useState } from "react";
import type { AOIRequest } from "@/types/geo";
import type { AnalyzeResponse } from "@/types/analysis";
import { analyzeRegion } from "@/lib/api/analyzeService";

export interface AnalysisProgress {
  stage: "idle" | "initializing" | "uploading" | "processing" | "completed" | "error";
  message: string;
  attempt?: number;
}

export function useAnalyzeRegion() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<AnalysisProgress>({
    stage: "idle",
    message: "",
  });

  const run = async (payload: AOIRequest, file?: File) => {
    console.log("useAnalyzeRegion: Starting analysis with payload:", payload, file ? "with file" : "without file");
    
    setLoading(true);
    setError(null);
    setResult(null);
    setProgress({ stage: "initializing", message: "Initializing analysis..." });

    try {
      const res = await analyzeRegion(payload, file, (message) => {
        // Progress callback
        if (message.includes("Uploading")) {
          setProgress({ stage: "uploading", message });
        } else if (message.includes("Processing")) {
          setProgress({ stage: "processing", message });
        } else {
          setProgress({ stage: "initializing", message });
        }
      });
      
      console.log("useAnalyzeRegion: Analysis successful:", res);
      setResult(res);
      setProgress({ stage: "completed", message: "Analysis complete!" });
      return res;
    } catch (e: any) {
      console.error("useAnalyzeRegion: Analysis failed:", e);
      const errorMessage = e.message || "Something went wrong during analysis";
      setError(errorMessage);
      setProgress({ stage: "error", message: errorMessage });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setResult(null);
    setError(null);
    setProgress({ stage: "idle", message: "" });
  };

  return { run, loading, result, error, progress, reset };
}
