# MAS – Portal de afiliados

Sitio público (landing) de **Mutual Argentina Solidaria (MAS)**, con la presentación institucional y el formulario de solicitud de afiliación.

Es un sitio **estático** — HTML, CSS y JavaScript plano, sin frameworks ni build. Se puede abrir directamente en el navegador o publicar en cualquier hosting de archivos estáticos (GitHub Pages, Vercel, Netlify, etc.).

## Contenido

- `index.html` — toda la página (nav, hero, quiénes somos, segmentos, beneficios, cómo asociarte, testimonio, CTA final y el modal del formulario de afiliación).
- `styles.css` — estilos, con la misma paleta e identidad visual del resto de los proyectos de MAS (teal / amarillo / tinta).
- `script.js` — interacciones: abrir/cerrar el modal, menú mobile, selección de segmento, validación del formulario, botón "volver arriba".
- `logo.png` — el isotipo de MAS usado en el header, el footer y la credencial de ejemplo.

## Sobre el formulario de afiliación

Este sitio **no tiene backend propio**: al completar el formulario y tocar "Enviar solicitud de afiliación", se valida todo en el navegador y se muestra la pantalla de "¡Solicitud enviada!" — no se envía a ningún servidor todavía.

Cuando quieras conectarlo a un sistema real, el lugar exacto está marcado con un comentario en `script.js` (buscá "Envío del formulario"): ahí reemplazás la lógica actual por un `fetch()` a tu API — por ejemplo, al endpoint de solicitudes del [sistema de gestión de MAS](../mas-sistema-gestion), para que cada solicitud enviada desde acá aparezca directamente en la pantalla de "Solicitudes pendientes" del backoffice.

## Cómo correrlo

No requiere instalación. Podés:

- Abrir `index.html` directamente con doble clic (algunas funciones del navegador pueden ser más limitadas por seguridad al abrir un archivo local).
- O, mejor, levantar un servidor estático simple desde la carpeta del proyecto:

```bash
npx serve .
```

y abrir la URL que te muestre en la terminal (por defecto `http://localhost:3000`).

## Publicarlo

Cualquier hosting de sitios estáticos funciona. Las opciones más simples:

- **GitHub Pages**: subí este repositorio a GitHub, andá a Settings → Pages, y elegí la rama `main` como fuente. En un par de minutos tu sitio queda publicado en una URL de `github.io`.
- **Vercel / Netlify**: importá el repositorio como "sitio estático" (sin framework) — no hace falta configurar ningún build command.

## Nota sobre tipografía

El diseño original usa "Liebling", una fuente paga con licencia propia de la mutual, que no incluimos acá porque no tenemos derecho a redistribuirla. Mientras tanto, los títulos usan Nunito Sans en un peso alto como reemplazo. Si tu equipo tiene la licencia de Liebling, agregá los archivos de la fuente y un `@font-face` en `styles.css` — el CSS ya está preparado para tomarla automáticamente (`font-family:'Liebling','Nunito Sans',sans-serif`).
