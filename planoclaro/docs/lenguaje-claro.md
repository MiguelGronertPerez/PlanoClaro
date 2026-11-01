# Lenguaje claro y nivel de lectura

**Meta:** que cualquier persona entienda la página, también adultos mayores y quienes no saben de tecnología. Nivel de referencia: **6.º grado de primaria**.

## Reglas que seguimos
1. **Palabras de todos los días.** «Plan para mi celular» en vez de «postpago»; «precio de siempre» en vez de «precio regular».
2. **Ninguna sigla sin explicación.** Cada GB viene con su equivalencia: *«≈ 20 horas de video al mes en calidad normal (unas 40 min al día)»* (1 GB ≈ 1 hora de video normal). Cada Mbps dice para cuántas pantallas alcanza (≈ 25 Mbps por pantalla en 4K).
3. **Frases cortas.** Media de 6.5 palabras por frase (ver tabla).
4. **Un texto debajo de cada icono.** Ningún botón es solo un icono (el único caso, «cerrar» del asistente, tiene nombre accesible y la tecla Esc).
5. **Siempre un paso siguiente obvio.** Cada pantalla tiene un botón principal negro: «Siguiente», «Ver mis planes», «Contratar en la web de…», etc.
6. **Pistas.** Cada pregunta tiene una ayuda («Piensa en un día normal…»). Los errores dicen qué hacer («Elige una opción para seguir»), no solo qué falló.
7. **Nada depende solo del movimiento, del sonido o del color.** El sonido está apagado al inicio; los estados se ven con forma, icono y texto.

## Medición (automática)
Script: `python3 scripts/legibilidad.py` → `docs/legibilidad-resultados.json`. Extrae el texto visible de `index.html` y de los módulos de interfaz, y calcula:
- **Fernández-Huerta** (forma corregida): `206.84 − 60·(sílabas/palabra) − 1.02·(palabras/frase)`. 80–90 = «fácil» ≈ 6.º grado; 70–80 = «bastante fácil» ≈ 7.º grado.
- **INFLESZ (Szigriszt-Pazos):** `206.835 − 62.3·(sílabas/palabra) − palabras/frase`. 65–80 = «normal»; 80–95 = «bastante fácil».

| Fuente | Palabras | Palabras/frase | Sílabas/palabra | Fernández-Huerta | INFLESZ |
|---|---|---|---|---|---|
| index.html | 374 | 7.6 | 2.03 | 77.3 | 72.8 |
| js/preguntas.js | 288 | 7.2 | 1.84 | 88.9 | 84.8 |
| js/asistente.js | 513 | 7.0 | 1.85 | 88.9 | 84.8 |
| js/vista-resultados.js | 338 | 5.5 | 2.05 | 78.2 | 73.6 |
| js/medidor.js | 139 | 8.2 | 1.94 | 82.0 | 77.6 |
| js/cuestionario.js | 40 | 2.1 | 2.08 | 80.2 | 75.5 |
| js/utilidades.js | 44 | 4.9 | 2.18 | 70.9 | 66.0 |
| **Total** | **1736** | **6.5** | **1.95** | **83.4 («fácil», ~6.º grado)** | **79.1** |

**Lectura de los datos.** El cuestionario y el asistente, que son el centro de la experiencia, quedan en «fácil». Resultados e inicio bajan un poco porque tienen nombres propios que no se pueden cambiar («Movistar», «OSIPTEL», «portabilidad») y montos. El conteo de sílabas es aproximado (reglas de diptongo e hiato simplificadas) y los textos cortos (botones) dan valores menos fiables.

## Límites y validación con personas
Una fórmula no reemplaza a las personas. `[COMPLETAR: en la prueba de usabilidad, pide a 3 adultos mayores que expliquen con sus palabras qué significa «precio de siempre», «≈ 2 horas de video al día» y «tiempo mínimo que debes quedarte». Anota si lo entendieron.]`
