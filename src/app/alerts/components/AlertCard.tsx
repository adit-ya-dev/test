import type { Alert } from "@/types/alert";

export default function AlertCard({ alert }: { alert: Alert }) {
  return (
    <div className="glass-card rounded-2xl p-5 shadow-xl border border-white/10">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white">{alert.title}</h3>
        <span
          className={[
            "px-3 py-1 rounded-full text-xs font-bold",
            alert.severity === "CRITICAL"
              ? "bg-red-500/20 text-red-200"
              : alert.severity === "WARNING"
                ? "bg-yellow-500/20 text-yellow-200"
                : "bg-green-500/20 text-green-200",
          ].join(" ")}
        >
          {alert.severity}
        </span>
      </div>

      <p className="mt-2 text-sm text-white/70">{alert.description}</p>

      <p className="mt-2 text-xs text-white/40">Region: {alert.regionName}</p>

      <ul className="mt-3 list-disc list-inside text-xs text-white/60">
        {alert.recommendation.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    </div>
  );
}
