// Endpoint Serverless Vercel para el Asistente con Google Gemini AI
// Gestiona memoria conversacional, RAG con el catálogo de PlanoClaro y evita truncado de tokens.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const pregunta = String(body.pregunta || '').trim().slice(0, 400);
    const historial = Array.isArray(body.historial) ? body.historial : [];
    const catalogo = Array.isArray(body.catalogo) ? body.catalogo : [];

    if (!pregunta) {
      return res.status(400).json({ error: 'Pregunta requerida' });
    }

    const key = process.env.GEMINI_API_KEY || Buffer.from('QVEuQWI4Uk42STZ5MmNHY1FfTzhpVjA1UzB6dG5IcFFZS2hiN05ieXJVN3NFaEFfSG9ma2c=', 'base64').toString('utf8');

    // Resumen del catálogo oficial para contextualizar
    const resumenCat = catalogo.length
      ? catalogo.map(p =>
          `- ${p.operador} ${p.nombre} (${p.tipo}): S/ ${p.precioRegular}/mes${p.precioPromo ? ` (promo S/ ${p.precioPromo} x ${p.mesesPromo}m)` : ''}, ` +
          (p.tipo === 'movil' ? `${p.gbAltaVelocidad} GB` : `${p.velocidadMbps} Mbps`)
        ).join('\n')
      : '';

    const promptSistema = `Eres el Asistente Inteligente oficial de PlanoClaro (comparador de telecomunicaciones en Perú, creado por Miguel Armando Gronert Perez en UCSS).
Tu objetivo es responder con total naturalidad, calidez humana, claridad y precisión técnica a cualquier consulta sobre celular e internet hogar en el Perú.
Directrices:
1. Responde de forma completa pero concisa (2 a 4 párrafos cortos o viñetas claras). No cortes la respuesta a medias.
2. Habla en español peruano natural y amigable (ej. "¡Hola!", "Sí te alcanza", "Tienes estas opciones").
3. Precios siempre en soles (S/) con IGV incluido.
4. Catálogo oficial de planes de PlanoClaro:
${resumenCat}
5. Normas OSIPTEL clave: portabilidad móvil en 24h gratis, baja en 5 días hábiles, prohibido cortar servicios por falta de pago fines de semana o feriados, velocidad mínima garantizada 70% (Ley 31207), contratos forzosos ilegales si no se compró equipo con descuento.
6. Si preguntan por presupuestos (ej. "tengo 50 soles", "planes de 40"), da los planes reales exactos y compáralos con honestidad.`;

    // Estructurar historial conversacional para que entienda preguntas de seguimiento ("cuales me recomiendas", "y para casa?")
    const contents = [];
    if (historial.length) {
      historial.slice(-6).forEach(h => {
        if (!h.texto) return;
        contents.push({
          role: h.quien === 'yo' ? 'user' : 'model',
          parts: [{ text: String(h.texto).slice(0, 300) }]
        });
      });
    }
    // Agregar la pregunta actual del usuario
    contents.push({
      role: 'user',
      parts: [{ text: pregunta }]
    });

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${encodeURIComponent(key)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9500);

    const apiRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: promptSistema }]
        },
        contents: contents,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1024,
          thinkingConfig: {
            thinkingBudget: 0
          }
        }
      })
    });
    clearTimeout(timeout);

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      return res.status(502).json({ error: 'Error del servicio Gemini', detalle: errText });
    }

    const data = await apiRes.json();
    const textoRespuesta = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
    const parrafos = textoRespuesta.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

    // Botones de acción dinámicos para comparar los planes sugeridos
    const botones = [];
    if (catalogo.length && textoRespuesta) {
      const txtMin = textoRespuesta.toLowerCase();
      catalogo.forEach(p => {
        const nomMin = p.nombre.toLowerCase();
        const opMin = p.operador.toLowerCase();
        if (txtMin.includes(nomMin) || (txtMin.includes(opMin) && txtMin.includes(String(Math.floor(p.precioRegular))))) {
          if (!botones.some(b => b.idPlan === p.id) && botones.length < 3) {
            botones.push({
              texto: `Comparar ${p.operador} ${p.nombre}`,
              idPlan: p.id
            });
          }
        }
      });
    }

    return res.status(200).json({
      ok: true,
      modelo: 'gemini-3.5-flash',
      parrafos,
      botones
    });

  } catch (error) {
    return res.status(500).json({ error: 'Error interno', mensaje: error.message });
  }
}
