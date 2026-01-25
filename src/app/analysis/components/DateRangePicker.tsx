"use client";

export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
}: {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#071225] p-5 shadow-xl">
      <p className="text-xs uppercase tracking-widest text-white/40">
        Date Range
      </p>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-white/50">Start</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onChange(e.target.value, endDate)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <label className="text-xs text-white/50">End</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onChange(startDate, e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
          />
        </div>
      </div>
    </div>
  );
}
