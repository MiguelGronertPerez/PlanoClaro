# Arquitectura de información y sitemap — v3.5 (Estudiantes y Familias)

Una sola página web (`index.html`) modular y accesible con navegación por hash (`#cuestionario`, `#resultados`, `#comparar`…). Optimizada para dispositivos móviles de gama media/baja en el Perú.

```
PlanoClaro
├── Inicio (#inicio)
│   ├── [Camino 1 paso]: Explorar catálogo con filtros directos (#resultados)
│   └── [Camino 2 pasos]: Recomendador asistido
│       ├── Plan para mi celular (5 pasos) ──┐
│       └── Internet para mi casa (5 pasos) ─┴─► Resultados y Catálogo (#resultados)
├── Resultados y Catálogo (#resultados)
│   ├── Migas de pan (Breadcrumbs)
│   ├── Barra de confianza: Sello explícito de IGV (18 %) y cotejo OSIPTEL
│   ├── Barra de Búsqueda y Filtros Rápidos:
│   │   ├── Búsqueda en texto libre (tiempo real)
│   │   ├── Chips por Empresa (Claro, Movistar, Entel, Bitel, Win, WOW, MiFibra)
│   │   ├── Chips por Presupuesto (Hasta S/ 35, Hasta S/ 65, Más de S/ 65)
│   │   └── Ordenamiento (Menor precio ↑, Mayor precio ↓, Más gigas/velocidad ↓)
│   ├── Contador dinámico: "Mostrando X planes de Y disponibles"
│   ├── Grilla de Tarjetas:
│   │   ├── Precio dominante con IGV incluido
│   │   ├── Desglose oferta vs regular vs total a 12 meses
│   │   ├── Qué incluye en palabras del usuario (redes, hotspot a laptop, simetría)
│   │   └── Botón de acción contrastante (Comparar, Elegir, Guardar, Avísame .ics)
│   ├── Estado Sin Resultados Asistido (Zero-State con sugerencias empáticas y reset)
│   ├── Letra pequeña aclarada (derechos OSIPTEL, uso justo, penalidades)
│   └── Planes descartados y motivo
├── Comparar (#comparar) — Hasta 3 planes lado a lado (modo tarjetas o scroll con columna fija en móvil)
├── Calculadora de Ahorro (#ahorro) — Detección de cobros ocultos de routers/seguros
├── Generador de Reclamos OSIPTEL (#reclamos) — Base legal (Ley 31207 / TUO)
├── Medir mi consumo (#medidor) — Pasos Android / iPhone
├── Mi cuenta (#cuenta) — Perfil y planes guardados
└── Asistente (panel lateral accesible desde cualquier vista)
```

---

## Doble Camino de Decisión (1 a 2 Pasos)

1. **Camino 1: Explorador Rápido (1 paso)**  
   Para estudiantes o usuarios que ya saben lo que buscan (ej. *"un plan de Entel de menos de 40 soles"*). Desde el inicio o menú superior tocan `Planes` o `Explorar catálogo con filtros`, accediendo directamente al catálogo con filtros interactivos sin preguntas previas.
2. **Camino 2: Cuestionario Asistido (2 pasos)**  
   Para usuarios que no saben cuántos gigas o qué velocidad necesitan (ej. una familia buscando internet de casa o un adulto mayor). Responden preguntas visuales de 1 toque y PlanoClaro calcula automáticamente la dotación recomendada.

---

## Sistema de Etiquetas (Vocabulario del Usuario)

Eliminación radical de tecnicismos para evitar la parálisis por análisis:

| Término Técnico | Etiqueta en PlanoClaro | Explicación para el Usuario |
|---|---|---|
| **Precio neto / con asterisco** | **Precio final con IGV incluido** | Promesa sin letra chiquita: exactamente lo que llega en tu recibo. |
| **Postpago** | **Plan mensual con chip** | Pagas un monto fijo al mes con tu mismo número. |
| **Prepago** | **Chip con recargas** | Pones saldo cuando tú quieres sin contratos mensuales. |
| **FTTH (Fiber to the Home)** | **Fibra óptica simétrica** | Sube y descarga archivos a la misma velocidad sin caídas. |
| **HFC / Coaxial** | **Internet por cable tradicional** | Conexión con velocidad de subida más lenta que la de descarga. |
| **Tethering / Hotspot** | **Compartir internet a tu laptop** | Vital para estudiantes universitarios que estudian fuera de casa. |
| **Política de Uso Justo (PUJ)** | **Gigas en alta velocidad** | Al agotarse, sigues navegando pero a velocidad reducida. |
| **Portabilidad numérica** | **Cambiarte manteniendo tu número** | Trámite 100 % gratuito en 24 horas garantizado por OSIPTEL. |
| **Plazo forzoso** | **Permanencia solo si compras equipo** | Prohibido penalizarte si solo contrataste el servicio. |

---

## Gestión del Estado "Sin Resultados" (Zero-State)

Cuando la combinación de filtros no arroja resultados, PlanoClaro no muestra un mensaje vacío. Aplica un protocolo de asistencia:
1. **Mensaje Causal:** Explica exactamente qué filtro bloquea la búsqueda (ej. *"No hay planes de menos de S/ 35 con más de 100 GB"*).
2. **Sugerencias Inteligentes:**
   * Mostrar el precio mínimo en el que sí existen esos planes.
   * Sugerir planes con gigas suficientes que se ajusten al presupuesto del estudiante o la familia.
3. **Botones de Escape Inmediatos:**
   * `[ Restablecer todos los filtros ]`
   * `[ Preguntar al Asistente PlanoClaro ]`
