import { useState } from "react";
import { Reveal } from "../components/motion/Reveal";
import { StatusBadge } from "../components/ui/StatusBadge";
import { ArrowButton } from "../components/ui/ArrowButton";
import { Plus, Trash2, Network } from "lucide-react";

type Entity = { id: number; name: string; type: string; balance: number; status: "HEALTHY" | "DISTRESSED" | "FAILED" };
type Exposure = { id: number; from: string; to: string; amount: number };

const SAMPLE_ENTITIES: Entity[] = [
  { id: 1, name: "Apex Bank",    type: "LENDER",  balance: 50_00_000, status: "HEALTHY" },
  { id: 2, name: "CoreFin Ltd",  type: "BORROWER", balance: 12_00_000, status: "DISTRESSED" },
  { id: 3, name: "Vertex NBFC",  type: "LENDER",  balance: 30_00_000, status: "HEALTHY" },
];

const SAMPLE_EXPOSURES: Exposure[] = [
  { id: 1, from: "Apex Bank",   to: "CoreFin Ltd",  amount: 8_00_000 },
  { id: 2, from: "Vertex NBFC", to: "CoreFin Ltd",  amount: 5_00_000 },
];

const INR = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default function Networks() {
  const [entities]   = useState<Entity[]>(SAMPLE_ENTITIES);
  const [exposures]  = useState<Exposure[]>(SAMPLE_EXPOSURES);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-8">
      <Reveal dir="center">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground flex items-center gap-2">
              <Network className="size-7 text-primary" aria-hidden /> Network Builder
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Define entities and exposures to model contagion risk.</p>
          </div>
          <ArrowButton onClick={() => setShowForm(!showForm)}>
            <Plus className="size-4 mr-1.5" aria-hidden /> Add Entity
          </ArrowButton>
        </div>
      </Reveal>

      {/* Add entity form */}
      {showForm && (
        <Reveal dir="center">
          <div className="rounded-[var(--radius)] border bg-card shadow-card p-6">
            <h2 className="text-base font-medium mb-4">New Entity</h2>
            <div className="grid grid-cols-3 gap-4">
              {["Name", "Type", "Balance (₹)"].map((lbl) => (
                <div key={lbl}>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{lbl}</label>
                  <input
                    className="w-full rounded-[var(--radius)] border border-border bg-input px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-sidebar-ring"
                    placeholder={lbl}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <ArrowButton type="button">Save Entity</ArrowButton>
              <button onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-[var(--radius)] border border-border text-sm hover:bg-secondary cursor-pointer transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </Reveal>
      )}

      {/* Entities table */}
      <Reveal dir="left">
        <div className="rounded-[var(--radius)] border bg-card shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-base font-medium text-card-foreground">Entities <span className="text-muted-foreground font-normal">({entities.length})</span></h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                {["Name", "Type", "Balance", "Status", ""].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {entities.map((e) => (
                <tr key={e.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{e.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{e.type}</td>
                  <td className="px-6 py-4 font-mono tabular-nums">{INR.format(e.balance)}</td>
                  <td className="px-6 py-4"><StatusBadge s={e.status} /></td>
                  <td className="px-6 py-4">
                    <button className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer" aria-label={`Delete ${e.name}`}>
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      {/* Exposures table */}
      <Reveal dir="right">
        <div className="rounded-[var(--radius)] border bg-card shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-base font-medium text-card-foreground">Exposures <span className="text-muted-foreground font-normal">({exposures.length})</span></h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                {["From", "To", "Amount", ""].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {exposures.map((ex) => (
                <tr key={ex.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{ex.from}</td>
                  <td className="px-6 py-4 text-muted-foreground">{ex.to}</td>
                  <td className="px-6 py-4 font-mono tabular-nums">{INR.format(ex.amount)}</td>
                  <td className="px-6 py-4">
                    <button className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer" aria-label="Delete exposure">
                      <Trash2 className="size-4" />
                    </button>
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
