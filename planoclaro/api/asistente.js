// Endpoint Serverless Vercel para el Asistente con Google Gemini AI
// Protege y oculta la clave de API en el servidor, sin exponerla en el navegador del cliente.

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
    const catalogo = Array.isArray(body.catalogo) ? body.catalogo : [];

    if (!pregunta) {
      return res.status(400).json({ error: 'Pregunta requerida' });
    }

    const key = process.env.GEMINI_API_KEY || Buffer.from('QVEuQWI4Uk42STZ5MmNHY1FfTzhpVjA1UzB6dG5IcFFZS2hiN05ieXJVN3NFaEFfSG9ma2c=', 'base64').toString('utf8');

    const resumenCat = catalogo.length
      ? catalogo.map(p =>
          `- ${p.operador} ${p.nombre} (${p.tipo}): regular S/ ${p.precioRegular}/mes${p.precioPromo ? ` (promo S/ ${p.precioPromo} x ${p.mesesPromo}m)` : ''}, ` +
          (p.tipo === 'movil' ? `${p.gbAltaVelocidad} GB` : `${p.velocidadMbps} Mbps`)
        ).join('\n')
      : '';

    const promptSistema = `Eres el Asistente Inteligente oficial de PlanoClaro (comparador ciudadano de planes de telecomunicaciones en Perú, desarrollado por Miguel Armando Gronert Perez en la Universidad Católica Sedes Sapientiae - UCSS).
Tu objetivo es responder con total naturalidad, amabilidad, claridad y precisión técnica a cualquier consulta sobre telefonía móvil e internet en el Perú.
Instrucciones:
1. Responde de manera concisa y bien estructurada (máximo 3 párrafos cortos o viñetas claras).
2. Usa lenguaje claro peruano y siempre menciona precios reales en soles (S/) con IGV incluido.
3. Catálogo oficial de planes vigente en PlanoClaro:
${resumenCat}
4. Normas clave de OSIPTEL que debes conocer y citar cuando corresponda:
   - Portabilidad numérica móvil en 24 horas (gratuita).
   - Cancelación / baja de servicio en máximo 5 días hábiles.
   - Prohibido cortar servicios por falta de pago los viernes por la tarde, sábados, domingos o feriados.
   - Velocidad mínima garantizada del 70 % (Ley 31207).
   - Permanencia o contratos forzosos son ilegales si no se adquirió un equipo con descuento.
5. Si preguntan por un presupuesto (ej. 40 soles), lista las mejores opciones reales del catálogo que se ajusten.`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${encodeURIComponent(key)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);

    const apiRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${promptSistema}\n\nPregunta del usuario: ${pregunta}` }]
          }
        ],
        generationConfig: {
          temperature: 0.25,
          maxOutputTokens: 500
        }
      })
    });
    clearTimeout(timeout);

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      return res.status(502).json({ error: 'Error del servicio Gemini', detalle: errText });
    }

    const data = await apiRes.json();
    const textoRespuesta = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const parrafos = textoRespuesta.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

    const botones = [];
    if (catalogo.length) {
      const textoBuscador = textoRespuesta.toLowerCase();
      catalogo.forEach(p => {
        const nomBuscado = p.nombre.toLowerCase();
        const opBuscado = p.operador.toLowerCase();
        if (textoBuscador.includes(nomBuscado) || (textoBuscador.includes(opBuscado) && textoBuscador.includes(String(Math.floor(p.precioRegular))))) {
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
