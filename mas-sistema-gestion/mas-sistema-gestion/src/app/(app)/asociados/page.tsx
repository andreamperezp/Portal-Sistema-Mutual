"use client";

import { useEffect, useMemo, useState } from "react";
import type { Asociado } from "@/lib/types";

const SEGMENTO_LABEL: Record<string, string> = { policia: "Policía", salud: "Salud", caja: "Caja" };
const ESTADO_LABEL: Record<string, string> = { activo: "Activo", pausado: "Pausado", inactivo: "Inactivo" };
const ESTADO_BADGE: Record<string, string> = {
  activo: "bg-teal text-white",
  pausado: "bg-brandyellow-pale text-[#a8690f]",
  inactivo: "bg-[#eef0ef] text-ink-gray",
};

export default function AsociadosPage() {
  const [asociados, setAsociados] = useState<Asociado[] | null>(null);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroSegmento, setFiltroSegmento] = useState("todos");
  const [busca, setBusca] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [pausaAbierta, setPausaAbierta] = useState<string | null>(null);
  const [motivoPausa, setMotivoPausa] = useState("");

  const [exportOpen, setExportOpen] = useState(false);
  const [expSeg, setExpSeg] = useState("todos");
  const [expEst, setExpEst] = useState("todos");
  const [expDesde, setExpDesde] = useState("");
  const [expHasta, setExpHasta] = useState("");
  const [exporting, setExporting] = useState(false);

  async function load() {
    const res = await fetch("/api/asociados");
    const data = await res.json();
    setAsociados(data.asociados ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  }

  const filtrados = useMemo(() => {
    return (asociados ?? []).filter((a) => {
      if (filtroEstado !== "todos" && a.estado !== filtroEstado) return false;
      if (filtroSegmento !== "todos" && a.segmento !== filtroSegmento) return false;
      if (busca && !`${a.nombre} ${a.dni}`.toLowerCase().includes(busca.toLowerCase())) return false;
      return true;
    });
  }, [asociados, filtroEstado, filtroSegmento, busca]);

  const previewCount = useMemo(() => {
    return (asociados ?? []).filter((a) => {
      if (expEst !== "todos" && a.estado !== expEst) return false;
      if (expSeg !== "todos" && a.segmento !== expSeg) return false;
      if (expDesde && a.fecha_alta < expDesde) return false;
      if (expHasta && a.fecha_alta > expHasta) return false;
      return true;
    }).length;
  }, [asociados, expSeg, expEst, expDesde, expHasta]);

  async function cambiarEstado(id: string, accion: "pausar" | "reactivar", motivo_pausa?: string) {
    setBusy(id);
    const res = await fetch(`/api/asociados/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accion, motivo_pausa }),
    });
    setBusy(null);
    if (res.ok) {
      showToast(accion === "pausar" ? "Asociado pausado." : "Asociado reactivado.");
      load();
    } else {
      const data = await res.json();
      showToast(data.error ?? "No se pudo actualizar.");
    }
  }

  function openExportModal() {
    setExpSeg(filtroSegmento);
    setExpEst(filtroEstado);
    setExpDesde("");
    setExpHasta("");
    setExportOpen(true);
  }

  async function confirmarExport() {
    setExporting(true);
    const res = await fetch("/api/asociados/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ segmento: expSeg, estado: expEst, desde: expDesde, hasta: expHasta }),
    });
    setExporting(false);
    if (!res.ok) {
      showToast("No se pudo exportar.");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "asociados_export.csv";
    a.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
    showToast(`Exportando ${previewCount} asociados.`);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-[26px] text-ink mb-1.5">Asociados</h1>
          <p className="text-ink-gray text-sm">Altas, pausas y bajas de la base de afiliados.</p>
        </div>
        <button
          onClick={openExportModal}
          className="bg-ink text-white rounded-lg px-4 py-2.5 text-sm font-bold self-start md:self-auto"
        >
          Exportar
        </button>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nombre o DNI…"
          className="border border-line rounded-lg px-3 py-2 text-sm outline-none focus:border-teal min-w-[200px]"
        />
        {["todos", "activo", "pausado", "inactivo"].map((e) => (
          <button
            key={e}
            onClick={() => setFiltroEstado(e)}
            className={`pill ${filtroEstado === e ? "active" : ""}`}
          >
            {e === "todos" ? "Todos" : ESTADO_LABEL[e]}
          </button>
        ))}
        <span className="w-px h-5 bg-line mx-1" />
        {["todos", "policia", "salud", "caja"].map((s) => (
          <button
            key={s}
            onClick={() => setFiltroSegmento(s)}
            className={`pill ${filtroSegmento === s ? "active" : ""}`}
          >
            {s === "todos" ? "Todos los segmentos" : SEGMENTO_LABEL[s]}
          </button>
        ))}
      </div>

      <div className="bg-white border border-line rounded-xl2 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-ink-gray text-xs uppercase tracking-wide">
              <th className="px-5 py-3 font-bold">Nombre</th>
              <th className="px-5 py-3 font-bold">DNI</th>
              <th className="px-5 py-3 font-bold">Segmento</th>
              <th className="px-5 py-3 font-bold">Estado</th>
              <th className="px-5 py-3 font-bold">Alta</th>
              <th className="px-5 py-3 font-bold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((a) => (
              <tr key={a.id} className="border-b border-line last:border-0">
                <td className="px-5 py-3.5 font-semibold text-ink">{a.nombre}</td>
                <td className="px-5 py-3.5 text-ink-gray">{a.dni}</td>
                <td className="px-5 py-3.5 text-ink-gray">{SEGMENTO_LABEL[a.segmento]}</td>
                <td className="px-5 py-3.5">
                  <span className={`badge ${ESTADO_BADGE[a.estado]}`}>{ESTADO_LABEL[a.estado]}</span>
                </td>
                <td className="px-5 py-3.5 text-ink-gray">{a.fecha_alta}</td>
                <td className="px-5 py-3.5 text-right">
                  {a.estado === "pausado" ? (
                    <button
                      disabled={busy === a.id}
                      onClick={() => cambiarEstado(a.id, "reactivar")}
                      className="text-teal-dark font-bold text-xs"
                    >
                      Reactivar
                    </button>
                  ) : a.estado === "activo" ? (
                    <button
                      disabled={busy === a.id}
                      onClick={() => setPausaAbierta(a.id)}
                      className="text-ink-gray font-bold text-xs"
                    >
                      Pausar
                    </button>
                  ) : (
                    <span className="text-ink-gray text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
            {asociados !== null && filtrados.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-ink-gray text-sm">
                  No hay asociados que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL PAUSAR */}
      {pausaAbierta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setPausaAbierta(null)} />
          <div className="relative bg-white rounded-xl2 p-6 w-full max-w-[420px] flex flex-col gap-4">
            <h2 className="font-display text-lg text-ink">Pausar asociado</h2>
            <textarea
              value={motivoPausa}
              onChange={(e) => setMotivoPausa(e.target.value)}
              placeholder="Motivo de la pausa (opcional)"
              className="border border-line rounded-lg p-3 text-sm outline-none focus:border-teal min-h-[90px]"
            />
            <div className="flex gap-2.5">
              <button
                onClick={() => setPausaAbierta(null)}
                className="flex-1 bg-bg text-ink-gray rounded-lg py-2.5 text-sm font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  cambiarEstado(pausaAbierta, "pausar", motivoPausa);
                  setPausaAbierta(null);
                  setMotivoPausa("");
                }}
                className="flex-1 bg-ink text-white rounded-lg py-2.5 text-sm font-bold"
              >
                Pausar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EXPORTAR */}
      {exportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setExportOpen(false)} />
          <div className="relative bg-white rounded-xl2 p-6 w-full max-w-[460px] flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <h2 className="font-display text-lg text-ink">Exportar asociados</h2>
              <button onClick={() => setExportOpen(false)} className="text-ink-gray text-xl leading-none">
                ×
              </button>
            </div>
            <p className="text-ink-gray text-[13px] -mt-3">Elegí qué asociados incluir en la exportación.</p>

            <div>
              <div className="text-xs font-bold text-ink mb-2">Segmento</div>
              <div className="flex gap-2 flex-wrap">
                {["todos", "policia", "salud", "caja"].map((s) => (
                  <button key={s} onClick={() => setExpSeg(s)} className={`pill ${expSeg === s ? "active" : ""}`}>
                    {s === "todos" ? "Todos" : SEGMENTO_LABEL[s]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-ink mb-2">Estado</div>
              <div className="flex gap-2 flex-wrap">
                {["todos", "activo", "pausado", "inactivo"].map((e) => (
                  <button key={e} onClick={() => setExpEst(e)} className={`pill ${expEst === e ? "active" : ""}`}>
                    {e === "todos" ? "Todos" : ESTADO_LABEL[e]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-ink mb-2">Rango de fechas</div>
              <div className="flex items-center gap-2.5">
                <input
                  type="date"
                  value={expDesde}
                  onChange={(e) => setExpDesde(e.target.value)}
                  className="flex-1 border border-line rounded-lg px-2.5 py-2 text-sm"
                />
                <span className="text-ink-gray text-xs">a</span>
                <input
                  type="date"
                  value={expHasta}
                  onChange={(e) => setExpHasta(e.target.value)}
                  className="flex-1 border border-line rounded-lg px-2.5 py-2 text-sm"
                />
              </div>
            </div>

            <p className="text-xs text-ink-gray">
              <b>{previewCount}</b> asociados coinciden con estos filtros.
            </p>

            <div className="flex gap-2.5">
              <button
                onClick={() => setExportOpen(false)}
                className="flex-1 bg-bg text-ink-gray rounded-lg py-2.5 text-sm font-bold"
              >
                Cancelar
              </button>
              <button
                disabled={exporting}
                onClick={confirmarExport}
                className="flex-1 bg-ink text-white rounded-lg py-2.5 text-sm font-bold disabled:opacity-60"
              >
                {exporting ? "Exportando…" : "Exportar"}
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
