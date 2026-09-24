import { NextRequest, NextResponse } from "next/server";
import { findSolicitudById, updateSolicitud, createAsociado } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

// Aprobar o rechazar una solicitud. Al aprobar, se crea automáticamente el
// asociado correspondiente (alta).
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });

  const { accion, motivo_rechazo } = await req.json().catch(() => ({}));
  if (!["aprobar", "rechazar"].includes(accion)) {
    return NextResponse.json({ error: "Acción inválida." }, { status: 400 });
  }

  const solicitud = findSolicitudById(id);
  if (!solicitud) {
    return NextResponse.json({ error: "Solicitud no encontrada." }, { status: 404 });
  }
  if (solicitud.estado !== "pendiente") {
    return NextResponse.json({ error: "Esta solicitud ya fue revisada." }, { status: 409 });
  }

  if (accion === "aprobar") {
    createAsociado({
      nombre: solicitud.nombre,
      dni: solicitud.dni,
      email: solicitud.email,
      telefono: solicitud.telefono,
      segmento: solicitud.segmento,
      estado: "activo",
    });
  }

  updateSolicitud(id, {
    estado: accion === "aprobar" ? "aprobado" : "rechazado",
    motivo_rechazo: accion === "rechazar" ? motivo_rechazo ?? null : null,
    revisado_por: user.id,
    revisado_at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
