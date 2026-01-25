"use client";

export default function AnalyzeButton({
  loading,
  disabled,
  onClick,
}: {
  loading: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#071225] p-5 shadow-xl flex items-center justify-center">
      <button
        onClick={onClick}
        disabled={loading || disabled}
        className={`w-full rounded-xl px-4 py-3 text-sm font-black tracking-wide transition-all transform ${
          loading || disabled
            ? "bg-white/10 text-white/40 cursor-not-allowed scale-95"
            : "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 hover:scale-105 shadow-lg hover:shadow-xl"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            SCANNING...
          </span>
        ) : disabled ? (
          "SELECT AREA FIRST 📍"
        ) : (
          "ANALYZE REGION 🚀"
        )}
      </button>
    </div>
  );
}
