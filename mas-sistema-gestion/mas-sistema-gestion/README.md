# MAS – Sistema de gestión de afiliaciones (backoffice)

Backoffice interno de **Mutual Argentina Solidaria (MAS)** para gestionar solicitudes de afiliación, la base de asociados y los usuarios administrativos del sistema.

Esta versión es una **variante autocontenida** del sistema: mismas pantallas, mismo login, misma lógica de negocio — pero **sin depender de ninguna base de datos externa**. Los datos de ejemplo viven en memoria, dentro del propio proyecto, así que podés clonarlo y correrlo sin crear cuentas en ningún servicio de terceros.

---

## 1. Stack

| Capa | Tecnología |
|---|---|
| Frontend + Backend | **Next.js 15** (App Router, TypeScript) |
| Estilos | **Tailwind CSS** |
| Datos | **En memoria** (`src/lib/db.ts`) — sin base de datos externa |
| Autenticación | Cookies de sesión firmadas (**JWT** con `jose`) + **bcrypt** |

## 2. Sobre los datos (en memoria, sin base externa)

Todo lo que el sistema lee y escribe (usuarios, asociados, solicitudes) vive en un módulo de TypeScript (`src/lib/db.ts`), como si fuera una base de datos simulada:

- Arranca siempre con los mismos **datos de ejemplo** (5 usuarios, 7 asociados, 5 solicitudes).
- Los cambios que hagas durante una sesión (aprobar una solicitud, pausar un asociado, crear un usuario) **sí se guardan mientras el servidor sigue corriendo** — podés recargar la página y los vas a seguir viendo.
- Se **reinician** a los datos de ejemplo originales cada vez que reiniciás el servidor (`npm run dev` / `npm start`) o en cada nuevo deploy.
- Es una elección deliberada para esta versión: te permite mostrar el flujo completo sin configurar nada externo. El día que quieras persistencia real (que los datos sobrevivan a un reinicio), `src/lib/db.ts` es el único archivo que hay que reemplazar por un cliente de base de datos — el resto del código (rutas de API, pantallas) no cambia.

## 3. Qué incluye

- **Login real** con dos roles: `administrador` (ve Solicitudes y Asociados) y `superadmin` (ve además Panel y Usuarios). El control de acceso se aplica en el middleware de Next.js, no solo en la interfaz.
- **Solicitudes pendientes**: listar, aprobar (da de alta automáticamente al asociado) o rechazar (con motivo opcional).
- **Asociados**: listar con filtros (estado, segmento, búsqueda), pausar (con motivo) y reactivar. **Nunca se borra un asociado** — solo cambia de estado.
- **Exportar asociados**: modal con filtros de Segmento, Estado y rango de Fechas que genera y descarga un CSV real.
- **Panel (superadmin)**: KPIs calculados en vivo (asociados activos/pausados/inactivos, solicitudes pendientes/rechazadas, usuarios activos/inactivos) y los últimos usuarios creados.
- **Usuarios (superadmin)**: listar, crear usuarios nuevos y activar/desactivar accesos.
- Diseño **responsive**: sidebar en escritorio, barra de navegación inferior en mobile.

## 4. Usuarios de prueba

| Rol | Email | Contraseña |
|---|---|---|
| Superadmin | `superadmin@mas.org.ar` | `mas2026` |
| Administrador | `admin@mas.org.ar` | `mas2026` |

## 5. Cómo correrlo

### Requisitos

- Node.js 18.18 o superior

### Pasos

```bash
npm install
cp .env.example .env.local
```

En `.env.local`, generá tu propio `SESSION_SECRET` (por ejemplo con `openssl rand -base64 48`) y pegalo ahí. Es la única variable que hace falta — no hay claves de ningún servicio externo.

```bash
npm run dev
```

Abrí `http://localhost:3000` — te va a redirigir a `/login`.

### Build de producción (para verificar antes de deployar)

```bash
npm run build
npm start
```

## 6. Deploy (Vercel u otro hosting de Next.js)

1. Subí este repositorio a GitHub.
2. En [vercel.com](https://vercel.com), **Add New → Project** e importá el repositorio.
3. En **Environment Variables**, cargá solamente `SESSION_SECRET` con un valor propio.
4. Deploy.

Como los datos viven en memoria, cada redeploy (o cada reinicio del servidor) vuelve a los datos de ejemplo originales — es esperable en esta versión.

## 7. Notas de seguridad

- Las contraseñas se guardan hasheadas con `bcrypt` (vía `bcryptjs`), nunca en texto plano.
- La cookie de sesión es `httpOnly` y firmada (JWT), no se puede leer ni falsificar desde JavaScript del navegador.
- El middleware (`src/middleware.ts`) bloquea `/panel` y `/usuarios` a cualquiera que no sea `superadmin`, además de exigir sesión válida en todas las rutas internas.
- Un asociado nunca se elimina de los datos: solo cambia de estado (activo/pausado/inactivo).

## 8. Estructura del proyecto

```
mas-sistema-gestion/
├─ src/
│  ├─ app/
│  │  ├─ login/page.tsx           → pantalla de login
│  │  ├─ (app)/                   → pantallas protegidas (requieren sesión)
│  │  │  ├─ pendientes/page.tsx   → solicitudes pendientes
│  │  │  ├─ asociados/page.tsx    → tabla de asociados + modal de exportar
│  │  │  ├─ panel/page.tsx        → KPIs (solo superadmin)
│  │  │  └─ usuarios/page.tsx     → gestión de usuarios (solo superadmin)
│  │  └─ api/                     → rutas de la API
│  ├─ components/Sidebar.tsx
│  ├─ lib/
│  │  ├─ db.ts                    → datos en memoria (usuarios, asociados, solicitudes)
│  │  ├─ session.ts                → cookie de sesión (crear/leer/borrar)
│  │  └─ types.ts                  → tipos compartidos
│  └─ middleware.ts                 → protege rutas y aplica el control por rol
└─ .env.example
```
