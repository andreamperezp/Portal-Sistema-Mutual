"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Kpis {
  asociadosActivos: number;
  asociadosPausados: number;
  asociadosInactivos: number;
  solicitudesPendientes: number;
  rechazadasCount: number;
  usuariosActivos: number;
  usuariosInactivos: number;
  recentUsers: { id: string; nombre: string; email: string; rol: string; created_at: string }[];
}

export default function PanelPage() {
  const [kpis, setKpis] = useState<Kpis | null>(null);

  useEffect(() => {
    fetch("/api/panel/kpis")
      .then((r) => r.json())
      .then((data) => setKpis(data));
  }, []);

  return (
    <div className="flex flex-col gap-7 max-w-5xl">
      <div>
        <h1 className="font-display text-2xl md:text-[26px] text-ink mb-1.5">Panel</h1>
        <p className="text-ink-gray text-sm">Vista general del sistema · datos en tiempo real.</p>
      </div>

      {!kpis && <p className="text-ink-gray text-sm">Cargando…</p>}

      {kpis && (
        <>
          <div className="flex gap-4 flex-wrap">
            <KpiCard label="Asociados activos" value={kpis.asociadosActivos} sub={`${kpis.asociadosPausados} pausados · ${kpis.asociadosInactivos} en histórico`} />
            <KpiCard label="Solicitudes pendientes" value={kpis.solicitudesPendientes} sub="de revisión manual" />
            <KpiCard label="Usuarios del sistema" value={kpis.usuariosActivos} sub={`${kpis.usuariosInactivos} inactivos`} />
            <KpiCard label="Solicitudes rechazadas" value={kpis.rechazadasCount} sub="en seguimiento" />
          </div>

          <div>
            <h2 className="text-[15px] font-bold text-ink mb-3">Accesos rápidos</h2>
            <div className="flex gap-4 flex-wrap">
              <Link href="/asociados" className="flex-1 min-w-[220px] border border-line rounded-xl2 p-[18px] hover:border-teal-light hover:bg-teal-pale">
                <div className="font-bold text-sm text-ink">Ver Asociados</div>
                <div className="text-xs text-ink-gray">Gestionar altas, pausas y bajas</div>
              </Link>
              <Link href="/usuarios" className="flex-1 min-w-[220px] border border-line rounded-xl2 p-[18px] hover:border-teal-light hover:bg-teal-pale">
                <div className="font-bold text-sm text-ink">Gestionar Usuarios</div>
                <div className="text-xs text-ink-gray">Accesos y contraseñas del equipo</div>
              </Link>
              <Link href="/pendientes" className="flex-1 min-w-[220px] border border-line rounded-xl2 p-[18px] hover:border-teal-light hover:bg-teal-pale">
                <div className="font-bold text-sm text-ink">Revisar Solicitudes</div>
                <div className="text-xs text-ink-gray">{kpis.solicitudesPendientes} pendientes de revisión</div>
              </Link>
            </div>
          </div>

          <div className="bg-white border border-line rounded-xl2 p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[15px] font-bold text-ink">Usuarios creados recientemente</h2>
              <Link href="/usuarios" className="text-teal-dark text-xs font-bold">
                Ver todos →
              </Link>
            </div>
            <div className="flex flex-col">
              {kpis.recentUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between py-3 border-b border-line last:border-0">
                  <div>
                    <div className="text-[13.5px] font-bold text-ink">{u.nombre}</div>
                    <div className="text-xs text-ink-gray">{u.email}</div>
                  </div>
                  <span className={`badge ${u.rol === "superadmin" ? "bg-ink text-white" : "bg-[#eef0ef] text-ink-gray"}`}>
                    {u.rol === "superadmin" ? "Superadmin" : "Administrador"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function KpiCard({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <div className="bg-white border border-line rounded-xl2 p-5 flex flex-col gap-2 flex-1 min-w-[190px]">
      <div className="text-[28px] font-display text-ink">{value}</div>
      <div className="text-xs font-bold text-ink-gray">{label}</div>
      <div className="text-[11.5px] text-ink-gray">{sub}</div>
    </div>
  );
}
