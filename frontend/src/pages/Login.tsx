import { useState } from "react";
import { ArrowButton } from "../components/ui/ArrowButton";
import { ScrollGraphBackground } from "../components/background/ScrollGraphBackground";
import { Activity, KeyRound } from "lucide-react";
import { setToken } from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@ripplerisk.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const { token } = await res.json();
        setToken(token);
        navigate("/networks");
        return;
      }

      // Demo fallback check
      if (email === "admin@ripplerisk.com" && password === "password") {
        setToken("demo-jwt-token-local");
        navigate("/networks");
        return;
      }

      throw new Error("Invalid credentials");
    } catch (err: unknown) {
      // Backend offline fallback for demo
      if (email === "admin@ripplerisk.com" && password === "password") {
        setToken("demo-jwt-token-local");
        navigate("/networks");
        return;
      }
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  function handleQuickDemoFill() {
    setEmail("admin@ripplerisk.com");
    setPassword("password");
    setError("");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
      <ScrollGraphBackground />
      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex items-center justify-center size-12 rounded-[var(--radius)] bg-primary text-primary-foreground shadow-card">
            <Activity className="size-6" aria-hidden />
          </div>
          <div className="text-center">
            <h1 className="hero-heading text-2xl font-semibold text-foreground">RippleRisk</h1>
            <p className="hero-sub mt-1 text-sm text-muted-foreground">Systemic risk simulation platform</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-[var(--radius)] border bg-card shadow-card p-6">
          <h2 className="text-base font-medium text-card-foreground mb-5">Sign in to your account</h2>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-[var(--radius)] border border-border bg-input px-3 py-2.5 text-sm text-foreground
                  placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-sidebar-ring transition-shadow duration-150"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Password
                </label>
                <a href="#" className="text-xs text-sidebar-primary hover:underline">Forgot password?</a>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-[var(--radius)] border border-border bg-input px-3 py-2.5 text-sm text-foreground
                  placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-sidebar-ring transition-shadow duration-150"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-[var(--radius)] px-3 py-2">
                {error}
              </p>
            )}
            <ArrowButton type="submit" disabled={loading} className="w-full justify-center">
              {loading ? "Signing in…" : "Sign in"}
            </ArrowButton>
          </form>

          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Quick test:</span>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline cursor-pointer"
            >
              <KeyRound className="size-3.5" /> Fill Demo Credentials
            </button>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Demo: admin@ripplerisk.com / password
        </p>
      </div>
    </div>
  );
}
