import type { AnalyzeResponse } from "@/types/analysis";

export default function ScanProgressLog({
  loading,
  result,
}: {
  loading: boolean;
  result: AnalyzeResponse | null;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#071225] p-5 shadow-xl">
      <p className="text-xs uppercase tracking-widest text-white/40">
        Scan Progress
      </p>

      <div className="mt-4 space-y-2 text-sm text-white/70">
        <p>• AOI validated</p>
        <p>• Satellite imagery fetched</p>
        <p>• NDVI computed</p>
        <p>• Change detection executed</p>
        <p>• Report generated</p>

        {loading && (
          <p className="text-blue-300 font-bold mt-3">Processing...</p>
        )}
        {result && (
          <p className="text-green-300 font-bold mt-3">
            Completed: {result.scanId}
          </p>
        )}
      </div>
    </div>
  );
}
