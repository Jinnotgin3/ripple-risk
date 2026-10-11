import { Reveal } from "../components/motion/Reveal";
import { ShieldCheck } from "lucide-react";

type Event = { id: number; ts: string; user: string; action: string; entity: string; severity: "INFO" | "WARN" | "ERROR" };

const EVENTS: Event[] = [
  { id: 1, ts: "2026-10-11 14:32:01", user: "admin@ripplerisk.com", action: "RUN_SIMULATION",   entity: "Base Stress Q1",  severity: "INFO"  },
  { id: 2, ts: "2026-10-11 14:31:45", user: "admin@ripplerisk.com", action: "CREATE_SCENARIO",  entity: "Base Stress Q1",  severity: "INFO"  },
  { id: 3, ts: "2026-10-11 14:28:10", user: "admin@ripplerisk.com", action: "ADD_EXPOSURE",     entity: "Apex Bank→CoreFin", severity: "INFO"  },
  { id: 4, ts: "2026-10-11 14:27:55", user: "admin@ripplerisk.com", action: "ADD_ENTITY",       entity: "Vertex NBFC",     severity: "INFO"  },
  { id: 5, ts: "2026-10-11 14:27:32", user: "admin@ripplerisk.com", action: "ADD_ENTITY",       entity: "CoreFin Ltd",     severity: "WARN"  },
  { id: 6, ts: "2026-10-11 14:27:10", user: "admin@ripplerisk.com", action: "ADD_ENTITY",       entity: "Apex Bank",       severity: "INFO"  },
  { id: 7, ts: "2026-10-11 14:26:44", user: "admin@ripplerisk.com", action: "LOGIN",            entity: "—",               severity: "INFO"  },
  { id: 8, ts: "2026-10-11 13:55:01", user: "system",               action: "SCHEMA_MIGRATION", entity: "v1.2.0",          severity: "ERROR" },
];

const SEV = {
  INFO:  "bg-chart-2/15 text-chart-2 border-chart-2/40",
  WARN:  "bg-chart-3/20 text-foreground border-chart-3/50",
  ERROR: "bg-chart-4/15 text-chart-4 border-chart-4/40",
};

export default function Audit() {
  return (
    <div className="space-y-8">
      <Reveal dir="center">
        <div>
          <h1 className="text-3xl font-semibold text-foreground flex items-center gap-2">
            <ShieldCheck className="size-7 text-primary" aria-hidden /> Audit Log
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Immutable record of all system actions. Admin only.</p>
        </div>
      </Reveal>

      <Reveal dir="center">
        <div className="rounded-[var(--radius)] border bg-card shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-base font-medium">Events <span className="text-muted-foreground font-normal">({EVENTS.length})</span></h2>
            <span className="text-xs text-muted-foreground">Showing last 24h</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                {["Timestamp", "User", "Action", "Entity", "Severity"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {EVENTS.map((ev) => (
                <tr key={ev.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-3 font-mono tabular-nums text-xs text-muted-foreground whitespace-nowrap">{ev.ts}</td>
                  <td className="px-6 py-3 text-xs text-foreground">{ev.user}</td>
                  <td className="px-6 py-3 font-mono text-xs text-foreground">{ev.action}</td>
                  <td className="px-6 py-3 text-xs text-muted-foreground">{ev.entity}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${SEV[ev.severity]}`}>
                      <span className="size-1.5 rounded-full bg-current" />
                      {ev.severity}
                    </span>
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
