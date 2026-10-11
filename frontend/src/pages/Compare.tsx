import { Reveal } from "../components/motion/Reveal";
import { GitCompare } from "lucide-react";
import { formatINR } from "../lib/format";

const BASELINE    = { loss: 13_50_000, failed: 4, depth: 3 };
const INTERVENTION = { loss: 9_30_000,  failed: 2, depth: 2 };

function DeltaChip({ base, inter }: { base: number; inter: number }) {
  const delta = inter - base;
  const pct   = ((delta / base) * 100).toFixed(1);
  const good  = delta < 0;
  return (
    <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${good ? "bg-chart-2/15 text-chart-2 border-chart-2/40" : "bg-chart-4/15 text-chart-4 border-chart-4/40"}`}>
      {good ? "↓" : "↑"} {Math.abs(parseFloat(pct))}%
    </span>
  );
}

const METRICS = [
  { label: "Total Loss",       fmt: (v: number) => formatINR(v),  bKey: "loss"   as const },
  { label: "Entities Failed",  fmt: (v: number) => String(v),      bKey: "failed" as const },
  { label: "Cascade Depth",    fmt: (v: number) => `${v} rounds`,  bKey: "depth"  as const },
];

export default function Compare() {
  return (
    <div className="space-y-8">
      <Reveal dir="center">
        <div>
          <h1 className="text-3xl font-semibold text-foreground flex items-center gap-2">
            <GitCompare className="size-7 text-primary" aria-hidden /> Compare
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Baseline vs. intervention side-by-side.</p>
        </div>
      </Reveal>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Baseline */}
        <Reveal dir="left">
          <div className="rounded-[var(--radius)] border bg-card shadow-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="size-2.5 rounded-full bg-chart-1" />
              <h2 className="text-base font-medium">Baseline</h2>
            </div>
            <div className="space-y-4">
              {METRICS.map(({ label, fmt, bKey }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="font-mono tabular-nums text-sm font-medium">{fmt(BASELINE[bKey])}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Intervention */}
        <Reveal dir="right">
          <div className="rounded-[var(--radius)] border border-chart-5/40 bg-card shadow-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="size-2.5 rounded-full bg-chart-5" />
              <h2 className="text-base font-medium">With Intervention</h2>
            </div>
            <div className="space-y-4">
              {METRICS.map(({ label, fmt, bKey }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono tabular-nums text-sm font-medium">{fmt(INTERVENTION[bKey])}</span>
                    <DeltaChip base={BASELINE[bKey]} inter={INTERVENTION[bKey]} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Chart placeholder */}
      <Reveal dir="center">
        <div className="rounded-[var(--radius)] border bg-card shadow-card p-6 h-48 flex items-center justify-center">
          <div className="text-center text-muted-foreground text-sm">
            <div className="flex items-end gap-1 justify-center mb-3 h-16">
              {[80,60,90,50,70,40,55,35].map((h,i) => (
                <div key={i} style={{ height: `${h}%` }}
                  className={`w-5 rounded-sm ${i%2===0?"bg-chart-1/60":"bg-chart-5/60"}`} />
              ))}
            </div>
            <p>Series chart: baseline (blue) vs intervention (purple)</p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
