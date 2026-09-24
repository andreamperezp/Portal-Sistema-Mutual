# MAS | Mutual Argentina Solidaria
 
Repositorio con los dos proyectos digitales de MAS: el sitio público de afiliación y el sistema interno de gestión.
 
## Proyectos
 
### [`mas-portal/`](./mas-portal)
 
Sitio público (landing) con la presentación institucional y el formulario de solicitud de afiliación. Es un sitio estático (HTML, CSS y JavaScript plano), sin instalación ni build — se abre directamente o se publica en cualquier hosting de archivos estáticos.
 
El formulario valida los datos en el navegador pero todavía no los envía a ningún backend — está preparado para conectarse al sistema de gestión el día que se decida integrarlos.
 
Ver el detalle en [`mas-portal/README.md`](./mas-portal/README.md).
 
### [`mas-sistema-gestion/`](./mas-sistema-gestion)
 
Backoffice interno para gestionar solicitudes de afiliación, la base de asociados y los usuarios administrativos. Construido con Next.js (App Router, TypeScript) y Tailwind CSS, con login real (JWT + bcrypt) y control de acceso por rol (administrador / superadmin).
 
Esta versión no depende de ninguna base de datos externa: los datos de ejemplo viven en memoria dentro del propio proyecto, así que se puede clonar y correr sin configurar credenciales de terceros.
 
Ver el detalle en [`mas-sistema-gestion/README.md`](./mas-sistema-gestion/README.md).
 
## Cómo se relacionan
 
Hoy son dos proyectos independientes, cada uno con su propia interfaz y lógica. El portal es donde un futuro asociado completa su solicitud; el sistema de gestión es donde el equipo de MAS revisa esas solicitudes, gestiona los asociados activos y administra los accesos del equipo. Cuando se conecten (el portal enviando las solicitudes al sistema de gestión en vez de solo mostrar una pantalla de éxito), el flujo completo va a quedar así:
 
```
Portal (público) → solicitud de afiliación → Sistema de gestión → aprobar/rechazar → alta de asociado
```
 
## Estado actual
 
- Ambos proyectos son funcionales de forma independiente, con datos de ejemplo.
- Ninguno de los dos está conectado a una base de datos real ni a un backend compartido todavía.
- No hay claves ni credenciales reales en este repositorio — cada proyecto genera las suyas propias de forma local (por ejemplo, `SESSION_SECRET` para las cookies de sesión), como se explica en el README de cada uno.
 

