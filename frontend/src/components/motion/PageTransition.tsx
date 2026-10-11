import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [shown, setShown] = useState({ key: location.key, node: children });
  const [phase, setPhase] = useState<"page-enter" | "page-exit">("page-enter");

  useEffect(() => {
    if (location.key === shown.key) {
      setShown({ key: location.key, node: children });
      return;
    }
    setPhase("page-exit");
    const t = setTimeout(() => {
      setShown({ key: location.key, node: children });
      setPhase("page-enter");
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key, children]);

  return <div className={phase}>{shown.node}</div>;
}
