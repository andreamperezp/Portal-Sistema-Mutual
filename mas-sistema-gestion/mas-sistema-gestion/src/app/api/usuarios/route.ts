import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { listUsuarios, createUsuario, findUsuarioByEmail } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

async function requireSuperadmin() {
  const user = await getSessionUser();
  if (!user) return { error: NextResponse.json({ error: "No autenticado." }, { status: 401 }) };
  if (user.rol !== "superadmin") {
    return { error: NextResponse.json({ error: "No autorizado." }, { status: 403 }) };
  }
  return { user };
}

export async function GET() {
  const { error } = await requireSuperadmin();
  if (error) return error;

  return NextResponse.json({ usuarios: listUsuarios() });
}

export async function POST(req: NextRequest) {
  const { error } = await requireSuperadmin();
  if (error) return error;

  const { nombre, email, password, rol } = await req.json().catch(() => ({}));
  if (!nombre || !email || !password || !["administrador", "superadmin"].includes(rol)) {
    return NextResponse.json({ error: "Faltan datos o el rol no es válido." }, { status: 400 });
  }
  if (String(password).length < 8) {
    return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres." }, { status: 400 });
  }

  const emailNormalizado = String(email).toLowerCase().trim();
  if (findUsuarioByEmail(emailNormalizado)) {
    return NextResponse.json({ error: "Ya existe un usuario con ese email." }, { status: 409 });
  }

  const password_hash = await bcrypt.hash(password, 10);
  const usuario = createUsuario({ nombre, email: emailNormalizado, password_hash, rol });

  return NextResponse.json({ usuario });
}
