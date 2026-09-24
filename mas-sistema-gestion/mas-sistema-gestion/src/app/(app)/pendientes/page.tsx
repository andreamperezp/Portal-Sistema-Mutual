"use client";

import { useEffect, useState } from "react";
import type { Solicitud } from "@/lib/types";

const SEGMENTO_LABEL: Record<string, string> = { policia: "Policía", salud: "Salud", caja: "Caja" };

export default function PendientesPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [rechazoAbierto, setRechazoAbierto] = useState<string | null>(null);
  const [motivo, setMotivo] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/solicitudes");
    const data = await res.json();
    setSolicitudes(data.solicitudes ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  }

  async function aprobar(id: string) {
    setBusy(id);
    const res = await fetch(`/api/solicitudes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accion: "aprobar" }),
    });
    setBusy(null);
    if (res.ok) {
      showToast("Solicitud aprobada. Se dio de alta al asociado.");
      load();
    } else {
      const data = await res.json();
      showToast(data.error ?? "No se pudo aprobar.");
    }
  }

  async function confirmarRechazo() {
    if (!rechazoAbierto) return;
    setBusy(rechazoAbierto);
    const res = await fetch(`/api/solicitudes/${rechazoAbierto}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accion: "rechazar", motivo_rechazo: motivo }),
    });
    setBusy(null);
    setRechazoAbierto(null);
    setMotivo("");
    if (res.ok) {
      showToast("Solicitud rechazada.");
      load();
    } else {
      const data = await res.json();
      showToast(data.error ?? "No se pudo rechazar.");
    }
  }

  const pendientes = (solicitudes ?? []).filter((s) => s.estado === "pendiente");

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div>
        <h1 className="font-display text-2xl md:text-[26px] text-ink mb-1.5">Solicitudes pendientes</h1>
        <p className="text-ink-gray text-sm">Revisá y aprobá o rechazá cada solicitud de afiliación.</p>
      </div>

      {solicitudes === null && <p className="text-ink-gray text-sm">Cargando…</p>}
      {solicitudes !== null && pendientes.length === 0 && (
        <div className="bg-white border border-line rounded-xl2 p-6 text-sm text-ink-gray">
          No hay solicitudes pendientes por el momento.
        </div>
      )}

      <div className="flex flex-col gap-3">
        {pendientes.map((s) => (
          <div key={s.id} className="bg-white border border-line rounded-xl2 p-5 flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-bold text-[15px] text-ink">{s.nombre}</span>
                <span className="badge bg-brandyellow-pale text-[#a8690f]">{SEGMENTO_LABEL[s.segmento]}</span>
              </div>
              <p className="text-ink-gray text-xs">
                DNI {s.dni} · {s.email ?? "sin email"} · {s.telefono ?? "sin teléfono"}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                disabled={busy === s.id}
                onClick={() => aprobar(s.id)}
                className="bg-teal text-white rounded-lg px-4 py-2 text-sm font-bold disabled:opacity-60"
              >
                Aprobar
              </button>
              <button
                disabled={busy === s.id}
                onClick={() => setRechazoAbierto(s.id)}
                className="bg-bg border border-line text-ink-gray rounded-lg px-4 py-2 text-sm font-bold disabled:opacity-60"
              >
                Rechazar
              </button>
            </div>
          </div>
        ))}
      </div>

      {rechazoAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setRechazoAbierto(null)} />
          <div className="relative bg-white rounded-xl2 p-6 w-full max-w-[420px] flex flex-col gap-4">
            <h2 className="font-display text-lg text-ink">Rechazar solicitud</h2>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Motivo del rechazo (opcional)"
              className="border border-line rounded-lg p-3 text-sm outline-none focus:border-teal min-h-[90px]"
            />
            <div className="flex gap-2.5">
              <button
                onClick={() => setRechazoAbierto(null)}
                className="flex-1 bg-bg text-ink-gray rounded-lg py-2.5 text-sm font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarRechazo}
                className="flex-1 bg-ink text-white rounded-lg py-2.5 text-sm font-bold"
              >
                Rechazar
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-20 md:bottom-7 left-1/2 -translate-x-1/2 bg-ink text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
