# Seguridad de PlanoClaro

## Medidas
- **Sin `innerHTML` con datos.** Todo se dibuja con nodos del DOM (`PC.h`), que además **rechaza atributos `on*`**. Los textos del catálogo, del chat y de la importación JSON nunca se interpretan como HTML.
- **Política de seguridad de contenido (CSP)** en `<meta>`, compatible con `file://`: `default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'` + dominios de Google solo para Firebase opcional; `base-uri 'none'; form-action 'none'; object-src 'none'`. Sin scripts ni estilos en línea, sin `eval`.
- **Sin manejadores en línea** (`onclick=` etc.): eventos delegados en JS.
- **Enlaces externos** solo `https:` (validados con `PC.util.urlSegura`), con `target="_blank" rel="noopener noreferrer"` y aviso «se abre en otra pestaña».
- **Sin CDN.** Todas las dependencias están en `vendor/` con versión y licencia (ver README).
- **Sin secretos en el repositorio.** `js/firebase-config.js` trae `null`; el ejemplo usa marcadores. Las claves web de Firebase no son secretas, pero la seguridad real está en `firestore.rules`.
- **Validación de entradas:** cuestionario, medidor (0.1–1000 GB), correo y clave (≥ 8), encuesta SUS, editor de planes (`PC.datos.errores`), importación JSON (máx. 1 MB, estructura validada, ids únicos).
- **Cuentas locales:** clave derivada con PBKDF2-SHA-256 (120 000 iteraciones, sal aleatoria) vía Web Crypto. Nunca se guarda la clave en texto.
- **Métricas y encuesta:** solo con consentimiento, solo en el navegador, con botón para borrar.
- **Firebase opcional:** reglas que permiten a cada usuario leer/escribir solo su documento; el catálogo es de lectura pública y escritura solo con *custom claim* `admin`.

## Limitaciones (es un proyecto de curso)
- **Las cuentas locales y el login de administración son de demostración.** El usuario `admin` / clave `ucss-demo-2026` está en el README y su hash en el código: **no protege nada real**. Cualquiera con acceso al navegador puede leer `localStorage`.
- El parche del administrador solo cambia el catálogo en ese navegador (o en Firestore si se configura con reglas de admin).
- Una CSP en `<meta>` no admite `frame-ancestors`; si se publica en un servidor, añadir cabeceras HTTP (`Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`).

## Reportar un problema
Escribe al estudiante responsable del proyecto por el aula virtual del curso. No publiques datos personales en el reporte.
