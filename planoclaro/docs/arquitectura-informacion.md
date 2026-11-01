# Arquitectura de información y sitemap — semana 11

Una sola página (`index.html`) con 9 vistas. Cada vista tiene su dirección (`#cuestionario`, `#resultados`…), así el botón «Atrás» y los enlaces directos funcionan.

```
PlanoClaro
├── Inicio (#inicio)
│   ├── Plan para mi celular ──┐
│   └── Internet para mi casa ─┤
├── Cuestionario (#cuestionario) ← 1 pregunta por pantalla (5 pasos)
│   └── Resultados (#resultados)
│       ├── 3 opciones: más económica · equilibrada · alto consumo
│       │   ├── Guardar (favoritos) → Mi cuenta
│       │   ├── Comparar → Comparador
│       │   ├── Avísame (.ics)
│       │   └── Contratar en la web oficial (enlace externo)
│       ├── Letra chica aclarada (incluye derechos OSIPTEL)
│       ├── Planes descartados y por qué
│       └── Invitación a la encuesta SUS
├── Comparar (#comparar) — 2 o 3 planes lado a lado
├── Medir mi consumo (#medidor) — Android / iPhone → alimenta el cuestionario
├── Mi cuenta (#cuenta) — entrar/crear, perfil guardado, favoritos
├── Asistente (panel lateral, desde cualquier vista)
└── Pie
    ├── Métricas (#metricas) — panel UX y A/B
    ├── Encuesta (#encuesta) — SUS de 10 preguntas
    └── Administrar (#admin) — CRUD de planes (demo)
```

## Navegación global
Barra superior fija: Comparar (con contador), Medir mi consumo, Mi cuenta, Sonido, Asistente. Siempre visible, con texto bajo o junto a cada icono.

## Sistema de etiquetas (palabras que usa la interfaz)
| En vez de… | Decimos… |
|---|---|
| Postpago | Plan para mi celular |
| Plan hogar / FTTH | Internet para mi casa |
| GB | «datos» + equivalencia en horas de video |
| Mbps | «velocidad» + cuántas pantallas a la vez |
| Precio regular | Precio de siempre (después de la oferta) |
| Permanencia | Tiempo mínimo que debes quedarte |
| Portabilidad | Cambiarte de empresa sin perder tu número |

## Organización del catálogo
Por tipo (celular / casa) → operador → plan. Cada plan tiene fuente, fecha de revisión y nivel de verificación (verificado en web oficial / fuente secundaria / sin verificar / datos en conflicto).
