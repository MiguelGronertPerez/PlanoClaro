# Skills de diseño usadas en PlanoClaro

Las tres skills son **reales y públicas**. Se descargaron de GitHub y se guardan aquí **con sus archivos originales y su licencia** (sin modificar).

| Carpeta | Repositorio | Commit | Licencia |
|---|---|---|---|
| `emil-kowalski/` | https://github.com/emilkowalski/skills | `2d228630` | MIT |
| `impeccable/` | https://github.com/pbakaus/impeccable (v4.7.0) | `dad8dbb3` | Apache-2.0 (+ `NOTICE.md`) |
| `taste-skill/` | https://github.com/Leonxlnx/taste-skill («design-taste-frontend» v2) | `6010f91a` | MIT |

## Cómo se usó cada una
- **Emil Kowalski** (`emil-design-eng`, `animate`, `review-animations`, …): reglas de movimiento. Curvas `cubic-bezier(0.23,1,0.32,1)` (ease-out) y de cajón; nunca `ease-in`; UI ≤ 300 ms; `:active scale(.97)`; nada desde `scale(0)`; solo `transform`/`opacity`; hover solo con puntero fino; resortes interrumpibles para la inclinación 3D; movimiento reducido = menos y más suave, no cero.
- **Impeccable:** se eligió el build genérico **`.agents/skills/impeccable`** (multiherramienta, no atado a un editor). Se usó el modo **Persuade** en el inicio y el modo **Operate** en cuestionario, resultados, comparador y administración, porque PlanoClaro es a la vez una portada que invita y una herramienta. Se aplicaron sus pisos de oficio (radios 12–28, medida 65–75 caracteres, sin texto con degradado, sin iconos emoji, sin etiquetas «eyebrow»). Su regla «el brief gana» justifica el vidrio que pidió el estudiante, aunque la skill lo desaconseja por defecto.
- **taste-skill:** se usaron `lint.mjs` (estático) e `inspect.mjs` (renderiza y mide; requiere Node 22, se corrió con `npx -y node@22`) como puertas de calidad en cada iteración. Resultados en `../docs/autocritica/`. Su dirección inicial («recibo») se reemplazó luego por el pedido del estudiante; las desviaciones están explicadas en `../docs/antes-y-despues.md`.

Nota: taste-skill está pensada para landing pages («not for app screens»); por eso sus avisos sobre fotos y video no se aplican a las pantallas de herramienta.
