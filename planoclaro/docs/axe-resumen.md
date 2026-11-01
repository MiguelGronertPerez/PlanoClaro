# Resultados de axe-core (pruebas automáticas reales)

- **Herramienta:** axe-core 4.14.0 (no se incluye en el sitio; se inyecta solo durante la prueba).
- **Reglas:** etiquetas `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`.
- **Cómo:** `python3 scripts/probar.py` corre axe en inicio, resultados, comparador, asistente abierto y métricas, en 4 contextos (http y file:// × 1440 y 390 px).
- **Resultado:** **20 análisis, 0 violaciones** (datos completos en [`axe-resultados.json`](axe-resultados.json)).
- **Corregido durante el trabajo:** `label-content-name-mismatch` en los botones «Comparar» y «Avísame» (el nombre accesible ahora empieza con el texto visible).
- **Lighthouse 12.8.2** (móvil simulado, http): Accesibilidad 100, Buenas prácticas 100, SEO 100, Rendimiento 82. Informe: [`lighthouse.report.html`](lighthouse.report.html).

Las pruebas automáticas encuentran una parte de los problemas. El checklist WCAG 2.2 completo, con revisión manual, está en `../docs-pm/`.
