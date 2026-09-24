import { NextResponse } from "next/server";
import { listAsociados, listSolicitudes, listUsuarios, recentUsuarios } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  if (user.rol !== "superadmin") return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  const asociados = listAsociados();
  const solicitudes = listSolicitudes();
  const usuarios = listUsuarios();

  const count = <T extends { estado: string }>(rows: T[], estado: string) =>
    rows.filter((r) => r.estado === estado).length;

  return NextResponse.json({
    asociadosActivos: count(asociados, "activo"),
    asociadosPausados: count(asociados, "pausado"),
    asociadosInactivos: count(asociados, "inactivo"),
    solicitudesPendientes: count(solicitudes, "pendiente"),
    rechazadasCount: count(solicitudes, "rechazado"),
    usuariosActivos: count(usuarios, "activo"),
    usuariosInactivos: count(usuarios, "inactivo"),
    recentUsers: recentUsuarios(3),
  });
}
