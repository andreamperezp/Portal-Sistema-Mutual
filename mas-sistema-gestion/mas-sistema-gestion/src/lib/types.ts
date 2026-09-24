export type Rol = "administrador" | "superadmin";
export type EstadoUsuario = "activo" | "inactivo";
export type EstadoAsociado = "activo" | "pausado" | "inactivo";
export type EstadoSolicitud = "pendiente" | "aprobado" | "rechazado";
export type Segmento = "policia" | "salud" | "caja";

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  estado: EstadoUsuario;
  created_at: string;
}

export interface Asociado {
  id: string;
  nombre: string;
  dni: string;
  email: string | null;
  telefono: string | null;
  segmento: Segmento;
  estado: EstadoAsociado;
  fecha_alta: string;
  motivo_pausa: string | null;
}

export interface Solicitud {
  id: string;
  nombre: string;
  dni: string;
  email: string | null;
  telefono: string | null;
  segmento: Segmento;
  estado: EstadoSolicitud;
  motivo_rechazo: string | null;
  revisado_por: string | null;
  revisado_at: string | null;
  created_at: string;
}

export interface SessionUser {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
}
