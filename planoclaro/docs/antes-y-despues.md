# Antes y después: v1 → iteración 1 → v3 «Vidrio y luz»

Capturas originales: `antes-y-despues/v1/` (v1) y `antes-y-despues/iteracion-1-recibo/` (primer rediseño, tema «recibo» oscuro-nogal). Capturas finales: `../capturas/`. Las imágenes lado a lado se generan desde esas tres carpetas.

## Proceso de iteración (autocrítica)
1. **v1 → Iteración 1 («recibo»).** Se aplicó taste-skill (`draw.mjs` dio la dirección «la página es el objeto»: un recibo) e Impeccable. Crítica: era distinto, pero **oscuro y con poco contraste en notas**, y el estudiante lo vio genérico. Lint de taste: sombras y máscaras dentadas → corregidas.
2. **Iteración 2 (tema claro).** Pedido: claro, futurista, vidrio. Crítica con `inspect.mjs`: titular de 3 líneas, cuerpo de 14 px, poco movimiento, desborde de 9 px en 390 px.
3. **Iteración 3 (v3 monocromo, final).** Cuerpo ≥ 18 px, tinta AAA, vidrio + luz + escena Three.js, una pregunta por pantalla. Autocrítica con capturas: navegación ocupaba 3 filas en móvil → compactada a 2; el aviso emergente tapaba el título → movido abajo; la tarjeta trasera de la escena desbordaba 18 px en 390 px → ajustada; botones con sombra (inspect «button-fx») → planos; las líneas 3D estorbaban la lectura en móvil → opacidad 40 %. Salidas guardadas en `autocritica/`.

**Desviaciones defendidas** frente a taste-skill: usa vidrio y sombras (el brief lo pide: «the brief wins», Impeccable); no hay fotografías ni video porque es una herramienta, no una landing; el titular tiene 3 líneas a propósito (contraste de pesos 700/300/700) y sigue siendo corto (8 palabras).

## Comparaciones y principio de IHC

### Inicio
![Inicio escritorio](antes-y-despues/comparaciones/inicio-escritorio.png)
![Inicio móvil](antes-y-despues/comparaciones/inicio-movil.png)
- **Dos puertas grandes en vez de un formulario** («Plan para mi celular» / «Internet para mi casa»), con icono + título + explicación. *Norman: affordances y significantes; Nielsen #6 reconocer antes que recordar.*
- **Escena 3D con planes reales** (tarjetas de vidrio sobre hilos de fibra): muestra el resultado antes de empezar. *Gestalt figura-fondo; Nielsen #1 visibilidad del estado.* Es decorativa (`aria-hidden`) y se apaga con movimiento reducido.
- **Titular con contraste de peso** y cuerpo de 18–20 px. *WCAG 1.4.4 / 1.4.6 (AAA): tinta ≈ 18:1.*

### Cuestionario
![Cuestionario](antes-y-despues/comparaciones/cuestionario-escritorio.png)
- **Una pregunta por pantalla** con progreso («Pregunta 1 de 5» + barra). *Ley de Hick; Nielsen #1; carga cognitiva (Miller).*
- **Opciones-baldosa de 84 px** con icono, título y explicación cotidiana. *Ley de Fitts; WCAG 2.5.8 tamaño del objetivo.*
- **Transición con dirección** (avanza a la derecha, vuelve a la izquierda). *Norman: mapeo natural; Gestalt destino común.*
- **Seleccionado = negro relleno + marca ✓**, no solo color. *WCAG 1.4.1 uso del color.*

### Validación
![Validación](antes-y-despues/comparaciones/validacion-escritorio.png)
- El error dice qué hacer y aparece junto a la pregunta, con borde punteado y «!». *Nielsen #9 ayudar a reconocer y corregir errores; WCAG 3.3.1 y 3.3.3.*

### Resultados
![Resultados escritorio](antes-y-despues/comparaciones/resultados-escritorio.png)
![Resultados móvil](antes-y-despues/comparaciones/resultados-movil.png)
- **Precio con contador animado** y luego **bloque negro «En 12 meses pagarás»**: lo más importante tiene el mayor contraste. *Gestalt jerarquía/figura-fondo; Nielsen #8 diseño minimalista.*
- **Sellos por forma** (relleno / borde / punteado) para el nivel de verificación. *WCAG 1.4.1; Nielsen #2 coincidencia con el mundo real (honestidad del dato).*
- **Acciones con texto bajo el icono** (Guardar, Comparar, Avísame). *Nielsen #6; Norman: significantes.*
- **Letra chica con derechos OSIPTEL** (portabilidad gratis, 70 % de velocidad mínima, SIRT, Checa tus líneas). *Nielsen #10 ayuda y documentación.*

### Nuevas pantallas
Comparador (filas «Cambia», celdas «Mejor», barras), medidor de consumo, cuenta, asistente, encuesta SUS, métricas y administración: ver `../capturas/*-04` a `*-12`. *Nielsen #3 control y libertad (quitar del comparador, borrar datos); #7 flexibilidad (asistente, enlace directo por `#`).*

### Movimiento y sonido
Reglas de Emil Kowalski: ease-out fuerte, ≤ 300 ms en UI, `scale(.97)` al presionar, hover solo con puntero fino. Movimiento reducido = fundidos de 160 ms (`../capturas/*-13-movimiento-reducido.png`). Sonido apagado por defecto, nunca suena antes de un gesto y nunca es la única señal. *WCAG 2.3.3, 1.4.2.*
