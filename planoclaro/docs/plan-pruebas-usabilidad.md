# Plan de pruebas de usabilidad y prueba A/B — semana 16

> Plan. Los resultados se escriben en `[COMPLETAR]` después de hacer las pruebas reales.

## Objetivo
Comprobar que cualquier persona, también adultos mayores sin conocimientos técnicos, puede encontrar un plan y entender cuánto pagará en un año.

## Participantes
5–8 personas por variante (total 10–16). Al menos 3 de 60 años o más y 3 de provincias. Sin trabajadores de operadores.

## Tareas
| # | Tarea (se lee en voz alta) | Éxito si… |
|---|---|---|
| T1 | «Busca un plan de celular que te sirva y que cueste menos de S/ 60 al mes.» | Llega a Resultados |
| T2 | «¿Cuánto pagarías en total en un año con la opción más económica?» | Dice el monto correcto |
| T3 | «Compara dos planes y dime cuál tiene más datos.» | Usa el comparador y acierta |
| T4 | «Averigua si puedes cambiarte de empresa sin perder tu número.» | Encuentra la respuesta (letra chica o asistente) |
| T5 | «Guarda un recordatorio para cuando suba el precio.» | Descarga el .ics |
| T6 | «Mira cuántos datos usaste este mes en tu celular.» | Usa «Medir mi consumo» |

## Procedimiento
1. Consentimiento y explicación (pensar en voz alta). 2. Tareas T1–T6 sin ayuda (máx. 5 min cada una). 3. Encuesta SUS dentro del sitio (`#encuesta`). 4. Preguntas finales: «¿Qué fue lo más fácil? ¿Lo más difícil?».

## Medidas
Éxito por tarea, tiempo hasta la recomendación, errores de validación, abandono, puntaje SUS. Las primeras se registran solas en `#metricas` si el participante acepta el aviso de privacidad (todo queda en el navegador; se exporta en JSON).

## Prueba A/B
- **Hipótesis:** la variante A (avanza sola al elegir) reduce el tiempo hasta la recomendación sin bajar la tasa de éxito ni el SUS.
- **Asignación:** aleatoria y guardada en el navegador; para la prueba moderada, forzar con `index.html?variante=A` o `?variante=B` alternando entre participantes.
- **Métrica principal:** tiempo medio hasta la recomendación. **Secundarias:** completado, abandono, errores, SUS.
- **Decisión:** con muestras pequeñas no hay significancia estadística; se reporta la diferencia y se combina con observaciones cualitativas. Si hay ≥ 30 por variante, usar prueba t (tiempo) y chi-cuadrado (completado).

## Resultados
| Participante | Variante | T1 | T2 | T3 | T4 | T5 | T6 | Tiempo | SUS | Notas |
|---|---|---|---|---|---|---|---|---|---|---|
| `[COMPLETAR]` | | | | | | | | | | |
