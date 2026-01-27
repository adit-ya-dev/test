export default function AlertsHeader({ total }: { total: number }) {
  return (
    <div className="py-6">
      {/* Main Heading: Bold, Black-weight, and White */}
      <h1 className="text-2xl font-black text-white tracking-tight italic uppercase">
        Alerts
      </h1>

      {/* Subheading: Small, Gray, matching the reference image style */}
      <p className="mt-1 text-sm font-medium text-zinc-500">
        Environmental Threat Records <span className="mx-1">•</span>
        Active alerts: <span className="text-zinc-400 font-bold">{total}</span>
      </p>
    </div>
  );
}
