import { NextRequest, NextResponse } from "next/server";
import { setUsuarioEstado } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  if (user.rol !== "superadmin") return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  const { accion } = await req.json().catch(() => ({}));
  if (!["activar", "desactivar"].includes(accion)) {
    return NextResponse.json({ error: "Acción inválida." }, { status: 400 });
  }
  if (accion === "desactivar" && id === user.id) {
    return NextResponse.json({ error: "No podés desactivar tu propio usuario." }, { status: 400 });
  }

  setUsuarioEstado(id, accion === "activar" ? "activo" : "inactivo");

  return NextResponse.json({ ok: true });
}
