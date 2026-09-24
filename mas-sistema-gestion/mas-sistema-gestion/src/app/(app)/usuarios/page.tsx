"use client";

import { useEffect, useState } from "react";
import type { Usuario } from "@/lib/types";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [nuevoOpen, setNuevoOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState<"administrador" | "superadmin">("administrador");
  const [creando, setCreando] = useState(false);
  const [errorForm, setErrorForm] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/usuarios");
    const data = await res.json();
    setUsuarios(data.usuarios ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  }

  async function toggleEstado(id: string, accion: "activar" | "desactivar") {
    setBusy(id);
    const res = await fetch(`/api/usuarios/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accion }),
    });
    setBusy(null);
    if (res.ok) {
      showToast(accion === "activar" ? "Usuario activado." : "Usuario desactivado.");
      load();
    } else {
      const data = await res.json();
      showToast(data.error ?? "No se pudo actualizar.");
    }
  }

  async function crearUsuario(e: React.FormEvent) {
    e.preventDefault();
    setErrorForm(null);
    setCreando(true);
    const res = await fetch("/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password, rol }),
    });
    setCreando(false);
    const data = await res.json();
    if (!res.ok) {
      setErrorForm(data.error ?? "No se pudo crear el usuario.");
      return;
    }
    setNuevoOpen(false);
    setNombre("");
    setEmail("");
    setPassword("");
    setRol("administrador");
    showToast("Usuario creado.");
    load();
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-[26px] text-ink mb-1.5">Usuarios</h1>
          <p className="text-ink-gray text-sm">Accesos y roles del equipo administrativo.</p>
        </div>
        <button
          onClick={() => setNuevoOpen(true)}
          className="bg-ink text-white rounded-lg px-4 py-2.5 text-sm font-bold self-start md:self-auto"
        >
          Nuevo usuario
        </button>
      </div>

      <div className="bg-white border border-line rounded-xl2 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-ink-gray text-xs uppercase tracking-wide">
              <th className="px-5 py-3 font-bold">Nombre</th>
              <th className="px-5 py-3 font-bold">Email</th>
              <th className="px-5 py-3 font-bold">Rol</th>
              <th className="px-5 py-3 font-bold">Estado</th>
              <th className="px-5 py-3 font-bold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(usuarios ?? []).map((u) => (
              <tr key={u.id} className="border-b border-line last:border-0">
                <td className="px-5 py-3.5 font-semibold text-ink">{u.nombre}</td>
                <td className="px-5 py-3.5 text-ink-gray">{u.email}</td>
                <td className="px-5 py-3.5">
                  <span className={`badge ${u.rol === "superadmin" ? "bg-ink text-white" : "bg-[#eef0ef] text-ink-gray"}`}>
                    {u.rol === "superadmin" ? "Superadmin" : "Administrador"}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`badge ${u.estado === "activo" ? "bg-teal text-white" : "bg-[#eef0ef] text-ink-gray"}`}>
                    {u.estado === "activo" ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    disabled={busy === u.id}
                    onClick={() => toggleEstado(u.id, u.estado === "activo" ? "desactivar" : "activar")}
                    className="text-ink-gray font-bold text-xs"
                  >
                    {u.estado === "activo" ? "Desactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {nuevoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setNuevoOpen(false)} />
          <form
            onSubmit={crearUsuario}
            className="relative bg-white rounded-xl2 p-6 w-full max-w-[420px] flex flex-col gap-4"
          >
            <h2 className="font-display text-lg text-ink">Nuevo usuario</h2>
            <input
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre completo"
              className="border border-line rounded-lg px-3 py-2.5 text-sm"
            />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="border border-line rounded-lg px-3 py-2.5 text-sm"
            />
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña (mín. 8 caracteres)"
              className="border border-line rounded-lg px-3 py-2.5 text-sm"
            />
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value as "administrador" | "superadmin")}
              className="border border-line rounded-lg px-3 py-2.5 text-sm"
            >
              <option value="administrador">Administrador</option>
              <option value="superadmin">Superadmin</option>
            </select>

            {errorForm && <div className="bg-brandred-pale text-brandred text-sm rounded-lg px-3 py-2.5">{errorForm}</div>}

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setNuevoOpen(false)}
                className="flex-1 bg-bg text-ink-gray rounded-lg py-2.5 text-sm font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={creando}
                className="flex-1 bg-ink text-white rounded-lg py-2.5 text-sm font-bold disabled:opacity-60"
              >
                {creando ? "Creando…" : "Crear"}
              </button>
            </div>
          </form>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-20 md:bottom-7 left-1/2 -translate-x-1/2 bg-ink text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
