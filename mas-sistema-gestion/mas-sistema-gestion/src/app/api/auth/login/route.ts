import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUsuarioByEmail } from "@/lib/db";
import { createSessionCookie } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json().catch(() => ({}));

  if (!email || !password) {
    return NextResponse.json({ error: "Usuario y contraseña son obligatorios." }, { status: 400 });
  }

  const usuario = findUsuarioByEmail(String(email).toLowerCase().trim());

  if (!usuario || usuario.estado !== "activo") {
    return NextResponse.json({ error: "Usuario o contraseña incorrectos." }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, usuario.password_hash);
  if (!valid) {
    return NextResponse.json({ error: "Usuario o contraseña incorrectos." }, { status: 401 });
  }

  await createSessionCookie({
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
  });

  return NextResponse.json({
    ok: true,
    redirectTo: usuario.rol === "superadmin" ? "/panel" : "/pendientes",
  });
}
