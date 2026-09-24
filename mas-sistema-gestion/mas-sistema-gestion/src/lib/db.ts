import "server-only";
import type { Usuario, Asociado, Solicitud } from "./types";

// Base de datos en memoria (sin Supabase / sin base externa).
//
// Pensada para demos y para correr el proyecto sin depender de credenciales
// de terceros. Los datos viven mientras el proceso de Node sigue corriendo
// (persisten entre requests y entre recargas de página, pero se pierden si
// reiniciás el servidor con `npm run dev` / `npm start`, o en un redeploy).
// Si más adelante necesitás persistencia real, este archivo es el único
// lugar que hay que reemplazar por un cliente de base de datos real: el
// resto del código (rutas de la API, componentes) no cambia.

interface UsuarioDB extends Usuario {
  password_hash: string;
}

let usuarios: UsuarioDB[] = [
  {
    id: "u-1",
    nombre: "Administradora General",
    email: "superadmin@mas.org.ar",
    // mas2026
    password_hash: "$2b$10$5RJSpdWhhjNIM19faMrVWeS5djp/j9hBKOyYnV1SzyiWr1q/fTOCu",
    rol: "superadmin",
    estado: "activo",
    created_at: "2026-01-12T10:00:00.000Z",
  },
  {
    id: "u-2",
    nombre: "Martín Ibáñez",
    email: "admin@mas.org.ar",
    // mas2026
    password_hash: "$2b$10$kSxtnhCr7HKtUzRjM3rEo.soe8TSQST9gpuOu/Si6dPI1BxwxrO0G",
    rol: "administrador",
    estado: "activo",
    created_at: "2026-02-03T10:00:00.000Z",
  },
  {
    id: "u-3",
    nombre: "Carla Domínguez",
    email: "carla.dominguez@mas.org.ar",
    password_hash: "$2b$10$5RJSpdWhhjNIM19faMrVWeS5djp/j9hBKOyYnV1SzyiWr1q/fTOCu",
    rol: "administrador",
    estado: "activo",
    created_at: "2026-04-18T10:00:00.000Z",
  },
  {
    id: "u-4",
    nombre: "Federico Suárez",
    email: "federico.suarez@mas.org.ar",
    password_hash: "$2b$10$5RJSpdWhhjNIM19faMrVWeS5djp/j9hBKOyYnV1SzyiWr1q/fTOCu",
    rol: "administrador",
    estado: "inactivo",
    created_at: "2026-05-22T10:00:00.000Z",
  },
  {
    id: "u-5",
    nombre: "Ayelén Rojas",
    email: "ayelen.rojas@mas.org.ar",
    password_hash: "$2b$10$5RJSpdWhhjNIM19faMrVWeS5djp/j9hBKOyYnV1SzyiWr1q/fTOCu",
    rol: "administrador",
    estado: "activo",
    created_at: "2026-07-09T10:00:00.000Z",
  },
];

let asociados: Asociado[] = [
  { id: "a-1", nombre: "María González", dni: "32456789", email: "maria.gonzalez@mail.com", telefono: "+54 9 11 5555-0101", segmento: "policia", estado: "activo", fecha_alta: "2026-01-15", motivo_pausa: null },
  { id: "a-2", nombre: "Jorge Alvez", dni: "28934521", email: "jorge.alvez@mail.com", telefono: "+54 9 11 5555-0102", segmento: "salud", estado: "activo", fecha_alta: "2026-02-02", motivo_pausa: null },
  { id: "a-3", nombre: "Lucía Fernández", dni: "35102938", email: "lucia.fernandez@mail.com", telefono: "+54 9 11 5555-0103", segmento: "caja", estado: "pausado", fecha_alta: "2026-02-20", motivo_pausa: "Solicitó pausa temporal por licencia" },
  { id: "a-4", nombre: "Pablo Ramírez", dni: "30567123", email: "pablo.ramirez@mail.com", telefono: "+54 9 11 5555-0104", segmento: "policia", estado: "activo", fecha_alta: "2026-03-11", motivo_pausa: null },
  { id: "a-5", nombre: "Noelia Castro", dni: "33789456", email: "noelia.castro@mail.com", telefono: "+54 9 11 5555-0105", segmento: "salud", estado: "inactivo", fecha_alta: "2026-03-28", motivo_pausa: null },
  { id: "a-6", nombre: "Diego Ferreyra", dni: "27345098", email: "diego.ferreyra@mail.com", telefono: "+54 9 11 5555-0106", segmento: "caja", estado: "activo", fecha_alta: "2026-04-09", motivo_pausa: null },
  { id: "a-7", nombre: "Sabrina Molina", dni: "36123457", email: "sabrina.molina@mail.com", telefono: "+54 9 11 5555-0107", segmento: "policia", estado: "activo", fecha_alta: "2026-05-05", motivo_pausa: null },
];

let solicitudes: Solicitud[] = [
  { id: "s-1", nombre: "Ezequiel Torres", dni: "39456123", email: "ezequiel.torres@mail.com", telefono: "+54 9 11 5555-0201", segmento: "policia", estado: "pendiente", motivo_rechazo: null, revisado_por: null, revisado_at: null, created_at: "2026-09-10T14:20:00.000Z" },
  { id: "s-2", nombre: "Valentina Ríos", dni: "38234567", email: "valentina.rios@mail.com", telefono: "+54 9 11 5555-0202", segmento: "salud", estado: "pendiente", motivo_rechazo: null, revisado_por: null, revisado_at: null, created_at: "2026-09-14T09:05:00.000Z" },
  { id: "s-3", nombre: "Matías Sosa", dni: "37890234", email: "matias.sosa@mail.com", telefono: "+54 9 11 5555-0203", segmento: "caja", estado: "pendiente", motivo_rechazo: null, revisado_por: null, revisado_at: null, created_at: "2026-09-18T16:40:00.000Z" },
  { id: "s-4", nombre: "Carolina Paz", dni: "35678901", email: "carolina.paz@mail.com", telefono: "+54 9 11 5555-0204", segmento: "salud", estado: "aprobado", motivo_rechazo: null, revisado_por: "u-1", revisado_at: "2026-08-20T15:00:00.000Z", created_at: "2026-08-20T11:00:00.000Z" },
  { id: "s-5", nombre: "Nicolás Bravo", dni: "34567890", email: "nicolas.bravo@mail.com", telefono: "+54 9 11 5555-0205", segmento: "policia", estado: "rechazado", motivo_rechazo: "Documentación incompleta", revisado_por: "u-1", revisado_at: "2026-08-12T12:00:00.000Z", created_at: "2026-08-12T08:30:00.000Z" },
];

let nextId = 100;
function genId(prefix: string) {
  nextId += 1;
  return `${prefix}-${nextId}`;
}

// --- usuarios ---
export function listUsuarios(): Usuario[] {
  return usuarios
    .map(({ password_hash, ...rest }) => rest)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function findUsuarioByEmail(email: string): UsuarioDB | undefined {
  return usuarios.find((u) => u.email === email);
}

export function findUsuarioById(id: string): UsuarioDB | undefined {
  return usuarios.find((u) => u.id === id);
}

export function createUsuario(input: { nombre: string; email: string; password_hash: string; rol: Usuario["rol"] }): Usuario {
  const nuevo: UsuarioDB = {
    id: genId("u"),
    nombre: input.nombre,
    email: input.email,
    password_hash: input.password_hash,
    rol: input.rol,
    estado: "activo",
    created_at: new Date().toISOString(),
  };
  usuarios = [...usuarios, nuevo];
  const { password_hash, ...rest } = nuevo;
  return rest;
}

export function setUsuarioEstado(id: string, estado: Usuario["estado"]) {
  usuarios = usuarios.map((u) => (u.id === id ? { ...u, estado } : u));
}

export function recentUsuarios(limit: number): Usuario[] {
  return listUsuarios().slice(0, limit);
}

// --- asociados ---
export function listAsociados(): Asociado[] {
  return [...asociados].sort((a, b) => b.fecha_alta.localeCompare(a.fecha_alta));
}

export function filterAsociados(filters: { segmento?: string; estado?: string; desde?: string; hasta?: string }): Asociado[] {
  return listAsociados().filter((a) => {
    if (filters.segmento && filters.segmento !== "todos" && a.segmento !== filters.segmento) return false;
    if (filters.estado && filters.estado !== "todos" && a.estado !== filters.estado) return false;
    if (filters.desde && a.fecha_alta < filters.desde) return false;
    if (filters.hasta && a.fecha_alta > filters.hasta) return false;
    return true;
  });
}

export function createAsociado(input: Omit<Asociado, "id" | "fecha_alta" | "motivo_pausa">): Asociado {
  const nuevo: Asociado = {
    ...input,
    id: genId("a"),
    fecha_alta: new Date().toISOString().slice(0, 10),
    motivo_pausa: null,
  };
  asociados = [...asociados, nuevo];
  return nuevo;
}

export function setAsociadoEstado(id: string, estado: Asociado["estado"], motivo_pausa: string | null) {
  asociados = asociados.map((a) => (a.id === id ? { ...a, estado, motivo_pausa } : a));
}

// --- solicitudes ---
export function listSolicitudes(): Solicitud[] {
  return [...solicitudes].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function findSolicitudById(id: string): Solicitud | undefined {
  return solicitudes.find((s) => s.id === id);
}

export function updateSolicitud(id: string, changes: Partial<Solicitud>) {
  solicitudes = solicitudes.map((s) => (s.id === id ? { ...s, ...changes } : s));
}
