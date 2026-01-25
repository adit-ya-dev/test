import type { BoundingBox } from "@/types/geo";
import type { AnalyzeResponse } from "@/types/analysis";

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
      <p className="text-xs uppercase tracking-widest text-white/40">
        Analysis Stats
      </p>

      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-white/60">AOI Selected</span>
          <span className="font-bold text-white">{bbox ? "YES" : "NO"}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-white/60">Status</span>
          <span className="font-bold text-white">
            {result?.status ?? "IDLE"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-white/60">Severity</span>
          <span className="font-black text-red-400">
            {result?.severity ?? "--"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-white/60">Mean NDVI</span>
          <span className="font-bold text-white">
            {result ? result.ndvi.mean.toFixed(2) : "--"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-white/60">Forest → Urban</span>
          <span className="font-bold text-white">
            {result
              ? `${result.transitions.forestToUrbanPercent.toFixed(1)}%`
              : "--"}
          </span>
        </div>

        {error && (
          <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-200">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
