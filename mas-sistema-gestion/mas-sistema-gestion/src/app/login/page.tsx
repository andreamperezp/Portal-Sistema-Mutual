"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No se pudo iniciar sesión.");
        setLoading(false);
        return;
      }
      router.push(data.redirectTo ?? "/pendientes");
      router.refresh();
    } catch {
      setError("No se pudo conectar con el servidor.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-[420px] bg-white border border-line rounded-xl2 p-8 flex flex-col gap-6 shadow-sm">
        <div>
          <h1 className="font-display text-2xl text-ink mb-1">MAS Backoffice</h1>
          <p className="text-ink-gray text-sm">Gestión de afiliaciones de Mutual Argentina Solidaria.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ink">Usuario</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-line rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal"
              placeholder="tu.email@mas.org.ar"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ink">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-line rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-brandred-pale text-brandred text-sm rounded-lg px-3 py-2.5">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-ink text-white rounded-lg py-2.5 text-sm font-bold disabled:opacity-60"
          >
            {loading ? "Ingresando…" : "Ingresar"}
          </button>
        </form>

        <div className="flex flex-col gap-1 bg-teal-pale border border-teal-light rounded-lg px-3.5 py-3">
          <span className="text-[11.5px] font-bold text-teal-dark uppercase tracking-wide">
            Credenciales de prueba
          </span>
          <span className="text-xs text-ink">Superadmin: superadmin@mas.org.ar / mas2026</span>
          <span className="text-xs text-ink">Administrador: admin@mas.org.ar / mas2026</span>
        </div>
      </div>
    </div>
  );
}
