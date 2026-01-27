import AlertCard from "./AlertCard";
import type { Alert } from "@/types/alert";
import { ShieldCheck } from "lucide-react";

export default function AlertsList({ alerts }: { alerts: Alert[] }) {
  if (!Array.isArray(alerts) || alerts.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 text-white/60 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-green-400" />
        No active alerts
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {alerts.map((a) => (
        <AlertCard key={a.id} alert={a} />
      ))}
    </div>
  );
}
