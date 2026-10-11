import { Reveal } from "../components/motion/Reveal";
import { StatusBadge } from "../components/ui/StatusBadge";
import { BarChart2, TrendingDown, Users, Layers } from "lucide-react";
import { formatINR } from "../lib/format";

const SUMMARY = [
  { label: "Total Loss",       value: formatINR(13_50_000), icon: TrendingDown, color: "text-chart-4" },
  { label: "Affected Entities", value: "4",                 icon: Users,        color: "text-chart-3" },
  { label: "Cascade Depth",     value: "3 rounds",          icon: Layers,       color: "text-chart-1" },
  { label: "Intervention Delta", value: "−₹ 4,20,000",      icon: BarChart2,    color: "text-chart-5" },
];

const ROUNDS = [
  { round: 1, failed: ["CoreFin Ltd"],       loss: 8_00_000 },
  { round: 2, failed: ["Apex NBFC"],         loss: 3_50_000 },
  { round: 3, failed: ["Meridian Finance"],  loss: 2_00_000 },
];

const INR = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default function Results() {
  return (
    <div className="space-y-8">
      <Reveal dir="center">
        <div>
          <h1 className="text-3xl font-semibold text-foreground flex items-center gap-2">
            <BarChart2 className="size-7 text-primary" aria-hidden /> Simulation Results
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Scenario: Base stress Q1 — ran 3 cascade rounds.</p>
        </div>
      </Reveal>

      {/* Summary cards */}
      <Reveal dir="center">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {SUMMARY.map(({ label, value, icon: Icon, color }) => (
            <article key={label} className="feature-card rounded-[var(--radius)] border bg-card p-5 shadow-card cursor-default">
              <Icon className={`feature-icon size-5 ${color}`} aria-hidden />
              <p className="mt-3 text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
              <p className="mt-1 text-2xl font-mono tabular-nums font-semibold text-card-foreground">{value}</p>
            </article>
          ))}
        </div>
      </Reveal>

      {/* Network graph placeholder */}
      <Reveal dir="left">
        <div className="rounded-[var(--radius)] border bg-card shadow-card p-6 h-64 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="mx-auto mb-3 grid grid-cols-3 gap-3 w-40">
              {["HEALTHY","DISTRESSED","FAILED","HEALTHY","FAILED","HEALTHY"].map((s,i) => (
                <div key={i} className={`size-8 rounded-full border-2 ${s==="HEALTHY"?"bg-chart-2/20 border-chart-2":s==="DISTRESSED"?"bg-chart-3/20 border-chart-3":"bg-chart-4/20 border-chart-4"}`} />
              ))}
            </div>
            <p className="text-sm">Network graph renders here</p>
            <p className="text-xs mt-1">Node colour = status · Edge width = exposure</p>
          </div>
        </div>
      </Reveal>

      {/* Round timeline */}
      <Reveal dir="right">
        <div className="rounded-[var(--radius)] border bg-card shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-base font-medium">Cascade Timeline</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                {["Round", "Failed Entities", "Loss (₹)", "Status"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ROUNDS.map((r) => (
                <tr key={r.round} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 font-mono tabular-nums">R{r.round}</td>
                  <td className="px-6 py-4">{r.failed.join(", ")}</td>
                  <td className="px-6 py-4 font-mono tabular-nums text-chart-4">{INR.format(r.loss)}</td>
                  <td className="px-6 py-4"><StatusBadge s="FAILED" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </div>
  );
}
