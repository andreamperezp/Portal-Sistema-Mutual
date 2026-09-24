import { NextRequest, NextResponse } from "next/server";
import { setAsociadoEstado } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

// Nunca se borra un asociado: solo se pausa / reactiva / inactiva.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });

  const { accion, motivo_pausa } = await req.json().catch(() => ({}));
  const acciones: Record<string, { estado: "activo" | "pausado" | "inactivo" }> = {
    pausar: { estado: "pausado" },
    reactivar: { estado: "activo" },
    inactivar: { estado: "inactivo" },
  };
  const cambio = acciones[accion];
  if (!cambio) return NextResponse.json({ error: "Acción inválida." }, { status: 400 });

  setAsociadoEstado(id, cambio.estado, accion === "pausar" ? motivo_pausa ?? null : null);

  return NextResponse.json({ ok: true });
}
