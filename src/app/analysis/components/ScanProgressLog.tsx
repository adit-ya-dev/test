import type { AnalyzeResponse } from "@/types/analysis";

const steps = [
  { id: 1, label: "AOI validated", icon: "📍" },
  { id: 2, label: "Satellite imagery fetched", icon: "🛰️" },
  { id: 3, label: "NDVI computed", icon: "🌿" },
  { id: 4, label: "Change detection executed", icon: "🔍" },
  { id: 5, label: "Report generated", icon: "📊" },
];

export default function ScanProgressLog({
  loading,
  result,
}: {
  loading: boolean;
  result: AnalyzeResponse | null;
}) {
  const getStepStatus = (stepId: number) => {
    if (loading && stepId <= 2) return "processing";
    if (loading && stepId === 3) return "processing";
    if (result && result.status === "COMPLETED") return "completed";
    if (result && result.status === "FAILED") return "error";
    return "pending";
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#071225] p-5 shadow-xl">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-white/40">
          Scan Progress
        </p>
        {(loading || result) && (
          <div className={`w-2 h-2 rounded-full ${
            loading ? "bg-blue-400 animate-pulse" :
            result?.status === "COMPLETED" ? "bg-green-400" :
            result?.status === "FAILED" ? "bg-red-400" :
            "bg-gray-400"
          }`} />
        )}
      </div>

      <div className="mt-4">
        {/* Progress Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            
            return (
              <div key={step.id} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                  status === "completed" ? "bg-green-500/20 text-green-400 border border-green-400/30" :
                  status === "processing" ? "bg-blue-500/20 text-blue-400 border border-blue-400/30 animate-pulse" :
                  status === "error" ? "bg-red-500/20 text-red-400 border border-red-400/30" :
                  "bg-white/5 text-white/40 border border-white/10"
                }`}>
                  {status === "completed" ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : status === "error" ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : status === "processing" ? (
                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    index + 1
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/70">{step.icon}</span>
                    <p className={`text-sm ${
                      status === "completed" ? "text-white/90" :
                      status === "processing" ? "text-white font-medium" :
                      status === "error" ? "text-red-400" :
                      "text-white/40"
                    }`}>
                      {step.label}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Status Messages */}
        {loading && (
          <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-blue-300 text-sm font-medium">Processing analysis...</span>
            </div>
          </div>
        )}

        {result && result.status === "COMPLETED" && (
          <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <span className="text-green-300 text-sm font-medium">Analysis Complete</span>
                <p className="text-green-400/70 text-xs mt-0.5">Scan ID: {result.scanId}</p>
              </div>
            </div>
          </div>
        )}

        {result && result.status === "FAILED" && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-300 text-sm font-medium">Analysis Failed</span>
            </div>
          </div>
        )}

        {/* Processing time */}
        {result && result.processingTimeMs && (
          <div className="mt-3 text-xs text-white/50 text-center">
            Processing time: {(result.processingTimeMs / 1000).toFixed(2)}s
          </div>
        )}
      </div>
    </div>
  );
}
