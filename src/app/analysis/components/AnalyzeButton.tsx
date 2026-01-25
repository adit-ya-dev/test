"use client";

export default function AnalyzeButton({
  loading,
  onClick,
}: {
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#071225] p-5 shadow-xl flex items-center justify-center">
      <button
        onClick={onClick}
        disabled={loading}
        className={`w-full rounded-xl px-4 py-3 text-sm font-black tracking-wide transition ${
          loading
            ? "bg-white/10 text-white/40 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-500"
        }`}
      >
        {loading ? "SCANNING..." : "ANALYZE REGION 🚀"}
      </button>
    </div>
  );
}
