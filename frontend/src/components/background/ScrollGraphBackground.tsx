import { useEffect, useMemo, useRef } from "react";

const W = 1000;
const H = 400;
const POINTS = 40;

function buildSeries(): [number, number][] {
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: POINTS }, (_, i) => {
    const t = i / (POINTS - 1);
    const trend = H * 0.88 - t * H * 0.68;
    const noise = (rnd() - 0.5) * H * 0.07;
    return [t * W, trend + noise];
  });
}

export function ScrollGraphBackground() {
  const pathRef = useRef<SVGPathElement>(null);
  const areaRef = useRef<SVGPathElement>(null);
  const dotRef  = useRef<SVGCircleElement>(null);
  const svgRef  = useRef<SVGSVGElement>(null);

  const { line, area } = useMemo(() => {
    const pts = buildSeries();
    const l = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    return { line: l, area: `${l} L${W},${H} L0,${H} Z` };
  }, []);

  useEffect(() => {
    const path = pathRef.current!;
    const total = path.getTotalLength();
    path.style.strokeDasharray = `${total}`;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = reduce ? 1 : max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;

      path.style.strokeDashoffset = `${total * (1 - p)}`;

      const head = path.getPointAtLength(total * p);
      dotRef.current?.setAttribute("cx", `${head.x}`);
      dotRef.current?.setAttribute("cy", `${head.y}`);

      if (areaRef.current) areaRef.current.style.clipPath = `inset(0 ${(1 - p) * 100}% 0 0)`;
      if (svgRef.current) svgRef.current.style.transform = `translateY(${-p * 40}px)`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-30 dark:opacity-40">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[70vh] w-full will-change-transform"
      >
        <defs>
          <linearGradient id="rr-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map((r) => (
          <line
            key={r}
            x1="0" x2={W} y1={H * r} y2={H * r}
            stroke="var(--border)"
            strokeWidth="1"
            strokeDasharray="4 8"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        <path ref={areaRef} d={area} fill="url(#rr-area)" />
        <path
          ref={pathRef}
          d={line}
          fill="none"
          stroke="var(--chart-1)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <circle ref={dotRef} r="6" fill="var(--chart-1)" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
