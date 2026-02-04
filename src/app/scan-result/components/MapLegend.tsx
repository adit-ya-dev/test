import { Card } from "@/components/ui/card";

const items = [
  { color: "#ef4444", label: "Deforestation" },
  { color: "#3b82f6", label: "Urban Expansion" },
  { color: "#f59e0b", label: "Encroachment" },
];

export default function MapLegend() {
  return (
    <Card className="absolute top-4 right-4 z-[500] w-44 border border-border bg-background/95 backdrop-blur px-4 py-3 shadow-md">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
        Legend
      </p>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded border border-border"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
