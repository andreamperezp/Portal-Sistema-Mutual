import { NextResponse } from "next/server";
import { listSolicitudes } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });

  return NextResponse.json({ solicitudes: listSolicitudes() });
}
