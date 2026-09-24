import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Corre en el Edge Runtime: no puede usar bcrypt ni el cliente de Supabase,
// solo valida la cookie de sesión (JWT) y aplica el control de acceso por rol.
const COOKIE_NAME = "mas_session";
const SUPERADMIN_ONLY = ["/panel", "/usuarios"];
const PROTECTED = ["/pendientes", "/asociados", "/panel", "/usuarios"];

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("Falta SESSION_SECRET");
  return new TextEncoder().encode(secret);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const rol = payload.rol as string;

    const requiresSuperadmin = SUPERADMIN_ONLY.some((p) => pathname.startsWith(p));
    if (requiresSuperadmin && rol !== "superadmin") {
      return NextResponse.redirect(new URL("/pendientes", req.url));
    }
    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete(COOKIE_NAME);
    return res;
  }
}

export const config = {
  matcher: ["/pendientes/:path*", "/asociados/:path*", "/panel/:path*", "/usuarios/:path*"],
};
