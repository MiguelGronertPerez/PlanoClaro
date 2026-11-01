/* Accesibilidad universal e inclusión para PlanoClaro:
   1. Ajuste de escala tipográfica (A- / A / A+).
   2. Narrador en voz alta accesible mediante Web Speech API nativa.
   3. Glosario interactivo de términos técnicos en lenguaje simple. */
(function () {
  const LS_ESCALA = 'pc_escala_texto';
  let narrando = false;
  let vozSeleccionada = null;

  // 1. Escala tipográfica
  function aplicarEscala(val) {
    val = Math.max(0.9, Math.min(1.3, Number(val) || 1));
    document.documentElement.style.setProperty('--escala-texto', String(val));
    PC.LS.escribir(LS_ESCALA, val);
    const indicador = document.getElementById('texto-escala-val');
    if (indicador) indicador.textContent = Math.round(val * 100) + ' %';
  }

  function cambiarEscala(delta) {
    const actual = Number(PC.LS.leer(LS_ESCALA, 1)) || 1;
    aplicarEscala(Math.round((actual + delta) * 100) / 100);
  }

  // 2. Narrador en voz alta (Web Speech API)
  function soportadoVoz() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  }

  function obtenerVoces() {
    if (!soportadoVoz()) return;
    const voces = window.speechSynthesis.getVoices();
    vozSeleccionada = voces.find(v => v.lang === 'es-PE') ||
                      voces.find(v => v.lang.startsWith('es-')) ||
                      voces.find(v => v.lang.startsWith('es')) || null;
  }

  if (soportadoVoz() && typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
    window.speechSynthesis.onvoiceschanged = obtenerVoces;
  }

  function detenerNarracion() {
    if (!soportadoVoz()) return;
    window.speechSynthesis.cancel();
    narrando = false;
    actualizarBotonNarrador(false);
  }

  function actualizarBotonNarrador(activo) {
    const btn = document.getElementById('btn-narrador');
    if (!btn) return;
    btn.setAttribute('aria-pressed', String(activo));
    const txt = btn.querySelector('.narrador__txt');
    if (txt) txt.textContent = activo ? 'Detener voz' : 'Leer en voz alta';
  }

  function narrarVistaActual() {
    if (!soportadoVoz()) {
      PC.avisar('Tu navegador no admite la lectura en voz alta.');
      return;
    }
    if (narrando) {
      detenerNarracion();
      PC.avisar('Lectura detenida.');
      return;
    }

    const vistaActual = document.body.dataset.vista || 'inicio';
    const contenedor = document.getElementById('vista-' + vistaActual);
    if (!contenedor) return;

    // Extraer texto significativo
    const titulos = Array.from(contenedor.querySelectorAll('h1, h2, .intro, p')).filter(el => !el.closest('[hidden]') && el.offsetParent !== null);
    const textos = titulos.map(el => el.textContent.trim()).filter(t => t.length > 5).slice(0, 10);

    if (!textos.length) {
      PC.avisar('No hay texto para leer en esta sección.');
      return;
    }

    const textoCompleto = textos.join('. ');
    const locucion = new SpeechSynthesisUtterance(textoCompleto);
    locucion.lang = vozSeleccionada ? vozSeleccionada.lang : 'es-PE';
    if (vozSeleccionada) locucion.voice = vozSeleccionada;
    locucion.rate = 0.95;
    locucion.pitch = 1;

    locucion.onstart = () => {
      narrando = true;
      actualizarBotonNarrador(true);
      PC.avisar('Leyendo contenido en voz alta...');
    };

    locucion.onend = () => {
      narrando = false;
      actualizarBotonNarrador(false);
    };

    locucion.onerror = () => {
      narrando = false;
      actualizarBotonNarrador(false);
    };

    window.speechSynthesis.speak(locucion);
  }

  // 3. Glosario de términos claros
  const TERMINOS_GLOSARIO = [
    {
      id: 'fibra_simetrica',
      termino: 'Fibra óptica simétrica',
      metafora: 'Como una autopista de dos sentidos con igual número de carriles.',
      significado: 'Te da exactamente la misma velocidad para descargar archivos que para enviarlos a internet. Es clave para videollamadas fluidas de trabajo o clases virtuales y subir videos sin cortes.'
    },
    {
      id: 'hfc',
      termino: 'HFC (Cable coaxial)',
      metafora: 'Como una cañería ancha de llegada pero muy angosta de salida.',
      significado: 'Tecnología tradicional que usa cables de televisión. Brinda buena velocidad de descarga, pero la velocidad de subida suele ser muy baja (solo el 10 % o 20 % de lo contratado).'
    },
    {
      id: 'ping',
      termino: 'Ping (Latencia o Lag)',
      metafora: 'El tiempo que tardas en responder cuando alguien te habla.',
      significado: 'Se mide en milisegundos (ms). Indica cuánto tarda la señal en viajar de tu equipo al servidor y volver. Para videojuegos y llamadas, un ping menor a 20 ms es excelente.'
    },
    {
      id: 'garantia_70',
      termino: 'Garantía del 70 % (Ley 31207)',
      metafora: 'El piso mínimo de velocidad que nadie puede quitarte.',
      significado: 'Por ley de OSIPTEL, las empresas de internet fijo deben asegurar que nunca recibas menos del 70 % de la velocidad contratada. Si pagas por 100 Mbps, deben llegarte al menos 70 Mbps.'
    },
    {
      id: 'uso_justo',
      termino: 'Velocidad reducida (Uso justo)',
      metafora: 'Pasar de correr a caminar cuando terminas tu turno de alta velocidad.',
      significado: 'En los planes móviles ilimitados, al consumir los gigas rápidos sigues navegando gratis pero a menor velocidad (256 a 512 kbps). Sirve para mensajes de WhatsApp, pero no para videos.'
    },
    {
      id: 'mesh',
      termino: 'Router Mesh (Malla Wi-Fi)',
      metafora: 'Un equipo de varias antenas que se pasan la posta sin soltar tu teléfono.',
      significado: 'Sistema de repetidores inteligentes para casas de 2 o más pisos o con paredes gruesas. Crean una sola red continua en todo el hogar sin que se corte la llamada al moverte.'
    },
    {
      id: 'permanencia',
      termino: 'Plazo forzoso (Permanencia)',
      metafora: 'El compromiso de no cancelar el contrato antes de tiempo.',
      significado: 'En el Perú está prohibido obligarte a quedarte si solo compraste el chip o solo internet. Solo es legal si te subsidiaron un celular y por un plazo máximo de 12 meses.'
    },
    {
      id: 'portabilidad',
      termino: 'Portabilidad numérica',
      metafora: 'Mudarte de casa llevándote tu misma dirección.',
      significado: 'Trámite gratuito para cambiarte de operador manteniendo tu mismo número celular. Por ley de OSIPTEL se completa en máximo 24 horas y no requiere pagos extra.'
    },
    {
      id: 'sirt',
      termino: 'SIRT de OSIPTEL',
      metafora: 'El registro público notarial de las tarifas de telecomunicaciones.',
      significado: 'Sistema oficial donde todos los operadores de telefonía e internet del Perú tienen la obligación legal de registrar cada tarifa y promoción antes de poder venderla.'
    },
    {
      id: 'trasu',
      termino: 'Tribunal TRASU',
      metafora: 'El juez independiente que defiende tus derechos frente a las empresas.',
      significado: 'Tribunal de Solución de Controversias de OSIPTEL. Si presentas un reclamo formal y la empresa te lo deniega injustamente, el TRASU revisa tu caso y dicta una resolución obligatoria.'
    },
    {
      id: 'tethering',
      termino: 'Compartir datos (Zona Wi-Fi)',
      metafora: 'Convertir tu celular en un módem portátil para tu laptop.',
      significado: 'Función para emitir señal Wi-Fi desde tu celular a computadoras o tablets. Algunos planes postpago incluyen un tope especial de gigas exclusivos para compartir.'
    },
    {
      id: 'roaming',
      termino: 'Roaming internacional',
      metafora: 'Usar tu chip peruano en el extranjero sin comprar uno nuevo.',
      significado: 'Servicio que permite llamar y usar datos en otros países. Varios planes de Claro, Entel y Movistar incluyen cobertura en países de América Latina y Estados Unidos.'
    }
  ];

  PC.glosario = {
    render() {
      const raiz = document.getElementById('glosario');
      if (!raiz) return;
      const h = PC.h;

      const buscador = h('input', {
        type: 'search',
        id: 'glosario-filtro',
        class: 'campo-busqueda',
        placeholder: 'Buscar término (ej.: fibra, ping, ley 70 %)...',
        'aria-label': 'Filtrar términos del glosario'
      });

      const lista = h('div', { class: 'glosario-grid', id: 'glosario-lista' });

      function pintarTerminos(filtro) {
        const f = String(filtro || '').toLowerCase().trim();
        const filtrados = TERMINOS_GLOSARIO.filter(t => !f || t.termino.toLowerCase().includes(f) || t.significado.toLowerCase().includes(f));

        PC.vaciar(lista, filtrados.length ? filtrados.map(t => {
          return h('article', { class: 'tarjeta-termino' },
            h('h2', { class: 'tarjeta-termino__titulo' }, t.termino),
            h('p', { class: 'tarjeta-termino__metafora' },
              h('span', { class: 'tarjeta-termino__etiqueta' }, 'En palabras simples: '),
              t.metafora
            ),
            h('p', { class: 'tarjeta-termino__desc' }, t.significado)
          );
        }) : [
          h('p', { class: 'intro' }, 'No se encontraron términos que coincidan con tu búsqueda.')
        ]);
      }

      buscador.addEventListener('input', e => pintarTerminos(e.target.value));

      PC.vaciar(raiz,
        h('div', { class: 'glosario__cabeza' },
          h('p', { class: 'intro' }, 'Explicamos la jerga técnica de los planes con analogías de todos los días. Sin tecnicismos confusos.'),
          h('div', { class: 'glosario__buscador-env' }, buscador)
        ),
        lista
      );

      pintarTerminos('');
    }
  };

  PC.accesibilidad = {
    iniciar() {
      // Cargar escala guardada
      const escalaGuardada = PC.LS.leer(LS_ESCALA, 1);
      aplicarEscala(escalaGuardada);

      // Eventos de botones de escala
      const btnMenos = document.getElementById('btn-texto-menos');
      const btnReset = document.getElementById('btn-texto-reset');
      const btnMas = document.getElementById('btn-texto-mas');
      const btnNarrador = document.getElementById('btn-narrador');

      if (btnMenos) btnMenos.addEventListener('click', () => cambiarEscala(-0.1));
      if (btnReset) btnReset.addEventListener('click', () => aplicarEscala(1));
      if (btnMas) btnMas.addEventListener('click', () => cambiarEscala(0.1));
      if (btnNarrador) btnNarrador.addEventListener('click', narrarVistaActual);

      // Desplegable de Ajustes (Accesibilidad y Sonido)
      const btnMenu = document.getElementById('btn-menu-ajustes');
      const panelMenu = document.getElementById('panel-menu-ajustes');
      if (btnMenu && panelMenu) {
        btnMenu.addEventListener('click', e => {
          e.stopPropagation();
          const abierto = btnMenu.getAttribute('aria-expanded') === 'true';
          btnMenu.setAttribute('aria-expanded', String(!abierto));
          panelMenu.hidden = abierto;
        });

        document.addEventListener('click', e => {
          if (!panelMenu.hidden && !panelMenu.contains(e.target) && !btnMenu.contains(e.target)) {
            btnMenu.setAttribute('aria-expanded', 'false');
            panelMenu.hidden = true;
          }
        });

        document.addEventListener('keydown', e => {
          if (e.key === 'Escape' && !panelMenu.hidden) {
            btnMenu.setAttribute('aria-expanded', 'false');
            panelMenu.hidden = true;
            btnMenu.focus();
          }
        });
      }

      // Detener narración si cambia de vista
      window.addEventListener('hashchange', detenerNarracion);
    },
    detenerNarracion
  };
})();
