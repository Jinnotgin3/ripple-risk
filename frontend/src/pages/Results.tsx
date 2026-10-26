import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "../components/motion/Reveal";
import { StatusBadge } from "../components/ui/StatusBadge";
import { ArrowButton } from "../components/ui/ArrowButton";
import { BarChart2, TrendingDown, Users, Layers, ShieldCheck, RefreshCw, Network } from "lucide-react";
import { formatINR } from "../lib/format";
import { getStoredSimulation, type SimulationResult, DEFAULT_EXPOSURES } from "../lib/simulation";

export default function Results() {
  const [result, setResult] = useState<SimulationResult>(getStoredSimulation);

  useEffect(() => {
    setResult(getStoredSimulation());
  }, []);

  const summaryCards = [
    {
      label: "Total Loss",
      value: formatINR(result.totalLoss),
      icon: TrendingDown,
      color: "text-chart-4",
      sub: `${result.shockType.replace(/_/g, " ")}`,
    },
    {
      label: "Affected Entities",
      value: `${result.affectedCount}`,
      icon: Users,
      color: "text-chart-3",
      sub: `Out of ${Object.keys(result.entityStates).length} counterparties`,
    },
    {
      label: "Cascade Depth",
      value: `${result.cascadeDepth} rounds`,
      icon: Layers,
      color: "text-chart-1",
      sub: "Contagion termination round",
    },
    {
      label: "Intervention Buffer",
      value: `−${formatINR(result.interventionDelta)}`,
      icon: ShieldCheck,
      color: "text-chart-2",
      sub: "Estimated policy mitigation",
    },
  ];

  // Node positions for network graph
  const nodePositions = [
    { name: "Apex Bank", x: 120, y: 80 },
    { name: "CoreFin Ltd", x: 300, y: 150 },
    { name: "Vertex NBFC", x: 140, y: 220 },
    { name: "Meridian Finance", x: 480, y: 100 },
    { name: "Indus Trust", x: 460, y: 230 },
  ];

  return (
    <div className="space-y-8">
      <Reveal dir="center">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-foreground flex items-center gap-2">
              <BarChart2 className="size-7 text-primary" aria-hidden /> Simulation Results
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Scenario: <strong className="text-foreground">{result.scenarioName}</strong> ({result.shockType}) — simulated {result.cascadeDepth} cascade rounds.
            </p>
          </div>
          <Link to="/scenarios">
            <ArrowButton type="button">
              <RefreshCw className="size-4 mr-1.5" /> Adjust Parameters
            </ArrowButton>
          </Link>
        </div>
      </Reveal>

      {/* Summary cards */}
      <Reveal dir="center">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map(({ label, value, icon: Icon, color, sub }) => (
            <article key={label} className="feature-card rounded-[var(--radius)] border bg-card p-5 shadow-card cursor-default">
              <Icon className={`feature-icon size-5 ${color}`} aria-hidden />
              <p className="mt-3 text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
              <p className="mt-1 text-2xl font-mono tabular-nums font-semibold text-card-foreground">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
            </article>
          ))}
        </div>
      </Reveal>

      {/* Network Graph */}
      <Reveal dir="left">
        <div className="rounded-[var(--radius)] border bg-card shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-medium flex items-center gap-2">
                <Network className="size-4 text-primary" /> Contagion Propagation Graph
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Real-time node status post-shock: Green = Healthy, Amber = Distressed, Red = Failed
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-chart-2 inline-block" /> Healthy</span>
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-chart-3 inline-block" /> Distressed</span>
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-chart-4 inline-block" /> Failed</span>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <svg viewBox="0 0 600 300" className="w-full max-h-72 bg-secondary/20 rounded-[var(--radius)] border border-border">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--muted-foreground)" opacity="0.6" />
                </marker>
              </defs>

              {/* Exposure Edges */}
              {DEFAULT_EXPOSURES.map((exp, i) => {
                const src = nodePositions.find((n) => n.name === exp.from) || { x: 100, y: 100 };
                const dst = nodePositions.find((n) => n.name === exp.to) || { x: 200, y: 200 };
                return (
                  <g key={i}>
                    <line
                      x1={src.x}
                      y1={src.y}
                      x2={dst.x}
                      y2={dst.y}
                      stroke="var(--border)"
                      strokeWidth={Math.max(1.5, Math.min(5, exp.amount / 300000))}
                      strokeDasharray={exp.amount > 1000000 ? "none" : "4 2"}
                      markerEnd="url(#arrow)"
                      opacity="0.8"
                    />
                    <text
                      x={(src.x + dst.x) / 2}
                      y={(src.y + dst.y) / 2 - 6}
                      fill="var(--muted-foreground)"
                      fontSize="9"
                      fontFamily="var(--font-mono)"
                      textAnchor="middle"
                    >
                      {formatINR(exp.amount)}
                    </text>
                  </g>
                );
              })}

              {/* Entity Nodes */}
              {nodePositions.map((node) => {
                const state = result.entityStates[node.name] || { status: "HEALTHY", loss: 0 };
                const fill =
                  state.status === "FAILED"
                    ? "var(--chart-4)"
                    : state.status === "DISTRESSED"
                    ? "var(--chart-3)"
                    : "var(--chart-2)";

                return (
                  <g key={node.name} className="cursor-pointer transition-transform hover:scale-105">
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="18"
                      fill={fill}
                      fillOpacity="0.2"
                      stroke={fill}
                      strokeWidth="2.5"
                    />
                    <circle cx={node.x} cy={node.y} r="6" fill={fill} />
                    <text
                      x={node.x}
                      y={node.y + 30}
                      fontSize="11"
                      fontWeight="500"
                      fill="var(--foreground)"
                      textAnchor="middle"
                    >
                      {node.name}
                    </text>
                    <text
                      x={node.x}
                      y={node.y + 42}
                      fontSize="9"
                      fontFamily="var(--font-mono)"
                      fill="var(--muted-foreground)"
                      textAnchor="middle"
                    >
                      {state.status}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </Reveal>

      {/* Round timeline */}
      <Reveal dir="right">
        <div className="rounded-[var(--radius)] border bg-card shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex justify-between items-center">
            <h2 className="text-base font-medium">Cascade Timeline</h2>
            <span className="text-xs font-mono text-muted-foreground">{result.rounds.length} contagion stages</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                {["Round", "Failed Entities", "Loss Incurred", "Status"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {result.rounds.map((r) => (
                <tr key={r.round} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 font-mono tabular-nums font-semibold">Stage {r.round}</td>
                  <td className="px-6 py-4">
                    {r.failed.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {r.failed.map((f) => (
                          <span key={f} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-chart-4/15 text-chart-4 border border-chart-4/30">
                            {f}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs italic">Equilibrium reached (absorption)</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono tabular-nums text-chart-4 font-medium">
                    {formatINR(r.loss)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge s={r.failed.length > 0 ? "FAILED" : "DISTRESSED"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </div>
  );
}
