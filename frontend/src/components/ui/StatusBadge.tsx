const STATUS = {
  HEALTHY:    "bg-chart-2/15 text-chart-2 border-chart-2/40",
  DISTRESSED: "bg-chart-3/20 text-foreground border-chart-3/50",
  FAILED:     "bg-chart-4/15 text-chart-4 border-chart-4/40",
} as const;

export const StatusBadge = ({ s }: { s: keyof typeof STATUS }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS[s]}`}
  >
    <span className="size-1.5 rounded-full bg-current" />
    {s[0] + s.slice(1).toLowerCase()}
  </span>
);
