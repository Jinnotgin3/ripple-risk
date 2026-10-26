import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Reveal } from "../components/motion/Reveal";
import { ArrowButton } from "../components/ui/ArrowButton";
import { Sliders, Play, CheckCircle } from "lucide-react";
import { runCascadeSimulation, type Entity, type Exposure } from "../lib/simulation";

const SHOCK_TYPES = ["CREDIT_DEFAULT", "LIQUIDITY_CRUNCH", "MARKET_SHOCK", "REGULATORY_ACTION"];

export default function Scenarios() {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [form, setForm] = useState({
    name: "Base stress Q1",
    shockType: SHOCK_TYPES[0],
    magnitude: 0.35,
    recoveryRate: 0.15,
    threshold: 0.45,
    maxRounds: 8,
  });

  function handleChange(key: string, value: string | number) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleRunSimulation() {
    setIsRunning(true);

    // Retrieve custom entities/exposures from localStorage if user added any in Networks page
    let entities: Entity[] | undefined;
    let exposures: Exposure[] | undefined;
    try {
      const storedEnt = localStorage.getItem("rr_entities");
      if (storedEnt) entities = JSON.parse(storedEnt);
      const storedExp = localStorage.getItem("rr_exposures");
      if (storedExp) exposures = JSON.parse(storedExp);
    } catch {
      // fallback to defaults
    }

    const result = runCascadeSimulation(form, entities, exposures);
    localStorage.setItem("rr_simulation_result", JSON.stringify(result));

    setTimeout(() => {
      setIsRunning(false);
      navigate("/results");
    }, 400);
  }

  return (
    <div className="space-y-8">
      <Reveal dir="center">
        <div>
          <h1 className="text-3xl font-semibold text-foreground flex items-center gap-2">
            <Sliders className="size-7 text-primary" aria-hidden /> Scenario Config
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Configure shock parameters before running a simulation.</p>
        </div>
      </Reveal>

      <Reveal dir="center">
        <div className="rounded-[var(--radius)] border bg-card shadow-card p-6 max-w-2xl">
          <h2 className="text-base font-medium text-card-foreground mb-6">New Scenario</h2>
          <div className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="sc-name" className="block text-sm font-medium text-foreground mb-1.5">Scenario name</label>
              <input
                id="sc-name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full rounded-[var(--radius)] border border-border bg-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-ring"
                placeholder="e.g. Base stress Q1"
              />
            </div>
            {/* Shock type */}
            <div>
              <label htmlFor="shock-type" className="block text-sm font-medium text-foreground mb-1.5">Shock type</label>
              <select
                id="shock-type"
                value={form.shockType}
                onChange={(e) => handleChange("shockType", e.target.value)}
                className="w-full rounded-[var(--radius)] border border-border bg-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-ring cursor-pointer"
              >
                {SHOCK_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>

            {/* Sliders */}
            {[
              { key: "magnitude",    label: "Magnitude",     min: 0, max: 1, step: 0.01 },
              { key: "recoveryRate", label: "Recovery rate",  min: 0, max: 1, step: 0.01 },
              { key: "threshold",    label: "Failure threshold", min: 0, max: 1, step: 0.01 },
            ].map(({ key, label, min, max, step }) => (
              <div key={key}>
                <div className="flex justify-between mb-1.5">
                  <label className="text-sm font-medium text-foreground">{label}</label>
                  <span className="text-sm font-mono tabular-nums text-muted-foreground">
                    {(form[key as keyof typeof form] as number).toFixed(2)}
                  </span>
                </div>
                <input
                  type="range" min={min} max={max} step={step}
                  value={form[key as keyof typeof form] as number}
                  onChange={(e) => handleChange(key, parseFloat(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>
            ))}

            {/* Max rounds */}
            <div>
              <label htmlFor="max-rounds" className="block text-sm font-medium text-foreground mb-1.5">
                Max cascade rounds
              </label>
              <input
                id="max-rounds"
                type="number" min={1} max={50}
                value={form.maxRounds}
                onChange={(e) => handleChange("maxRounds", parseInt(e.target.value) || 1)}
                className="w-32 rounded-[var(--radius)] border border-border bg-input px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sidebar-ring"
              />
            </div>

            <div className="pt-2">
              <ArrowButton type="button" onClick={handleRunSimulation} disabled={isRunning}>
                {isRunning ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="size-4 animate-spin" /> Simulating Contagion...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Play className="size-4 fill-current" /> Run Simulation
                  </span>
                )}
              </ArrowButton>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
