import { NextRequest, NextResponse } from "next/server";
import { filterAsociados } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

// Genera un CSV real a partir de los filtros del modal de exportación
// (Segmento, Estado, rango de fechas) — un archivo descargable de verdad,
// generado en el momento a partir de los datos en memoria.
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });

  const { segmento, estado, desde, hasta } = await req.json().catch(() => ({}));
  const rows = filterAsociados({ segmento, estado, desde, hasta });

  const header = ["Nombre", "DNI", "Email", "Teléfono", "Segmento", "Estado", "Fecha de alta"];
  const csvLines = [
    header.join(","),
    ...rows.map((a) =>
      [a.nombre, a.dni, a.email ?? "", a.telefono ?? "", a.segmento, a.estado, a.fecha_alta]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    ),
  ];
  const csv = "﻿" + csvLines.join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="asociados_export.csv"`,
    },
  });
}
