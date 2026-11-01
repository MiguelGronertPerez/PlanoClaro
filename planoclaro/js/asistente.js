/* Asistente conversacional de PlanoClaro: motor de respuestas por reglas y consulta dinámica del catálogo.
   Diseñado según las normas de OSIPTEL, principios de lenguaje claro y guías de interacción de IHC. */
PC.asistente = {
  FAQ: [
    {
      id: 'permanencia',
      claves: ['permanencia', 'plazo forzoso', 'contrato', 'penalidad', 'amarrado', 'atado', 'salir antes', 'cancelar contrato', 'anular contrato', 'multa'],
      pregunta: '¿Qué es la permanencia?',
      r: [
        'Es el tiempo mínimo de compromiso. En el Perú se llama «plazo forzoso».',
        'Por norma de OSIPTEL, solo es legal si compraste un equipo con descuento.',
        'Si solo contratas el chip o solo internet, no te pueden obligar a quedarte.',
        'Pide por escrito cuánto dura y cuánto pagarías si te vas antes.'
      ],
      sugiere: ['portabilidad', 'baja', 'tarifa']
    },
    {
      id: 'velocidad',
      claves: ['velocidad reducida', 'lento', 'baja la velocidad', 'reducida', 'se acaban los gb', 'uso justo', 'ilimitado', 'se acaban los megas', 'lenteja'],
      pregunta: '¿Qué pasa cuando se acaban mis GB?',
      r: [
        'En planes ilimitados, al agotar los GB rápidos sigues navegando, pero más lento.',
        'La velocidad baja a 256 o 512 kbps. Sirve para WhatsApp con texto, pero no para videos.',
        'Revisa en la tarjeta de cada plan cuántos GB de alta velocidad incluye de verdad.'
      ],
      sugiere: ['gb', 'mbps', 'medidor']
    },
    {
      id: 'portabilidad',
      claves: ['portabilidad', 'portar', 'cambiar de operador', 'cambiarme', 'mantener mi numero', 'mismo numero', 'pasarme de empresa', 'pasar mi linea', 'cambiar de empresa'],
      pregunta: '¿Cómo me cambio de empresa sin perder mi número?',
      r: [
        'Eso se llama portabilidad numérica. Es 100 % gratis en todo el Perú.',
        'En celular se hace en máximo 24 horas. Tu línea debe estar activa y sin deudas vencidas.',
        'Pides el cambio en la nueva empresa con tu DNI. Te enviarán un código por SMS.'
      ],
      enlace: ['https://www.osiptel.gob.pe/portal-del-usuario/preguntas-frecuentes/portabilidad-numerica', 'Ver guía de portabilidad en OSIPTEL'],
      sugiere: ['permanencia', 'lineas', 'baja']
    },
    {
      id: 'gb',
      claves: ['gb', 'giga', 'gigas', 'datos', 'megas', 'cuantos gb', 'que es un gb', 'cuantos gigas', 'consumo de datos'],
      pregunta: '¿Qué es un GB y cuántos necesito?',
      r: [
        'Un GB mide la cantidad de internet. 1 GB rinde cerca de 1 hora de video.',
        'WhatsApp con texto casi no gasta. Los videos de TikTok y YouTube gastan mucho.',
        'Para saber tu consumo real de cada mes, usa nuestra guía paso a paso.'
      ],
      accion: 'medidor',
      sugiere: ['velocidad', 'medidor', 'barato_movil']
    },
    {
      id: 'mbps',
      claves: ['mbps', 'megas de velocidad', 'velocidad', 'cuanta velocidad', 'megabits', 'rapidez de internet'],
      pregunta: '¿Cuánta velocidad necesito en casa?',
      r: [
        'Mbps mide la rapidez con la que llega el internet a tu hogar.',
        'Una tele viendo películas en 4K necesita unos 25 Mbps de velocidad.',
        'Suma los equipos conectados a la vez: para 3 o 4 personas, 100 a 200 Mbps es ideal.'
      ],
      sugiere: ['garantia70', 'fibra', 'barato_hogar']
    },
    {
      id: 'garantia70',
      claves: ['70', 'velocidad minima', 'garantizada', 'ley 31207', 'minimo garantizado', 'cuanto me garantizan', 'porcentaje minimo'],
      pregunta: '¿Cuánto de velocidad me deben garantizar por ley?',
      r: [
        'Por la Ley 31207, las empresas deben garantizar al menos el 70 % de la velocidad contratada.',
        'Si contratas 100 Mbps en tu casa, nunca debe llegar menos de 70 Mbps.',
        'Si la empresa no cumple este mínimo, puedes presentar un reclamo por calidad.'
      ],
      enlace: ['https://www.osiptel.gob.pe/portal-del-usuario/', 'Norma de velocidad en OSIPTEL'],
      accion: 'reclamos',
      sugiere: ['mbps', 'reclamo', 'fibra']
    },
    {
      id: 'promocion',
      claves: ['promocion', 'oferta', 'descuento', 'precio sube', 'sube el precio', 'despues', 'precio regular', 'trampa', 'precio real'],
      pregunta: '¿Por qué sube el precio después?',
      r: [
        'El precio con descuento dura solo unos meses. Luego pagas la tarifa regular.',
        'En PlanoClaro sumamos la oferta y los meses restantes para darte el total de 12 meses.',
        'Puedes tocar «Avísame» en cualquier plan para guardar una alarma en tu calendario.'
      ],
      sugiere: ['permanencia', 'barato_hogar', 'tarifa']
    },
    {
      id: 'cobertura',
      claves: ['cobertura', 'provincia', 'provincias', 'llega a mi casa', 'mi distrito', 'arequipa', 'piura', 'cusco', 'trujillo', 'lima', 'callao', 'huancayo', 'chiclayo', 'ica'],
      pregunta: '¿El servicio llega a mi casa?',
      r: [
        'Depende de tu dirección exacta. En internet fijo la cobertura se valida poste por poste.',
        'FiberPro solo atiende Lima y Callao. WOW y MiFibra tienen fuerte presencia en provincias.',
        'Antes de contratar, exige a la empresa que confirme la factibilidad en tu calle.'
      ],
      sugiere: ['fibra', 'operador_wow', 'operador_win']
    },
    {
      id: 'baja',
      claves: ['dar de baja', 'cancelar servicio', 'cancelar linea', 'anular linea', 'anular servicio', 'salirme', 'renunciar', 'baja de servicio'],
      pregunta: '¿Cómo cancelo mi servicio o doy de baja mi plan?',
      r: [
        'Tienes derecho a pedir la baja de tu plan en cualquier momento.',
        'Por ley, la empresa debe aplicar la baja en un plazo máximo de 5 días hábiles.',
        'Puedes pedir la baja por teléfono, web o tienda. No pueden obligarte a ir a una oficina.'
      ],
      enlace: ['https://www.osiptel.gob.pe/portal-del-usuario/preguntas-frecuentes/baja-del-servicio', 'Derecho a baja en OSIPTEL'],
      accion: 'reclamos',
      sugiere: ['permanencia', 'reclamo', 'portabilidad']
    },
    {
      id: 'reclamo',
      claves: ['reclamo', 'reclamar', 'queja', 'problema', 'no funciona', 'trasu', 'me cobraron de mas', 'denuncia', 'averia', 'carta de reclamo', 'formato de reclamo'],
      pregunta: '¿Cómo pongo un reclamo a mi empresa?',
      r: [
        'Primero llama a la empresa y pide tu código de reclamo. Anota la fecha y hora.',
        'Tienen hasta 15 días hábiles para darte una respuesta.',
        'Si no te dan la razón, puedes apelar ante el TRASU de OSIPTEL.'
      ],
      enlace: ['https://www.osiptel.gob.pe/portal-del-usuario/', 'Portal del usuario de OSIPTEL'],
      accion: 'reclamos',
      sugiere: ['lineas', 'baja', 'tarifa']
    },
    {
      id: 'ahorro',
      claves: ['cuanto ahorro', 'ahorro', 'calculadora de ahorro', 'recibo actual', 'cuanto pago hoy', 'mi recibo', 'ahorrar'],
      pregunta: '¿Cómo calculo cuánto me ahorro frente a mi recibo actual?',
      r: [
        'Con nuestra Calculadora de Ahorro puedes ingresar lo que pagas hoy en tu recibo.',
        'El sistema te dice cuánto pagarías en 12 meses y detecta sobrecostos de alquiler de router o seguros.',
        'Te muestra en soles cuánto dinero te ahorras al año.'
      ],
      accion: 'ahorro',
      sugiere: ['barato_movil', 'barato_hogar', 'permanencia']
    },
    {
      id: 'lineas',
      claves: ['lineas a mi nombre', 'checa tus lineas', 'mis lineas', 'dni', 'robo de identidad', 'suplantacion', 'lineas falsas'],
      pregunta: '¿Cómo veo qué líneas están a mi nombre?',
      r: [
        'OSIPTEL tiene una herramienta web gratuita llamada Checa tus líneas.',
        'Ingresas tu DNI y ves al instante cuántas líneas tienes en Claro, Movistar, Entel y Bitel.',
        'Si ves una línea sospechosa, presenta un reclamo de titularidad.'
      ],
      enlace: ['https://checatuslineas.osiptel.gob.pe/', 'Consultar en Checa tus líneas'],
      sugiere: ['portabilidad', 'reclamo', 'tarifa']
    },
    {
      id: 'tarifa',
      claves: ['sirt', 'tarifa oficial', 'tarifa registrada', 'precio oficial', 'verificado', 'confiable', 'fuente', 'de donde sacan los datos'],
      pregunta: '¿Los precios mostrados son confiables?',
      r: [
        'Revisamos las páginas oficiales de cada empresa periódicamente.',
        'Cada dato tiene su sello: verificado en web oficial, fuente secundaria o en conflicto.',
        'Las tarifas oficiales de todas las empresas están registradas ante el SIRT de OSIPTEL.'
      ],
      enlace: ['https://serviciosweb.osiptel.gob.pe/ConsultaSIRT/', 'Buscar tarifas en el SIRT de OSIPTEL'],
      sugiere: ['igv', 'promocion', 'barato_movil']
    },
    {
      id: 'fibra',
      claves: ['fibra optica', 'fibra', 'hfc', 'coaxial', 'cable', 'diferencia fibra', 'que es la fibra', 'adsl', 'cobre'],
      pregunta: '¿Qué ventajas tiene la fibra óptica frente al cable coaxial?',
      r: [
        'La fibra óptica transmite la señal mediante pulsos de luz en hilos de vidrio.',
        'Te da velocidad simétrica: subes y descargas con la misma rapidez.',
        'No sufre por lluvias ni saturación del vecindario. Su tiempo de respuesta o ping es muy bajo.'
      ],
      sugiere: ['simetrica', 'ping', 'mbps']
    },
    {
      id: 'simetrica',
      claves: ['simetrica', 'velocidad simetrica', 'subida y bajada', 'velocidad de subida', 'subir archivos'],
      pregunta: '¿Qué es velocidad simétrica?',
      r: [
        'Significa que tienes la misma velocidad para descargar y para subir contenidos.',
        'Si tienes 200 Mbps simétricos, tus videollamadas van igual de rápido que tus descargas.',
        'El cable coaxial antiguo solo te da buena bajada, pero la subida es muy lenta.'
      ],
      sugiere: ['fibra', 'mbps', 'ping']
    },
    {
      id: 'ping',
      claves: ['ping', 'latencia', 'lag', 'juegos', 'dota', 'valorant', 'fortnite', 'videojuegos', 'milisegundos', 'ms'],
      pregunta: '¿Qué es el ping o la latencia y por qué importa?',
      r: [
        'El ping mide en milisegundos cuánto tarda la señal en ir y volver.',
        'Un número menor significa una respuesta más rápida. Para juegos y llamadas, menos de 20 ms es ideal.',
        'La fibra óptica da el ping más bajo y estable del Perú.'
      ],
      sugiere: ['fibra', 'simetrica', 'operador_win']
    },
    {
      id: 'mesh',
      claves: ['mesh', 'repetidor', 'dos pisos', 'paredes gruesas', 'extensor', 'senal no llega', 'cuarto'],
      pregunta: '¿Qué es un router Mesh o repetidor?',
      r: [
        'Un router Mesh crea una sola red Wi-Fi en toda tu casa.',
        'Si tu casa tiene 2 o más pisos, evita que la señal se pierda entre paredes.',
        'Tu celular pasa de una antena a otra sin cortes de señal.'
      ],
      sugiere: ['mbps', 'cobertura', 'fibra']
    },
    {
      id: 'compartir',
      claves: ['compartir datos', 'compartir internet', 'tethering', 'hotspot', 'zona wifi', 'modem celular', 'laptop'],
      pregunta: '¿Puedo compartir el internet de mi celular a mi computadora?',
      r: [
        'La mayoría de planes postpago permiten compartir datos activando tu zona Wi-Fi.',
        'Ten cuidado: algunos operadores ponen un límite especial de gigas para compartir.',
        'Revisa la letra pequeña de tu plan para ver cuántos gigas te permiten compartir.'
      ],
      sugiere: ['gb', 'velocidad', 'medidor']
    },
    {
      id: 'solo_internet',
      claves: ['solo internet', 'sin cable', 'sin telefono fijo', 'sin telefono', 'sin fijo', 'desempaquetar', 'duos', 'trios', 'solamente internet', 'combo'],
      pregunta: '¿Puedo contratar solo internet sin cable ni teléfono fijo?',
      r: [
        'Sí. Por normativa de OSIPTEL, tienes derecho a contratar internet individual sin atarte a teléfono fijo ni cable.',
        'Muchas empresas promueven combos para cobrar más, pero la fibra sola suele salir mucho más barata.',
        'Comprueba en PlanoClaro los planes individuales de fibra desde 50 soles.'
      ],
      sugiere: ['barato_hogar', 'fibra', 'ahorro']
    },
    {
      id: 'corte_servicio',
      claves: ['corte de servicio', 'cortar el servicio', 'cortar', 'me cortaron', 'corte', 'fin de semana', 'sabado', 'domingo', 'viernes', 'feriado', 'cuando me pueden cortar', 'corte por no pagar'],
      pregunta: '¿Me pueden cortar el servicio un fin de semana?',
      r: [
        'No. Por norma expresa de OSIPTEL, las empresas tienen prohibido suspender el servicio por falta de pago los viernes por la tarde, sábados, domingos o días feriados.',
        'Solo pueden realizar cortes en días hábiles de lunes a jueves en horario de oficina.',
        'Si te cortan en día no permitido, puedes presentar un reclamo inmediato.'
      ],
      sugiere: ['reclamo', 'suspension', 'baja']
    },
    {
      id: 'robo_celular',
      claves: ['robo', 'robar', 'roban', 'me robaron', 'celular robado', 'perdi mi celular', 'perdida de celular', 'bloquear imei', 'bloqueo', 'recuperar numero', 'bloquear celular'],
      pregunta: '¿Qué hago si me roban el celular?',
      r: [
        'Llama de inmediato a tu operador para bloquear la línea y el equipo celular (código IMEI).',
        'La empresa debe registrar el bloqueo en la lista negra nacional de OSIPTEL al instante.',
        'Luego puedes acercarte con tu DNI a una tienda para reponer tu chip con tu mismo número.'
      ],
      sugiere: ['lineas', 'portabilidad']
    },
    {
      id: 'prepago_postpago',
      claves: ['prepago a postpago', 'postpago a prepago', 'migrar a prepago', 'pasar a prepago', 'cambiar a prepago', 'hacerme prepago', 'recargas'],
      pregunta: '¿Puedo pasarme de postpago a prepago?',
      r: [
        'Sí. Tienes derecho a solicitar la migración de tu línea postpago a prepago en cualquier momento.',
        'El trámite es gratuito y no pueden exigirte pagos adelantados si no tienes deudas vencidas.',
        'La empresa debe ejecutar el cambio de modalidad en un plazo máximo de un día hábil.'
      ],
      sugiere: ['baja', 'permanencia', 'portabilidad']
    },
    {
      id: 'esim',
      claves: ['esim', 'chip virtual', 'sim virtual', 'chip digital'],
      pregunta: '¿Qué es una eSIM y quién la ofrece en Perú?',
      r: [
        'Una eSIM es un chip digital integrado directamente en el celular, sin tarjeta física de plástico.',
        'En el Perú, Claro, Movistar y Entel ofrecen activación de eSIM para celulares compatibles.',
        'Es muy útil si tienes un celular importado o quieres tener dos líneas en un solo teléfono.'
      ],
      sugiere: ['operador_claro', 'operador_entel', 'operador_movistar']
    },
    {
      id: 'roaming',
      claves: ['roaming', 'viaje', 'viajar', 'extranjero', 'fuera del peru', 'llamadas internacionales', 'otro pais', 'eeuu'],
      pregunta: '¿Puedo usar mi plan si viajo fuera del Perú?',
      r: [
        'Muchos planes de Claro, Entel y Movistar incluyen roaming en países de América.',
        'Te permite usar tus gigas y minutos fuera del Perú sin comprar otro chip.',
        'Antes de viajar, consulta con tu empresa si tu destino está incluido.'
      ],
      sugiere: ['gb', 'operador_claro', 'operador_entel']
    },
    {
      id: 'suspension',
      claves: ['suspension temporal', 'suspender servicio', 'viaje largo', 'pausar linea', 'congelar plan'],
      pregunta: '¿Puedo suspender mi plan si voy a viajar?',
      r: [
        'Tienes derecho a suspender tu servicio temporalmente sin pagar la mensualidad.',
        'Puedes pedirlo desde 15 días hasta 2 meses al año.',
        'Pídelo a tu empresa antes de que inicie tu nuevo mes de cobro.'
      ],
      sugiere: ['baja', 'permanencia', 'reclamo']
    },
    {
      id: 'averia',
      claves: ['averia', 'se cayo el internet', 'sin servicio', 'corte de internet', 'compensacion', 'descuento por falla'],
      pregunta: '¿Qué pasa si mi internet se corta por una falla técnica?',
      r: [
        'Si el internet se corta por falla de la empresa, no deben cobrarte.',
        'La empresa debe hacer un descuento en tu recibo por el tiempo sin servicio.',
        'Llama de inmediato para registrar tu código de reporte.'
      ],
      accion: 'reclamos',
      sugiere: ['reclamo', 'garantia70', 'baja']
    },
    {
      id: 'contratar',
      claves: ['contratar', 'comprar', 'pagar', 'vender', 'comision', 'como compro', 'afiliarme'],
      pregunta: '¿Puedo contratar planes directamente en PlanoClaro?',
      r: [
        'PlanoClaro no vende planes ni cobra comisiones.',
        'Al tocar «Contratar», te llevamos directo a la web oficial de la empresa.',
        'Así evitas intermediarios y contratas con seguridad.'
      ],
      sugiere: ['tarifa', 'promocion', 'igv']
    },
    {
      id: 'igv',
      claves: ['igv', 'impuesto', 'recibo', 'factura', 'boleta', 'con igv', 'mas impuestos'],
      pregunta: '¿Los precios mostrados incluyen IGV?',
      r: [
        'Todos los precios en PlanoClaro tienen el 18 % de IGV incluido.',
        'Por ley, en el Perú las empresas deben publicar el precio final al cliente.',
        'El monto que ves aquí es el que viene en tu recibo.'
      ],
      sugiere: ['tarifa', 'promocion', 'barato_movil']
    },
    /* Operadores específicos en Perú */
    {
      id: 'operador_claro',
      claves: ['claro', 'planes claro', 'max', 'full claro', 'america movil'],
      pregunta: '¿Qué características tienen los planes de Claro?',
      r: [
        'Claro ofrece planes móviles Max con cobertura 4G y 5G nacional.',
        'Con Full Claro, juntas tu celular con tu internet de casa y te dan más gigas.',
        'En internet fijo cuenta con fibra óptica y cable coaxial HFC.'
      ],
      accion: 'catalogo_claro',
      sugiere: ['operador_movistar', 'operador_entel', 'roaming']
    },
    {
      id: 'operador_movistar',
      claves: ['movistar', 'planes movistar', 'telefonica', 'movistar total'],
      pregunta: '¿Qué características tienen los planes de Movistar?',
      r: [
        'Movistar ofrece amplia cobertura móvil y planes con apps ilimitadas.',
        'Con Movistar Total, tienes descuentos al juntar tu celular con internet de casa.',
        'En internet hogar cuenta con fibra óptica simétrica en varias ciudades.'
      ],
      accion: 'catalogo_movistar',
      sugiere: ['operador_claro', 'operador_entel', 'fibra']
    },
    {
      id: 'operador_entel',
      claves: ['entel', 'planes entel', 'power', 'pasa gigas'],
      pregunta: '¿Qué características tienen los planes de Entel?',
      r: [
        'Entel destaca por su señal veloz y estable en zonas urbanas.',
        'Sus planes Power tienen el beneficio Pasa gigas: lo que no usas pasa al siguiente mes.',
        'En internet para casa ofrece fibra óptica e internet inalámbrico fijo.'
      ],
      accion: 'catalogo_entel',
      sugiere: ['operador_claro', 'operador_bitel', 'gb']
    },
    {
      id: 'operador_bitel',
      claves: ['bitel', 'planes bitel', 'viettel', 'b-ilimitado', 'economico'],
      pregunta: '¿Qué características tienen los planes de Bitel?',
      r: [
        'Bitel ofrece los precios más económicos del mercado peruano.',
        'Sus planes móviles tienen B-Ilimitado: navegas a velocidad reducida al agotar tus gigas.',
        'En internet fijo cuenta con fibra óptica BiFiber a precios muy bajos.'
      ],
      accion: 'catalogo_bitel',
      sugiere: ['operador_claro', 'barato_movil', 'velocidad']
    },
    {
      id: 'operador_win',
      claves: ['win', 'planes win', 'win fibra', 'win internet'],
      pregunta: '¿Qué características tiene el internet de Win?',
      r: [
        'Win ofrece 100 % fibra óptica simétrica para casas y oficinas (no vende celular).',
        'Es muy buscado para videojuegos y trabajo en casa por su conexión estable.',
        'Tiene amplia cobertura en Lima y principales ciudades del Perú.'
      ],
      accion: 'catalogo_win',
      sugiere: ['operador_wow', 'fibra', 'ping']
    },
    {
      id: 'operador_wow',
      claves: ['wow', 'planes wow', 'wow fibra', 'wow internet', 'wow peru'],
      pregunta: '¿Qué características tiene el internet de WOW?',
      r: [
        'WOW ofrece 100 % fibra óptica simétrica con gran presencia en provincias.',
        'Tiene planes veloces desde 49 soles al mes.',
        'En Lima atiende zonas de expansión y distritos periféricos.'
      ],
      accion: 'catalogo_wow',
      sugiere: ['operador_win', 'operador_mifibra', 'fibra']
    },
    {
      id: 'operador_mifibra',
      claves: ['mifibra', 'planes mifibra', 'mi fibra'],
      pregunta: '¿Qué características tiene MiFibra?',
      r: [
        'MiFibra brinda internet por fibra óptica simétrica en el norte, centro y sur.',
        'Suele dar promociones con descuento en los 2 primeros meses.',
        'Sus planes regulares ofrecen buena velocidad para toda la familia.'
      ],
      accion: 'catalogo_mifibra',
      sugiere: ['operador_wow', 'operador_win', 'promocion']
    },
    {
      id: 'operador_fiberpro',
      claves: ['fiberpro', 'planes fiberpro', 'fiber pro'],
      pregunta: '¿Qué características tiene FiberPro?',
      r: [
        'FiberPro ofrece fibra óptica simétrica para Lima Metropolitana y Callao.',
        'Mantiene precios fijos y transparentes sin subidas repentinas.',
        'Ofrece soporte técnico rápido y velocidades simétricas.'
      ],
      accion: 'catalogo_fiberpro',
      sugiere: ['operador_win', 'cobertura', 'fibra']
    },
    /* Saludos, cortesía y ayuda */
    {
      id: 'saludo',
      claves: ['hola', 'buenos dias', 'buenas tardes', 'buenas noches', 'que tal', 'hola bot', 'buenas', 'hey', 'alo', 'como estas'],
      pregunta: '¡Hola! ¿En qué te puedo ayudar hoy?',
      r: [
        '¡Hola! Soy el asistente automático de PlanoClaro.',
        'Puedo buscar el plan más barato, explicarte términos técnicos y tus derechos ante OSIPTEL.',
        'Escribe tu pregunta o toca una sugerencia rápida.'
      ],
      sugiere: ['barato_movil', 'barato_hogar', 'permanencia', 'portabilidad']
    },
    {
      id: 'gracias',
      claves: ['gracias', 'muchas gracias', 'excelente', 'genial', 'vale', 'listo', 'perfecto', 'ok gracias', 'chevere', 'bacán', 'bacan'],
      pregunta: '¡De nada! ¿Tienes alguna otra duda?',
      r: [
        '¡Con gusto! En PlanoClaro te ayudamos a no pagar de más.',
        'Si quieres comparar planes, usa nuestro cuestionario o el comparador.'
      ],
      sugiere: ['barato_movil', 'barato_hogar', 'medidor']
    },
    {
      id: 'despedida',
      claves: ['chau', 'adios', 'hasta luego', 'nos vemos', 'bye', 'chao'],
      pregunta: '¡Hasta luego!',
      r: [
        '¡Hasta pronto! Recuerda revisar la letra pequeña antes de contratar.',
        'Cuando quieras comparar tarifas oficiales del Perú, aquí estaremos.'
      ],
      sugiere: ['barato_movil', 'permanencia']
    },
    {
      id: 'planoclaro',
      claves: ['que es planoclaro', 'quien creo planoclaro', 'ucss', 'miguel', 'proyecto', 'quien eres', 'que haces'],
      pregunta: '¿Qué es PlanoClaro y quién lo creó?',
      r: [
        'PlanoClaro es un comparador de planes de celular e internet del Perú.',
        'Es un proyecto académico de IHC en la UCSS creado por Miguel Gronert.',
        'No vendemos nada ni cobramos comisiones. Comparamos costos reales a 12 meses.'
      ],
      sugiere: ['barato_movil', 'barato_hogar', 'tarifa']
    },
    {
      id: 'ayuda',
      claves: ['ayuda', 'que puedo preguntar', 'que sabes hacer', 'opciones', 'instrucciones', 'menu', 'duda', 'asesoria'],
      pregunta: '¿Qué me puedes preguntar?',
      r: [
        'Pregúntame sobre Claro, Movistar, Entel, Bitel, Win, WOW, MiFibra o FiberPro.',
        'También puedes consultar el plan más barato, la permanencia o cómo reclamar ante OSIPTEL.',
        'Toca un botón de abajo o escribe tu consulta.'
      ],
      sugiere: ['barato_movil', 'barato_hogar', 'portabilidad', 'permanencia']
    }
  ],

  norm(t) {
    return String(t || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9ñ\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  },

  /* Consulta dinámica del catálogo en vivo con desglose matemático transparente */
  consultarCatalogo(textoNorm) {
    const catalogo = PC.estado && Array.isArray(PC.estado.catalogo) ? PC.estado.catalogo : [];
    if (!catalogo.length) return null;

    const quiereMovil = /celular|movil|postpago|linea|fono/.test(textoNorm);
    const quiereHogar = /casa|hogar|internet|fibra|wifi|fijo/.test(textoNorm);
    const buscaBarato = /barato|economico|menor precio|mas comodo|menos cuesta|costo bajo/.test(textoNorm);
    const buscaMasGigas = /mas gigas|mas gb|mas datos|mayor cantidad de datos|mas internet/.test(textoNorm);
    const buscaMasVelocidad = /mas rapido|mayor velocidad|mas mbps|mas megas de velocidad|maxima velocidad|1000/.test(textoNorm);

    // Consulta del plan más barato
    if (buscaBarato) {
      if (quiereMovil || !quiereHogar) {
        // Encontrar por precio regular (la mensualidad fija más baja)
        const porRegular = [...catalogo.filter(p => p.tipo === 'movil')].sort((a, b) => a.precioRegular - b.precioRegular);
        // Encontrar por costo anual (menor pago total en 12 meses, considerando promociones)
        const porAnual = [...catalogo.filter(p => p.tipo === 'movil')].sort((a, b) => PC.costos.anual(a) - PC.costos.anual(b));

        const pReg = porRegular[0];
        const pAnu = porAnual[0];

        if (pReg) {
          const r = [
            `En precio regular de siempre, el plan de celular más económico es ${pReg.nombre} de ${pReg.operador} a ${PC.util.soles(pReg.precioRegular)} al mes con ${pReg.gbAltaVelocidad} GB (total de ${PC.util.soles(pReg.precioRegular * 12)} en 12 meses).`
          ];

          // Si hay otro plan con promoción inicial que sume menos al año
          if (pAnu && pAnu.id !== pReg.id && pAnu.precioPromo) {
            r.push(
              `Si buscas la mejor oferta inicial, ${pAnu.nombre} de ${pAnu.operador} tiene una promoción de ${PC.util.soles(pAnu.precioPromo)} al mes durante los primeros ${pAnu.mesesPromo} meses (su precio regular después es ${PC.util.soles(pAnu.precioRegular)}). En tu primer año pagarás en total ${PC.util.soles(PC.costos.anual(pAnu))} con ${pAnu.gbAltaVelocidad} GB.`
            );
          }

          return {
            id: 'dinamico_barato_movil',
            r,
            accionBoton: { texto: `Comparar ${pReg.nombre}`, idPlan: pReg.id },
            sugiere: ['gb', 'operador_bitel', 'permanencia', 'ahorro']
          };
        }
      }

      if (quiereHogar) {
        const porRegular = [...catalogo.filter(p => p.tipo === 'hogar')].sort((a, b) => a.precioRegular - b.precioRegular);
        const porAnual = [...catalogo.filter(p => p.tipo === 'hogar')].sort((a, b) => PC.costos.anual(a) - PC.costos.anual(b));

        const pReg = porRegular[0];
        const pAnu = porAnual[0];

        if (pReg) {
          const r = [
            `En precio regular, el plan de internet hogar más económico es ${pReg.nombre} de ${pReg.operador} a ${PC.util.soles(pReg.precioRegular)} al mes con ${pReg.velocidadMbps} Mbps (total de ${PC.util.soles(pReg.precioRegular * 12)} en 12 meses).`
          ];

          if (pAnu && pAnu.id !== pReg.id && pAnu.precioPromo) {
            r.push(
              `Por descuento de bienvenida, ${pAnu.nombre} de ${pAnu.operador} baja a ${PC.util.soles(pAnu.precioPromo)} al mes durante los primeros ${pAnu.mesesPromo} meses (precio regular ${PC.util.soles(pAnu.precioRegular)}), sumando un total de ${PC.util.soles(PC.costos.anual(pAnu))} en el primer año.`
            );
          }

          return {
            id: 'dinamico_barato_hogar',
            r,
            accionBoton: { texto: `Comparar ${pReg.nombre}`, idPlan: pReg.id },
            sugiere: ['mbps', 'cobertura', 'promocion', 'ahorro']
          };
        }
      }
    }

    // Consulta de mayor cantidad de GB
    if (buscaMasGigas) {
      const conGigas = catalogo.filter(p => p.tipo === 'movil').sort((a, b) => (b.gbAltaVelocidad || 0) - (a.gbAltaVelocidad || 0));
      const p = conGigas[0];
      if (p) {
        const promoTxt = p.precioPromo ? ` (en promoción inicial a ${PC.util.soles(p.precioPromo)} por ${p.mesesPromo} meses)` : '';
        return {
          id: 'dinamico_mas_gigas',
          r: [
            `El plan móvil con mayor paquete de datos en PlanoClaro es ${p.nombre} de ${p.operador}.`,
            `Te brinda ${p.gbAltaVelocidad} GB de alta velocidad por ${PC.util.soles(p.precioRegular)} al mes${promoTxt}.`,
            `Total en un año completo: ${PC.util.soles(PC.costos.anual(p))}.`
          ],
          accionBoton: { texto: `Comparar ${p.nombre}`, idPlan: p.id },
          sugiere: ['velocidad', 'compartir', 'medidor']
        };
      }
    }

    // Consulta de mayor velocidad de internet de casa
    if (buscaMasVelocidad) {
      const veloces = catalogo.filter(p => p.tipo === 'hogar').sort((a, b) => (b.velocidadMbps || 0) - (a.velocidadMbps || 0));
      const p = veloces[0];
      if (p) {
        return {
          id: 'dinamico_mas_velocidad',
          r: [
            `El internet más veloz en PlanoClaro es ${p.nombre} de ${p.operador}.`,
            `Ofrece una velocidad de ${p.velocidadMbps} Mbps simétricos para descargar y transmitir.`,
            `Su precio regular es de ${PC.util.soles(p.precioRegular)} al mes.`
          ],
          accionBoton: { texto: `Comparar ${p.nombre}`, idPlan: p.id },
          sugiere: ['fibra', 'ping', 'mesh']
        };
      }
    }

    return null;
  },

  buscar(texto) {
    const t = ' ' + this.norm(texto) + ' ';

    // 1. Revisar si es una consulta dinámica del catálogo
    const dinamico = this.consultarCatalogo(t);
    if (dinamico) return dinamico;

    // 2. Búsqueda ponderada en la base de conocimiento
    let mejor = null;
    let maxPuntos = 0;

    this.FAQ.forEach(f => {
      let puntos = 0;
      f.claves.forEach(k => {
        const kNorm = this.norm(k);
        if (t.includes(' ' + kNorm + ' ')) {
          puntos += kNorm.split(' ').length * 4;
        } else if (t.includes(kNorm)) {
          puntos += kNorm.split(' ').length * 2;
        }
      });

      if (puntos > maxPuntos) {
        maxPuntos = puntos;
        mejor = f;
      }
    });

    if (maxPuntos >= 2) return mejor;

    // 3. Respuesta consultiva inteligente para cualquier consulta no clasificada (NUNCA decir "no puedo responder")
    return {
      id: 'orientacion_general',
      r: [
        'Como asesor de telecomunicaciones en el Perú, puedo ayudarte a elegir o solucionar cualquier tema de tu servicio:',
        '• Encontrar el plan más barato para tu celular o la fibra más rápida para tu casa.',
        '• Revisar tu recibo para calcular tu ahorro real y detectar cobros indebidos de routers o seguros.',
        '• Orientarte sobre tus derechos ante OSIPTEL: portabilidad en 24 horas, baja en 5 días o reclamos por velocidad.',
        '¿Sobre qué operador o duda en específico te gustaría que te guíe?'
      ],
      sugiere: ['barato_movil', 'barato_hogar', 'portabilidad', 'permanencia', 'ahorro']
    };
  },

  mensaje(quien, partes) {
    const h = PC.h;
    const log = document.getElementById('chat-log');
    if (!log) return;

    const m = h('div', { class: 'msj msj--' + quien },
      h('p', { class: 'sr-only' }, quien === 'yo' ? 'Tú dijiste:' : 'Asistente:'),
      partes
    );

    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
  },

  mostrarEscribiendo() {
    const log = document.getElementById('chat-log');
    if (!log) return null;
    const el = PC.h('div', { class: 'msj--escribiendo', id: 'indicador-escribiendo', ariaHidden: 'true' },
      PC.h('span', { class: 'punto-escribiendo' }),
      PC.h('span', { class: 'punto-escribiendo' }),
      PC.h('span', { class: 'punto-escribiendo' })
    );
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  },

  quitarEscribiendo() {
    const el = document.getElementById('indicador-escribiendo');
    if (el) el.remove();
  },

  actualizarSugerencias(claves) {
    const sug = document.getElementById('chat-sugerencias');
    if (!sug) return;

    let lista = (claves || []).map(id => {
      if (id === 'barato_movil') return { texto: '¿Cuál es el celular más barato?', pregunta: '¿Cuál es el plan más barato de celular?' };
      if (id === 'barato_hogar') return { texto: '¿Cuál es el internet más barato?', pregunta: '¿Cuál es el internet más barato para la casa?' };
      const f = this.FAQ.find(x => x.id === id);
      return f ? { texto: f.pregunta, pregunta: f.pregunta } : null;
    }).filter(Boolean);

    if (lista.length < 4) {
      const defecto = [
        { texto: '¿Qué es la permanencia?', pregunta: '¿Qué es la permanencia?' },
        { texto: '¿Cómo me cambio de empresa?', pregunta: '¿Cómo me cambio de empresa sin perder mi número?' },
        { texto: '¿Qué pasa si acabo mis GB?', pregunta: '¿Qué pasa cuando se acaban mis GB?' },
        { texto: '¿Qué es la fibra óptica?', pregunta: '¿Qué ventajas tiene la fibra óptica frente al cable coaxial?' },
        { texto: '¿Cómo reclamo ante OSIPTEL?', pregunta: '¿Cómo pongo un reclamo a mi empresa?' }
      ];
      defecto.forEach(d => {
        if (!lista.some(x => x.pregunta === d.pregunta) && lista.length < 6) lista.push(d);
      });
    }

    PC.vaciar(sug, lista.map(item => {
      const b = PC.h('button', { type: 'button', class: 'chip' }, item.texto);
      b.addEventListener('click', () => this.responder(item.pregunta));
      return b;
    }));
  },

  responder(texto) {
    const h = PC.h;
    texto = String(texto || '').slice(0, 200).trim();
    if (!texto) return;

    this.mensaje('yo', h('p', null, texto));

    const demora = PC.mov && PC.mov.reducido() ? 0 : 180;
    this.mostrarEscribiendo();

    setTimeout(() => {
      this.quitarEscribiendo();

      const f = this.buscar(texto);
      const partes = f.r.map(x => h('p', null, x));

      // Acciones y enlaces interactivos
      const acciones = [];
      if (f.enlace) {
        acciones.push(PC.enlaceExterno(f.enlace[0], f.enlace[1], 'btn-accion-chat'));
      }
      if (f.accion === 'medidor') {
        const btnMed = h('button', { type: 'button', class: 'btn-accion-chat', dataset: { ir: 'medidor' } }, 'Abrir guía «Medir mi consumo»');
        acciones.push(btnMed);
      }
      if (f.accion === 'ahorro') {
        const btnAhorro = h('button', { type: 'button', class: 'btn-accion-chat', dataset: { ir: 'ahorro' } }, 'Abrir Calculadora de ahorro');
        acciones.push(btnAhorro);
      }
      if (f.accion === 'reclamos') {
        const btnRec = h('button', { type: 'button', class: 'btn-accion-chat', dataset: { ir: 'reclamos' } }, 'Generar solicitud formal OSIPTEL');
        acciones.push(btnRec);
      }
      if (f.accion === 'glosario') {
        const btnGlo = h('button', { type: 'button', class: 'btn-accion-chat', dataset: { ir: 'glosario' } }, 'Ver Glosario en lenguaje claro');
        acciones.push(btnGlo);
      }
      if (f.accionBoton && f.accionBoton.idPlan) {
        const btnComp = h('button', { type: 'button', class: 'btn-accion-chat', dataset: { comp: f.accionBoton.idPlan } }, f.accionBoton.texto);
        acciones.push(btnComp);
      }
      if (String(f.accion || '').startsWith('catalogo_')) {
        const op = f.accion.replace('catalogo_', '');
        const btnServ = h('button', { type: 'button', class: 'btn-accion-chat', dataset: { ir: 'inicio' } }, `Ver planes de ${op.toUpperCase()}`);
        acciones.push(btnServ);
      }

      if (acciones.length) {
        partes.push(h('div', { class: 'msj-acciones' }, acciones));
      }

      this.mensaje('bot', partes);
      PC.metricas.registrar('chat', { faq: f.id });

      // Actualizar sugerencias contextuales
      this.actualizarSugerencias(f.sugiere || ['barato_movil', 'permanencia', 'portabilidad']);
    }, demora);
  },

  reiniciar() {
    const log = document.getElementById('chat-log');
    if (log) log.replaceChildren();

    this.mensaje('bot', [
      PC.h('p', null, '¡Hola! Soy tu asistente de PlanoClaro.'),
      PC.h('p', null, 'Pregúntame sobre planes de celular, internet de casa, portabilidad, permanencia o tus derechos ante OSIPTEL. Te respondo en lenguaje claro.')
    ]);

    this.actualizarSugerencias([
      'barato_movil',
      'barato_hogar',
      'permanencia',
      'portabilidad',
      'velocidad',
      'fibra',
      'reclamo'
    ]);
  },

  iniciar() {
    const panel = document.getElementById('asistente');
    const abrir = document.getElementById('abrir-asistente');
    const cerrar = document.getElementById('cerrar-asistente');
    const reiniciar = document.getElementById('reiniciar-asistente');
    const form = document.getElementById('chat-form');
    const entrada = document.getElementById('chat-entrada');

    if (!panel || !abrir) return;

    this.reiniciar();

    const cerrarPanel = () => {
      panel.classList.remove('asistente--abierto');
      abrir.setAttribute('aria-expanded', 'false');
      setTimeout(() => {
        if (!panel.classList.contains('asistente--abierto')) panel.hidden = true;
      }, PC.mov && PC.mov.reducido() ? 0 : 220);
      abrir.focus();
    };

    abrir.addEventListener('click', () => {
      if (!panel.hidden) {
        cerrarPanel();
        return;
      }
      panel.hidden = false;
      void panel.offsetWidth;
      panel.classList.add('asistente--abierto');
      abrir.setAttribute('aria-expanded', 'true');
      if (entrada) entrada.focus();
    });

    if (cerrar) cerrar.addEventListener('click', cerrarPanel);
    if (reiniciar) reiniciar.addEventListener('click', () => {
      this.reiniciar();
      if (entrada) entrada.focus();
    });

    panel.addEventListener('keydown', e => {
      if (e.key === 'Escape') cerrarPanel();
    });

    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        if (!entrada) return;
        const val = entrada.value;
        entrada.value = '';
        this.responder(val);
      });
    }
  }
};
