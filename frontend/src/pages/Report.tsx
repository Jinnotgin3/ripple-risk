import { Reveal } from "../components/motion/Reveal";
import { ArrowButton } from "../components/ui/ArrowButton";
import { FileText, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { formatINR } from "../lib/format";

const PAGES = [
  {
    title: "Executive Summary",
    content: "Scenario 'Base Stress Q1' triggered a 3-round cascade affecting 4 entities with total loss of " + formatINR(13_50_000) + ". Intervention reduced systemic loss by 31%.",
  },
  {
    title: "Network Analysis",
    content: "The contagion originated from CoreFin Ltd (DISTRESSED) with ₹8,00,000 direct exposure to Apex Bank. Secondary propagation reached Vertex NBFC and Meridian Finance in rounds 2–3.",
  },
  {
    title: "Intervention Results",
    content: "Capital injection of ₹4,50,000 into CoreFin Ltd at round 1 prevented tertiary failures. Intervention delta: −₹4,20,000 loss reduction, cascade depth reduced from 3 to 2 rounds.",
  },
  {
    title: "Recommendations",
    content: "1. Maintain ≥15% liquidity buffer for tier-1 lenders. 2. Implement bilateral netting agreements between Apex Bank and Vertex NBFC. 3. Review CoreFin Ltd concentration risk quarterly.",
  },
];

export default function Report() {
  const [page, setPage] = useState(0);
  const current = PAGES[page];

  return (
    <div className="space-y-8">
      <Reveal dir="center">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground flex items-center gap-2">
              <FileText className="size-7 text-primary" aria-hidden /> Report
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Simulation report — Base Stress Q1</p>
          </div>
          <ArrowButton>
            <Download className="size-4 mr-1.5" aria-hidden /> Export PDF
          </ArrowButton>
        </div>
      </Reveal>

      {/* Page flip viewer */}
      <Reveal dir="center">
        <div className="rounded-[var(--radius)] border bg-card shadow-card overflow-hidden">
          {/* Progress tabs */}
          <div className="flex border-b border-border">
            {PAGES.map((p, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`flex-1 px-4 py-3 text-xs font-medium transition-colors cursor-pointer
                  ${i === page ? "bg-sidebar-accent text-sidebar-accent-foreground border-b-2 border-primary" : "text-muted-foreground hover:bg-secondary/50"}`}
              >
                {i + 1}. {p.title}
              </button>
            ))}
          </div>

          {/* Page content */}
          <div className="p-8 min-h-48">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">{current.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{current.content}</p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-secondary/30">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40 cursor-pointer transition-colors"
            >
              <ChevronLeft className="size-4" aria-hidden /> Previous
            </button>
            <span className="text-xs text-muted-foreground font-mono">{page + 1} / {PAGES.length}</span>
            <button
              onClick={() => setPage((p) => Math.min(PAGES.length - 1, p + 1))}
              disabled={page === PAGES.length - 1}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40 cursor-pointer transition-colors"
            >
              Next <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
