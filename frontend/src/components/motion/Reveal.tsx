import { useEffect, useRef, type ReactNode } from "react";

type Dir = "left" | "right" | "center";

export function Reveal({
  dir = "center",
  children,
  className = "",
}: {
  dir?: Dir;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-dir={dir} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
