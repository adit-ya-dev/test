export default function DataLogsHeader({ total }: { total: number }) {
  return (
    <div className="py-6 border-b border-border/50 mb-6">
      <h1 className="text-2xl font-black text-foreground tracking-tight uppercase">
        Data Logs
      </h1>

      <p className="mt-1 text-sm font-bold text-muted-foreground uppercase tracking-wider">
        Job History Records <span className="mx-1 opacity-30">-</span>
        Total jobs saved: <span className="text-primary">{total}</span>
      </p>
    </div>
  );
}
