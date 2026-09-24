"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { SessionUser } from "@/lib/types";

const NAV = [
  { href: "/panel", label: "Panel", superadminOnly: true },
  { href: "/pendientes", label: "Solicitudes", superadminOnly: false },
  { href: "/asociados", label: "Asociados", superadminOnly: false },
  { href: "/usuarios", label: "Usuarios", superadminOnly: true },
];

export default function Sidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const items = NAV.filter((item) => !item.superadminOnly || user.rol === "superadmin");
  const initials = user.nombre
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <>
      {/* Sidebar de escritorio */}
      <div className="hidden md:flex w-[236px] shrink-0 min-h-screen bg-ink flex-col justify-between p-5">
        <div className="flex flex-col gap-7">
          <div className="text-white font-display text-lg px-1.5">MAS</div>
          <nav className="flex flex-col gap-1">
            {items.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2.5 rounded-lg text-sm font-semibold ${
                    active ? "bg-white/15 text-white" : "text-white/70 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex flex-col gap-3.5">
          <div className="h-px bg-white/10" />
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center font-bold text-xs">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="text-white text-[13.5px] font-bold truncate">{user.nombre}</div>
              <div className="text-white/55 text-xs truncate">{user.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/70 hover:text-white text-sm font-semibold text-left"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Nav inferior mobile */}
      <div className="md:hidden fixed bottom-0 inset-x-0 flex bg-ink border-t border-white/10 z-40">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[10.5px] font-semibold ${
                active ? "text-white" : "text-white/60"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex-1 flex flex-col items-center gap-1 py-2.5 text-[10.5px] font-semibold text-white/60"
        >
          Salir
        </button>
      </div>
    </>
  );
}
