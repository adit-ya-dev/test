"use client";

interface ScanResultHeaderProps {
  loading: boolean;
  error: string | null;
  onReload: () => void | Promise<void>; // flexible — works for both sync & async
}

export default function ScanResultHeader({
  loading,
  error,
  onReload,
}: ScanResultHeaderProps) {
  return (
    <div className="flex items-center justify-between py-4">
      {/* Left side – title + tags */}
      <div className="flex flex-col">
        {/* Primary Bold Heading */}
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-2xl">
          Scan Results
        </h1>

        {/* Minimalist Sub-heading with Bullet Points */}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/50 font-medium">
          <span>Sentinel Eye overview</span>
          <span className="text-white/20">•</span>
          <span>NDVI</span>
          <span className="text-white/20">•</span>
          <span>Encroachment</span>
          <span className="text-white/20">•</span>
          <span>Alerts</span>
        </div>

        {/* Show error message when present */}
        {error && (
          <p className="mt-2 text-sm text-red-400 font-medium">{error}</p>
        )}
      </div>

      {/* Right side – reload button */}
      <button
        onClick={onReload}
        disabled={loading}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
          transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
          ${
            loading
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }
        `}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
              />
            </svg>
            Reloading…
          </>
        ) : (
          "Reload Scan"
        )}
      </button>
    </div>
  );
}
