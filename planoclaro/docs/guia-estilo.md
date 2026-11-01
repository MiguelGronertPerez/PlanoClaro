# Guía de estilo y tokens — semana 12 (v3 «Vidrio y luz»)

**Idea:** tema claro monocromo. Lo futurista viene de la profundidad (capas de vidrio esmerilado), la luz, la forma 3D y el movimiento, **no del color**. El color nunca es la única señal: el estado se muestra también con forma, icono y texto.

## Color (`css/estilos.css`, `:root`)
| Token | Valor | Uso | Contraste sobre `--fondo` |
|---|---|---|---|
| `--fondo` | `#f2f3f5` | Página | — |
| `--blanco` | `#ffffff` | Campos, opciones | — |
| `--tinta` | `#0b0b0c` | Texto principal, botón principal, seleccionado | ≈ 18 : 1 (AAA) |
| `--tinta-2` | `#36373a` | Texto secundario | ≈ 10.6 : 1 (AAA) |
| `--tinta-3` | `#5b5d62` | Solo texto grande/auxiliar | ≈ 6 : 1 (AA) |
| `--linea` / `--linea-fuerte` | negro 12 % / 28 % | Bordes | — |
| `--vidrio` | blanco 66 % + `blur(20px)` | Paneles | — |

## Tipografía
Bricolage Grotesque (variable, OFL, incluida en `vendor/`).
| Token | Tamaño | Uso |
|---|---|---|
| `--t-display` | 46–99 px | Título de inicio (700 + 300 para contraste de peso) |
| `--t-titulo` | 34–58 px | Títulos de vista |
| `--t-lead` | 21–26 px | Introducciones |
| `--t-cuerpo` | **18–20 px** | Texto normal (mínimo 18 px) |
| `--t-peq` | 16 px | Notas (nunca menos) |
Interlineado del cuerpo 1.6; tracking mínimo −0.045em en números grandes; cifras tabulares en precios.

## Forma y profundidad
Radios 14 / 22 / 28 px. Sombras `--sombra-1` (reposo) y `--sombra-2` (elevado). Tres capas: fondo con luz → vidrio → tinta.

## Movimiento (reglas de Emil Kowalski)
| Token | Valor | Uso |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.23,1,0.32,1)` | Casi todo |
| `--ease-drawer` | `cubic-bezier(0.32,0.72,0,1)` | Aviso de consentimiento |
| `--d-press` | 140 ms | Al presionar (`scale(.97)`) |
| `--d-ui` | 220 ms | Hover, cambios de estado |
| `--d-paso` | 320 ms | Cambio de pregunta (desliza + gira 8° + desenfoque) |
| `--d-entrada` | 620 ms | Entradas de tarjetas (una vez) |
Nunca `ease-in`; nada empieza en `scale(0)`; hover solo con puntero fino. Con **movimiento reducido**: solo fundidos de 160 ms, sin 3D ni inclinación, la escena 3D queda en un cuadro fijo y el sonido no suena.

## Componentes
Botón principal (negro, 56 px de alto), botón fantasma, opción grande (84 px, icono + título + explicación + marca), acción de tarjeta (icono + texto debajo), sello (relleno = verificado, borde continuo = fuente secundaria, borde punteado = sin verificar/en conflicto), tabla comparativa («Cambia» / «Mejor»), panel de asistente, aviso emergente.

## Accesibilidad
Áreas táctiles ≥ 44 px (la mayoría 48–56). Foco visible de 3 px. Modo de alto contraste de Windows (`forced-colors`) soportado.
