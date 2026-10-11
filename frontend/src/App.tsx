import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { ScrollGraphBackground } from "./components/background/ScrollGraphBackground";
import { PageTransition } from "./components/motion/PageTransition";
import Login from "./pages/Login";
import Networks from "./pages/Networks";
import Scenarios from "./pages/Scenarios";
import Results from "./pages/Results";
import Compare from "./pages/Compare";
import Report from "./pages/Report";
import Audit from "./pages/Audit";
import {
  Network, Sliders, BarChart2, GitCompare, FileText, ShieldCheck, LogOut, Activity
} from "lucide-react";

const NAV = [
  { to: "/networks",  label: "Network Builder", icon: Network },
  { to: "/scenarios", label: "Scenarios",        icon: Sliders },
  { to: "/results",   label: "Results",          icon: BarChart2 },
  { to: "/compare",   label: "Compare",          icon: GitCompare },
  { to: "/report",    label: "Report",           icon: FileText },
  { to: "/audit",     label: "Audit Log",        icon: ShieldCheck },
];

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 border-r border-sidebar-border bg-sidebar flex flex-col z-20">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-sidebar-border">
        <Activity className="size-5 text-sidebar-primary" aria-hidden />
        <span className="text-lg font-semibold text-sidebar-foreground tracking-tight">RippleRisk</span>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-0.5" aria-label="Main navigation">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] text-sm font-medium cursor-pointer
               transition-colors duration-150
               ${isActive
                 ? "bg-sidebar-accent text-sidebar-accent-foreground"
                 : "text-sidebar-foreground hover:bg-sidebar-accent/50"
               }`
            }
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-sidebar-border">
        <button
          onClick={() => { localStorage.removeItem("rr_token"); window.location.href = "/login"; }}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[var(--radius)] text-sm
            text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive
            transition-colors duration-150 cursor-pointer"
        >
          <LogOut className="size-4 shrink-0" aria-hidden />
          Sign out
        </button>
      </div>
    </aside>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <ScrollGraphBackground />
      <Sidebar />
      <main className="ml-64 flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/networks" replace />} />
        <Route path="/networks"  element={<AppShell><Networks /></AppShell>} />
        <Route path="/scenarios" element={<AppShell><Scenarios /></AppShell>} />
        <Route path="/results"   element={<AppShell><Results /></AppShell>} />
        <Route path="/compare"   element={<AppShell><Compare /></AppShell>} />
        <Route path="/report"    element={<AppShell><Report /></AppShell>} />
        <Route path="/audit"     element={<AppShell><Audit /></AppShell>} />
      </Routes>
    </BrowserRouter>
  );
}
