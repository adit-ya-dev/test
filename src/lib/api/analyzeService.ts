import type { AOIRequest } from "@/types/geo";
import type { AnalyzeResponse } from "@/types/analysis";

export async function analyzeRegion(
  payload: AOIRequest,
): Promise<AnalyzeResponse> {
  try {
    console.log("Sending analyze request:", payload);
    
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("Response status:", res.status, res.statusText);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      
      // Provide more specific error messages
      if (res.status === 404) {
        throw new Error("Analysis endpoint not found. Please check API configuration.");
      } else if (res.status === 500) {
        throw new Error("Server error during analysis. Please try again.");
      } else if (res.status === 400) {
        throw new Error("Invalid request. Please check your AOI selection.");
      } else {
        throw new Error(errorText || `Analysis failed with status ${res.status}`);
      }
    }

    const data = await res.json();
    console.log("Analysis response:", data);
    return data;
    
  } catch (error) {
    console.error("Analyze request error:", error);
    
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Unknown error occurred during analysis");
    }
  }
}
