import type { BoundingBox } from "@/types/geo";
import type { AnalyzeResponse } from "@/types/analysis";

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "CRITICAL": return "text-red-400";
    case "WARNING": return "text-orange-400";
    case "MODERATE": return "text-yellow-400";
    case "LOW": return "text-green-400";
    default: return "text-gray-400";
  }
};

const getHealthColor = (health: string) => {
  switch (health) {
    case "EXCELLENT": return "text-green-400";
    case "GOOD": return "text-lime-400";
    case "MODERATE": return "text-yellow-400";
    case "POOR": return "text-orange-400";
    case "CRITICAL": return "text-red-400";
    default: return "text-gray-400";
  }
};

export default function AnalysisStatsPanel({
  bbox,
  result,
  error,
}: {
  bbox: BoundingBox | null;
  result: AnalyzeResponse | null;
  error: string | null;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#071225] p-5 shadow-xl">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-white/40">
          Analysis Stats
        </p>
        {result && (
          <div className={`w-2 h-2 rounded-full ${
            result.status === "COMPLETED" ? "bg-green-400 animate-pulse" :
            result.status === "PROCESSING" ? "bg-blue-400 animate-pulse" :
            "bg-red-400"
          }`} />
        )}
      </div>

      <div className="mt-4 space-y-4">
        {/* AOI Status */}
        <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10">
          <span className="text-white/60 text-sm">AOI Status</span>
          <span className={`font-bold text-sm ${bbox ? "text-green-400" : "text-red-400"}`}>
            {bbox ? "✓ Selected" : "✗ None"}
          </span>
        </div>

        {/* Processing Status */}
        <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10">
          <span className="text-white/60 text-sm">Status</span>
          <span className="font-bold text-sm text-white">
            {result?.status ?? "IDLE"}
          </span>
        </div>

        {/* Severity Level */}
        <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10">
          <span className="text-white/60 text-sm">Severity</span>
          <span className={`font-black text-sm ${result ? getSeverityColor(result.severity) : "text-gray-400"}`}>
            {result?.severity ?? "--"}
          </span>
        </div>

        {/* NDVI Stats */}
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/60 text-sm">Mean NDVI</span>
            <span className="font-bold text-sm text-white">
              {result ? result.ndvi.mean.toFixed(3) : "--"}
            </span>
          </div>
          {result && (
            <div className="text-xs text-white/50">
              Min: {result.ndvi.min.toFixed(3)} | Max: {result.ndvi.max.toFixed(3)}
            </div>
          )}
        </div>

        {/* Health Status */}
        {result && (
          <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10">
            <span className="text-white/60 text-sm">Vegetation Health</span>
            <span className={`font-bold text-sm ${getHealthColor(result.ndvi.healthStatus)}`}>
              {result.ndvi.healthStatus}
            </span>
          </div>
        )}

        {/* Land Use Changes */}
        {result && (
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Forest → Urban</span>
              <span className="font-bold text-sm text-orange-400">
                {result.transitions.forestToUrbanPercent.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Water → Land</span>
              <span className="font-bold text-sm text-blue-400">
                {result.transitions.waterToLandPercent.toFixed(1)}%
              </span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-red-200 text-sm font-medium">Error</p>
                <p className="text-red-300 text-xs mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success State */}
        {result && result.status === "COMPLETED" && !error && (
          <div className="mt-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-green-200 text-sm font-medium">Analysis Complete</p>
                <p className="text-green-300 text-xs mt-1">Scan ID: {result.scanId}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
