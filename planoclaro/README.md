# PlanoClaro

**Comparador y recomendador de planes de celular e internet de casa del Perú, en lenguaje simple.**
Proyecto del curso *Interacción Humano Computador* (UCSS). Estudiante: **Miguel Armando Gronert Perez**.

Responde 5 preguntas con botones grandes y PlanoClaro te muestra 3 opciones: **la más económica**, **la equilibrada** y **para alto consumo**. Ves el precio de la oferta, el precio de siempre y **cuánto pagarás en 12 meses**, en soles. La letra pequeña viene explicada, con tus derechos ante OSIPTEL. Cada dato dice si se verificó en la web oficial, si viene de otra fuente o si no se pudo verificar. **Nunca se inventan datos.**

## Cómo abrirlo
- Doble clic en `index.html` (funciona con `file://`), o
- `python3 -m http.server` y abre http://localhost:8000.
No necesita instalar nada ni compilar.

## Funciones
1. **Cuestionario** de una pregunta por pantalla (celular: 5; casa: 5, incluye Lima/provincias). Todo con palabras simples y equivalencias («≈ 2 horas de video al día»).
2. **Resultados** con contadores, costo a 12 meses, letra chica, planes descartados y el motivo.
3. **Comparador** de 2–3 planes lado a lado («Cambia», «Mejor», barras).
4. **Recordatorio .ics** para cuando termina la oferta (alarma 3 días antes).
5. **Medir mi consumo**: pasos para Android y iPhone; el número alimenta el cuestionario.
6. **Mi cuenta**: acceso seguro **únicamente con cuenta de Google** (sin contraseñas ni registros locales). Sincroniza tus planes guardados y perfil.
7. **Asistente** de preguntas frecuentes (sin internet, por reglas): permanencia, velocidad, portabilidad, GB, Mbps, reclamos, etc.
8. **Administración** de planes (crear, editar, borrar, importar/exportar JSON, validación).
9. **Encuesta SUS y Reseñas**: medición cuantitativa de usabilidad (10 preguntas, escala 0–100) y calificación cualitativa del plan elegido con autenticación Google.
10. **Prueba A/B**: A avanza sola al elegir; B usa «Siguiente». Forzar con `?variante=A` o `?variante=B`.
11. **Sonido** suave (Web Audio), **apagado por defecto**, botón visible, se recuerda la elección.
12. Botón final: **«Contratar en la web de …»** (solo un enlace; no hay pagos).
13. **Calculadora de ahorro**: compara tu recibo mensual actual frente a los planes de PlanoClaro, detecta cargos indebidos de routers o seguros y proyecta tu ahorro a 12 meses.
14. **Generador de reclamos y bajas OSIPTEL**: redacta solicitudes formales con base legal peruana (Ley 31207, TUO de OSIPTEL) para dar de baja el servicio en 5 días o reclamar si no te garantizan el 70 % de velocidad.
15. **Accesibilidad e inclusión**: lectura en voz alta (Web Speech API sin librerías externas), ajuste de escala de texto (A- / A+) y glosario interactivo en lenguaje claro.
16. **Muro de reseñas flotantes**: las opiniones reales de los usuarios verificadas con Google flotan y rotan en la página principal al deslizar hacia abajo, con valoración de utilidad. Sin datos de prueba inventados.

## Catálogo (47 planes, revisado el 20/10/2026)
Celular: Claro, Movistar, Entel, Bitel. Internet de casa: Claro, Movistar, Entel, Bitel, Win, **WOW**, **MiFibra**, **FiberPro** (solo Lima y Callao). Fuentes y notas por plan en `scripts/generar_datos.py`. Los datos en conflicto entre páginas se marcan como tales (p. ej., WOW 1000 Mbps, MiFibra 5000 Mbps; en MiFibra se usa la duración de oferta más corta, 2 meses). No se agregaron operadores móviles virtuales porque no se pudieron verificar sus tarifas. Comparatel (OSIPTEL) no respondió desde el entorno de trabajo.
Para actualizar: edita `scripts/generar_datos.py` y corre `python3 scripts/generar_datos.py` (genera `data/planes.json` y `data/planes.js`).

## Firebase (opcional)
1. Crea un proyecto en https://console.firebase.google.com, activa **Authentication → Correo/contraseña** y **Firestore**.
2. Copia `js/firebase-config.example.js` sobre `js/firebase-config.js` y pega tu configuración web.
3. Publica las reglas de `firestore.rules`.
4. Para administrar el catálogo en la nube, da a tu usuario el *custom claim* `admin: true` (Admin SDK).
5. Sirve el sitio por `http(s)` (Firebase no se carga con `file://`). Sin configuración, todo funciona en modo local.

## Dependencias incluidas (`vendor/`, sin CDN)
| Paquete | Versión | Licencia | Uso |
|---|---|---|---|
| three (build UMD `three.min.js`) | 0.159.0 | MIT | Escena 3D del inicio (se carga después del primer pintado). Parche: ver `vendor/three/PARCHE.md` |
| Bricolage Grotesque (variable) | @fontsource-variable 5.3.0 | OFL-1.1 | Tipografía |
| Firebase compat (app, auth, firestore) | 11.10.0 | Apache-2.0 | Solo si se configura |
Solo para pruebas (no incluido): axe-core 4.14.0 (MPL-2.0), Playwright, Lighthouse 12.8.2.

## Estructura
```
index.html            Vistas: inicio, cuestionario, resultados, comparar, resenas, medidor, cuenta, encuesta, métricas, admin
css/estilos.css       Tema claro monocromo «Vidrio y luz» · css/fuente.css (@font-face por http)
js/                   arranque, utilidades, iconos, movimiento, sonido, almacen (local/Firebase), datos, preguntas,
                      costos, motor, metricas, cuestionario, vista-resultados, carrito (+ .ics), resenas, cuenta, medidor,
                      asistente, sus, admin, escena, fibra3d, app · firebase-config(.example).js
data/                 planes.json y planes.js (generados)
firestore.rules       Reglas de Firestore
scripts/              generar_datos.py, generar_fuente.py, probar.py, legibilidad.py
skills/               Skills de diseño originales (ver skills/README.md)
vendor/               Dependencias con licencia
docs/                 Entregables de IHC (ver docs/README.md) · docs-pm/ (otros entregables, si existe)
capturas/             Capturas de las pruebas (http y file × 1440 y 390 px)
```

## Pruebas
```
python3 scripts/probar.py        # Playwright: 4 contextos, cada función, axe-core; borra y regenera capturas/
python3 scripts/legibilidad.py   # Nivel de lectura (Fernández-Huerta / INFLESZ)
```
Último resultado: **0 fallos** (128 comprobaciones), consola limpia, sin 404 ni violaciones de CSP, **0 violaciones axe** en 20 análisis. Lighthouse (móvil simulado): Accesibilidad 100, Buenas prácticas 100, SEO 100, Rendimiento 82 (`docs/lighthouse.report.html`).

## Accesibilidad y lenguaje
Cuerpo ≥ 18 px, texto con contraste AAA, objetivos táctiles ≥ 44 px, foco visible, enlace «Saltar al contenido», nada depende solo del color, del movimiento o del sonido, movimiento reducido respetado. Nivel de lectura ≈ 6.º grado (`docs/lenguaje-claro.md`).

Seguridad: ver [SECURITY.md](SECURITY.md).
