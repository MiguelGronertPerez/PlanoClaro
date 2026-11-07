/* Resultados y Catálogo: tarjetas con jerarquía de precio dominante, sello explícito de IGV (18%),
   filtros instantáneos en 1 paso (operador, precio, búsqueda), estado sin resultados asistido (zero-state)
   y principios de diseño visual de IHC (Semana 12). */
PC.vista = {
  filtroActual: { busqueda: '', operador: 'todos', precioMax: 0, orden: 'recomendados' },
  ultimoTipo: 'movil',
  ultimosDatos: null,

  sello(estado, corto) {
    const e = PC.ETIQUETAS_VERIF[estado] || PC.ETIQUETAS_VERIF.no_verificado;
    return PC.h('span', { class: 'sello sello--' + e.clase }, PC.icono(e.icono), corto ? e.corto : e.texto);
  },

  selloIGV() {
    return PC.h('span', { class: 'sello--igv', title: 'Precio final reglamentado por OSIPTEL' },
      PC.icono('ok'), 'Con IGV incluido (18 %)');
  },

  resumenPerfil(tipo, n, rel) {
    const h = PC.h;
    const partes = tipo === 'movil'
      ? ['Calculamos que necesitas unos ', h('strong', null, `${n.gb} GB al mes`), ` (${PC.util.explicarGB(n.gb)})${n.intl ? ' y poder usarlo fuera del Perú' : ''}.`]
      : ['Para tu casa recomendamos al menos ', h('strong', null, `${n.mbps} Mbps`), ` (${PC.util.explicarMbps(n.mbps)})${n.casaGrande ? ' y buen WiFi en varios pisos' : ''}.`];
    if (n.zona === 'provincia') partes.push(' Vives en provincias: confirma la cobertura con tu dirección exacta antes de contratar.');
    if (rel) partes.push(' ', h('strong', { class: 'alerta' }, 'Ningún plan entra en tu presupuesto con ese uso. Te mostramos los más cercanos.'));
    return partes;
  },

  queIncluye(p) {
    if (p.tipo === 'movil') {
      const datos = p.gbAltaVelocidad == null
        ? 'Internet sin límite de GB (con reglas de uso justo)'
        : `${p.gbAltaVelocidad} GB de alta velocidad: ${PC.util.explicarGB(p.gbAltaVelocidad)}${p.datosIlimitados ? '. Después sigues navegando, pero más lento' : ''}`;
      const compartir = p.gbAltaVelocidad >= 25
        ? 'Permite compartir internet (hotspot) a tu laptop o tablet'
        : 'Recomendado para uso directo en celular';
      return [datos, compartir, ...(p.extras || [])];
    }
    return [
      `${p.velocidadMbps} Mbps por ${p.tecnologia.toLowerCase()}: ${PC.util.explicarMbps(p.velocidadMbps)}`,
      p.simetrica ? 'Velocidad simétrica: sube archivos igual de rápido que descarga' : (p.simetrica === false ? 'Sube archivos más lento de lo que descarga' : 'Velocidad de subida: no la pudimos verificar'),
      p.cobertura === 'lima' ? 'Disponible solo en Lima Metropolitana y Callao' : 'Disponible en Lima y provincias (sujeto a cobertura técnica)',
      p.incluyeMesh && typeof p.costoEquipo !== 'string' ? 'Incluye repetidor WiFi Mesh para cubrir 2 pisos' : null,
      p.costoEquipo && typeof p.costoEquipo === 'string' ? 'Equipo: ' + p.costoEquipo : null
    ].filter(Boolean);
  },

  fila(concepto, monto, clase) {
    const h = PC.h;
    return h('div', { class: 'fila' + (clase ? ' ' + clase : '') }, h('dt', null, concepto), h('span', { class: 'fila__puntos', 'aria-hidden': 'true' }), h('dd', null, monto));
  },

  enlacesFuente(p) {
    const out = [];
    (p.fuentes || []).forEach(u => { if (!PC.util.urlSegura(u)) return; if (out.length) out.push(', '); out.push(PC.enlaceExterno(u, PC.util.dominio(u))); });
    return out.length ? out : ['sin enlace'];
  },

  botonAccion(icono, texto, extra) {
    return PC.h('button', Object.assign({ type: 'button', class: 'accion' }, extra || {}), PC.icono(icono), PC.h('span', null, texto));
  },

  tarjeta(o, n) {
    const h = PC.h, p = o.plan, c = PC.costos, s = PC.util.soles;
    const hayPromo = p.precioPromo != null;
    const instal = typeof p.costoInstalacion === 'number' ? (p.costoInstalacion === 0 ? 'S/ 0.00 (Gratis)' : s(p.costoInstalacion)) : 'no publicado';
    const tid = 'plan-' + p.id;
    
    // Jerarquía dominante: precio mensual grande con tipografía tabular
    const monto = h('span', { class: 'precio__monto plan__precio-destacado', dataset: { valor: String(hayPromo ? p.precioPromo : p.precioRegular) } }, s(hayPromo ? p.precioPromo : p.precioRegular));
    const anual = h('strong', { class: 'anual__monto', dataset: { valor: String(c.anual(p)) } }, s(c.anual(p)));
    
    // Botones con contraste sólido (Semana 12: nunca gris claro sobre blanco)
    const fav = this.botonAccion('estrella', 'Guardar', { 'aria-pressed': String(PC.favoritos.tiene(p.id)), dataset: { fav: p.id }, 'aria-label': `Guardar ${p.operador} ${p.nombre} en favoritos` });
    const comp = this.botonAccion('mas', 'Comparar', { 'aria-pressed': String(PC.carrito.tiene(p.id)), dataset: { comp: p.id }, 'aria-label': `Comparar ${p.operador} ${p.nombre}` });
    const elegir = this.botonAccion('ok', 'Elegí este', { class: 'accion accion--solida', dataset: { elegirPlan: p.id }, 'aria-label': `Elegir ${p.operador} ${p.nombre} y dejar reseña` });
    const acciones = [fav, comp, elegir];
    if (hayPromo) {
      const ics = this.botonAccion('calendario', 'Avísame', { dataset: { ics: p.id }, 'aria-label': `Avísame cuando sube el precio de ${p.operador} ${p.nombre} (descarga un recordatorio)` });
      acciones.push(ics);
    }
    const urlOf = PC.util.urlOficial(p);

    return h('article', { class: `plan plan--${o.clave} inclinable`, 'aria-labelledby': tid, dataset: { id: p.id, operador: p.operador } },
      h('div', { class: 'plan__brillo', 'aria-hidden': 'true' }),
      h('div', { class: 'plan__cabeza' },
        h('div', { style: 'display:flex;justify-content:space-between;align-items:center;margin-bottom:.3rem' },
          h('p', { class: 'plan__perfil' }, o.titulo || p.nombre),
          this.selloIGV()
        ),
        h('h3', { id: tid }, h('span', { class: `chip-operador chip-operador--${p.operador.toLowerCase()}` }, p.operador), ' ', h('span', { class: 'plan__nombre' }, p.nombre))
      ),
      h('div', { class: 'precio', style: 'margin: .8rem 0;' },
        h('span', { class: 'precio__etq' }, hayPromo ? 'Precio oferta primeros meses' : 'Tarifa mensual fija'),
        monto,
        h('span', { class: 'precio__per' }, ' al mes (con IGV)')
      ),
      h('dl', { class: 'recibo' },
        this.fila(hayPromo ? `Mes 1${p.mesesPromo > 1 ? ' al ' + p.mesesPromo : ''} (promoción)` : 'Todos los meses (precio de siempre)', s(hayPromo ? p.precioPromo : p.precioRegular)),
        hayPromo ? this.fila(`Desde el mes ${p.mesesPromo + 1} (precio regular)`, s(p.precioRegular), 'fila--fuerte') : null,
        this.fila('Instalación o activación', instal)
      ),
      hayPromo && p.condicionPromo ? h('p', { class: 'precio__cond' }, h('strong', null, 'Condición de la oferta: '), p.condicionPromo) : null,
      h('div', { class: 'anual' },
        h('p', { class: 'anual__fila' }, h('span', null, 'Costo total en 12 meses (con IGV)'), anual),
        h('p', { class: 'anual__detalle' }, `${c.detalle(p)}. Promedio real: ${s(c.promedioMensual(p))} al mes.`)),
      h('h4', null, 'Qué incluye (sin letra chiquita)'),
      h('ul', { class: 'incluye' }, this.queIncluye(p).map(x => h('li', null, x))),
      p.tipo === 'hogar' && n && n.casaGrande && !p.incluyeMesh ? h('p', { class: 'nota-plan' }, h('strong', null, 'Consejo para tu casa: '), 'Es amplia/de varios pisos. Pregunta si el operador te cobra alquiler mensual por repetidor WiFi.') : null,
      p.notas ? h('p', { class: 'nota-plan' }, h('strong', null, 'Transparencia: '), p.notas) : null,
      h('div', { class: 'plan__pie' },
        h('p', { class: 'plan__verif' }, 'Tarifa: ', this.sello(p.verificacion.precio)),
        h('p', { class: 'plan__fuente' }, 'Fuente oficial: ', this.enlacesFuente(p), ` · verificado el ${PC.util.fecha(p.fechaConsulta)}`),
        h('div', { class: 'plan__acciones', role: 'group', 'aria-label': 'Acciones del plan' }, acciones),
        urlOf ? PC.enlaceExterno(urlOf, `Contratar en la web de ${p.operador}`, 'boton boton--primario boton--ancho plan__cta-principal') : null
      )
    );
  },

  renderZeroState(tipo, motivo) {
    const h = PC.h;
    return h('div', { class: 'sin-resultados', role: 'alert' },
      h('div', { class: 'sin-resultados__icono', 'aria-hidden': 'true' }, '!'),
      h('h3', { class: 'sin-resultados__titulo' }, 'No encontramos planes con esos filtros exactos'),
      h('p', { class: 'sin-resultados__texto' }, motivo || 'Ningún plan en nuestro catálogo cumple todos los límites de precio y características que marcaste simultáneamente.'),
      h('div', { class: 'sin-resultados__sugerencias' },
        h('h4', null, 'Sugerencias para encontrar tu plan:'),
        h('ul', null,
          tipo === 'movil'
            ? [
                h('li', null, 'Prueba eligiendo «Todos los operadores» para comparar Claro, Entel, Bitel y Movistar.'),
                h('li', null, 'Los planes postpago más económicos para estudiantes parten desde S/ 29.90 al mes.'),
                h('li', null, 'Si necesitas más de 30 GB para compartir a tu laptop, el rango sugerido es de S/ 39.90 a S/ 55.00 al mes.')
              ]
            : [
                h('li', null, 'Prueba ampliando el presupuesto: los planes de fibra óptica hogar parten desde S/ 45.00 al mes.'),
                h('li', null, 'Revisa si los operadores regionales (WOW, MiFibra, Win) tienen cobertura en tu distrito.'),
                h('li', null, 'Para casas familiares de 4 o más personas recomendamos al menos 100 a 200 Mbps.')
              ]
        )
      ),
      h('div', { class: 'sin-resultados__acciones' },
        h('button', { type: 'button', class: 'boton boton--primario', id: 'btn-reset-filtros-zero' }, 'Restablecer todos los filtros'),
        h('button', { type: 'button', class: 'boton boton--fantasma', id: 'btn-abrir-asistente-zero' }, 'Preguntar al Asistente PlanoClaro')
      )
    );
  },

  letraChica(opciones) {
    const h = PC.h, s = PC.util.soles, sello = e => this.sello(e, true);
    const bloque = (titulo, intro, fn) => h('article', { class: 'lc revelar' }, h('h3', null, titulo), h('p', { class: 'lc__intro' }, intro),
      h('ul', null, opciones.map(o => h('li', null, h('strong', null, `${o.plan.operador} ${o.plan.nombre}: `), fn(o.plan)))));
    const vel = p => {
      if (p.tipo === 'movil') {
        if (p.gbAltaVelocidad == null) return ['Sin tope publicado, pero hay uso justo: no permite revender ni descargas masivas. ', sello(p.verificacion.velocidadTrasConsumo)];
        return [`Al gastar ${p.gbAltaVelocidad} GB, ${p.datosIlimitados ? 'sigues navegando, pero lento' : 'se corta o te cobran extra'}. Qué tan lento: `, sello(p.verificacion.velocidadTrasConsumo)];
      }
      return [p.topeGB ? `Tope de ${p.topeGB} GB; luego va muy lento. ` : 'Sin tope de uso. ',
        p.velocidadMinimaGarantizada ? `Velocidad mínima garantizada: ${p.velocidadMinimaGarantizada} de lo contratado.` : ['Velocidad mínima garantizada: ', sello('no_verificado')]];
    };
    const promo = p => p.precioPromo != null
      ? [`Oferta por ${p.mesesPromo} ${PC.util.plural(p.mesesPromo, 'mes', 'meses')}. Desde el mes ${p.mesesPromo + 1} pagas ${s(p.precioRegular)}. Todos los precios con IGV. `, sello(p.verificacion.precio)]
      : [`Sin oferta: ${s(p.precioRegular)} desde el primer mes (con IGV). `, sello(p.verificacion.precio)];
    const perm = p => [p.permanencia ? p.permanencia + '. ' : 'No lo publican en las páginas que revisamos. Pídelo por escrito. ', sello(p.permanencia ? 'no_verificado' : p.verificacion.permanencia)];
    const equipo = p => {
      const inst = typeof p.costoInstalacion === 'number' ? (p.costoInstalacion === 0 ? 'Instalación o activación gratis' : `Instalación ${s(p.costoInstalacion)}`) : 'No publican cuánto cuesta instalar';
      return [inst, p.tipo === 'hogar' ? ['. ', sello(p.verificacion.instalacion)] : null,
        p.tipo === 'movil' ? '. Si compras un celular en cuotas, esas cuotas te atan al contrato.' : '. Los equipos son prestados: devuélvelos al darte de baja.'];
    };
    return [
      bloque('Velocidad y uso justo', 'En internet fijo, la ley exige garantizar al menos el 70 % de la velocidad contratada (Ley 31207). Si no llega, puedes reclamar ante OSIPTEL.', vel),
      bloque('La oferta y el precio de siempre (con IGV)', 'La oferta dura pocos meses. Lo que pagarás la mayor parte del año es el precio regular, que por ley ya incluye el 18 % de IGV.', promo),
      bloque('Contrato y permanencia', '«Plazo forzoso» solo es legal si financiaste un equipo en cuotas. Pide siempre la copia del contrato en PDF.', perm),
      bloque('Instalación y equipos', 'Pregunta siempre si el router y el repetidor son prestados (comodato) o se cobran mensualmente.', equipo),
      h('article', { class: 'lc lc--osiptel revelar' }, h('h3', null, 'Tus derechos como usuario (OSIPTEL)'),
        h('ul', null,
          h('li', null, 'Cambiarte de empresa manteniendo tu número (portabilidad) es gratis y en celular se hace en máximo 24 horas. ', PC.enlaceExterno('https://www.osiptel.gob.pe/portal-del-usuario/preguntas-frecuentes/portabilidad-numerica', 'Preguntas frecuentes de OSIPTEL')),
          h('li', null, 'Revisa qué líneas están a tu nombre en ', PC.enlaceExterno('https://checatuslineas.osiptel.gob.pe/', 'Checa tus líneas'), '.'),
          h('li', null, 'Busca la tarifa oficial registrada del plan en el ', PC.enlaceExterno('https://serviciosweb.osiptel.gob.pe/ConsultaSIRT/', 'SIRT de OSIPTEL'), '.'),
          h('li', null, 'Si tienes un problema, primero reclama a la empresa. Si no te dan la razón, apela ante el TRASU de OSIPTEL.'),
          h('li', null, '¿Quieres cancelar tu servicio o reclamar por cobros o lentitud? ', PC.h('button', { type: 'button', class: 'enlace', dataset: { ir: 'reclamos' } }, 'Redactar solicitud formal OSIPTEL'), '.')))
    ];
  },

  montarBarraFiltros(tipo, catalogoBase) {
    const contenedor = document.getElementById('barra-filtros');
    if (!contenedor) return;

    // Extraer operadores únicos disponibles para este tipo de servicio
    const operadores = ['todos', ...new Set(catalogoBase.map(p => p.operador))];
    const grupoOps = document.getElementById('grupo-operadores');
    if (grupoOps) {
      PC.vaciar(grupoOps, [
        PC.h('span', { class: 'filtro-chip-etq' }, 'Empresa:'),
        ...operadores.map(op => {
          const esActivo = this.filtroActual.operador.toLowerCase() === op.toLowerCase();
          return PC.h('button', {
            type: 'button',
            class: `filtro-chip${esActivo ? ' filtro-chip--activo' : ''}`,
            dataset: { filtroOp: op },
            'aria-pressed': String(esActivo)
          }, op === 'todos' ? 'Todas' : op);
        })
      ]);
    }

    // Vincular input de búsqueda
    const inputBuscar = document.getElementById('filtro-buscar');
    if (inputBuscar && !inputBuscar.dataset.listened) {
      inputBuscar.dataset.listened = '1';
      inputBuscar.addEventListener('input', e => {
        this.filtroActual.busqueda = e.target.value.trim().toLowerCase();
        this.aplicarFiltrosYRender();
      });
    }

    // Vincular select de ordenamiento
    const selectOrden = document.getElementById('filtro-orden');
    if (selectOrden && !selectOrden.dataset.listened) {
      selectOrden.dataset.listened = '1';
      selectOrden.addEventListener('change', e => {
        this.filtroActual.orden = e.target.value;
        this.aplicarFiltrosYRender();
      });
    }

    // Vincular clics de chips (delegados)
    if (!contenedor.dataset.listened) {
      contenedor.dataset.listened = '1';
      contenedor.addEventListener('click', e => {
        const btnOp = e.target.closest('[data-filtro-op]');
        if (btnOp) {
          this.filtroActual.operador = btnOp.dataset.filtroOp;
          contenedor.querySelectorAll('[data-filtro-op]').forEach(b => {
            b.classList.toggle('filtro-chip--activo', b === btnOp);
            b.setAttribute('aria-pressed', String(b === btnOp));
          });
          this.aplicarFiltrosYRender();
          return;
        }

        const btnPrecio = e.target.closest('[data-precio-max]');
        if (btnPrecio) {
          this.filtroActual.precioMax = Number(btnPrecio.dataset.precioMax);
          contenedor.querySelectorAll('[data-precio-max]').forEach(b => {
            b.classList.toggle('filtro-chip--activo', b === btnPrecio);
            b.setAttribute('aria-pressed', String(b === btnPrecio));
          });
          this.aplicarFiltrosYRender();
          return;
        }
      });
    }
  },

  aplicarFiltrosYRender() {
    if (!this.ultimosDatos) return;
    const { tipo, res, catalogoTotal } = this.ultimosDatos;
    const f = this.filtroActual;
    const cont = document.getElementById('resultados'), lc = document.getElementById('letra-chica');
    const contador = document.getElementById('filtro-contador');

    // Filtrar sobre el catálogo del servicio
    let filtrados = catalogoTotal.filter(p => p.tipo === tipo);

    if (f.operador !== 'todos') {
      filtrados = filtrados.filter(p => p.operador.toLowerCase() === f.operador.toLowerCase());
    }

    if (f.precioMax > 0) {
      if (f.precioMax === 999) {
        filtrados = filtrados.filter(p => (p.precioPromo || p.precioRegular) > 65);
      } else {
        filtrados = filtrados.filter(p => (p.precioPromo || p.precioRegular) <= f.precioMax);
      }
    }

    if (f.busqueda) {
      filtrados = filtrados.filter(p => {
        const texto = `${p.operador} ${p.nombre} ${p.gbAltaVelocidad || ''} ${p.velocidadMbps || ''} ${(p.extras || []).join(' ')}`.toLowerCase();
        return texto.includes(f.busqueda);
      });
    }

    // Ordenamiento
    if (f.orden === 'precio-asc') {
      filtrados.sort((a, b) => (a.precioPromo || a.precioRegular) - (b.precioPromo || b.precioRegular));
    } else if (f.orden === 'precio-desc') {
      filtrados.sort((a, b) => (b.precioPromo || b.precioRegular) - (a.precioPromo || a.precioRegular));
    } else if (f.orden === 'gigas-desc') {
      filtrados.sort((a, b) => {
        const vA = a.gbAltaVelocidad || a.velocidadMbps || 0;
        const vB = b.gbAltaVelocidad || b.velocidadMbps || 0;
        return vB - vA;
      });
    }

    if (contador) {
      contador.textContent = `Mostrando ${filtrados.length} planes disponibles`;
    }

    if (!filtrados.length) {
      PC.vaciar(cont, this.renderZeroState(tipo, `No encontramos planes de ${f.operador !== 'todos' ? f.operador : 'ninguna empresa'} ${f.precioMax > 0 ? 'con ese presupuesto' : ''} ${f.busqueda ? 'que coincidan con "' + f.busqueda + '"' : ''}.`));
      PC.vaciar(lc);
      
      const btnReset = document.getElementById('btn-reset-filtros-zero');
      if (btnReset) {
        btnReset.addEventListener('click', () => {
          this.filtroActual = { busqueda: '', operador: 'todos', precioMax: 0, orden: 'recomendados' };
          const inp = document.getElementById('filtro-buscar'); if (inp) inp.value = '';
          const bFiltros = document.getElementById('barra-filtros');
          if (bFiltros) {
            bFiltros.querySelectorAll('.filtro-chip').forEach(b => {
              const esTodos = b.dataset.filtroOp === 'todos' || b.dataset.precioMax === '0';
              b.classList.toggle('filtro-chip--activo', esTodos);
              b.setAttribute('aria-pressed', String(esTodos));
            });
          }
          this.aplicarFiltrosYRender();
        });
      }
      const btnAsist = document.getElementById('btn-abrir-asistente-zero');
      if (btnAsist) {
        btnAsist.addEventListener('click', () => {
          const abrir = document.getElementById('abrir-asistente');
          if (abrir) abrir.click();
        });
      }
      return;
    }

    // Convertir a formato de tarjetas
    const opcionesFinales = filtrados.slice(0, 9).map((plan, i) => {
      let clave = 'eq', titulo = 'Plan disponible';
      if (i === 0) { clave = 'eco'; titulo = 'Opción más económica'; }
      else if (i === 1) { clave = 'eq'; titulo = 'Opción equilibrada'; }
      else if (i === 2) { clave = 'alto'; titulo = 'Para alto consumo'; }
      return { plan, clave, titulo };
    });

    PC.vaciar(cont, opcionesFinales.map(o => this.tarjeta(o, res.necesidad)));
    cont.querySelectorAll('.plan').forEach((el, i) => el.style.setProperty('--i', i));
    PC.vaciar(lc, this.letraChica(opcionesFinales.slice(0, 3)));
    
    // Contadores animados
    cont.querySelectorAll('[data-valor]').forEach(el => PC.mov.contar(el, Number(el.dataset.valor), PC.util.soles));
    PC.mov.inclinarTodo(cont);
    PC.mov.revelar(lc);
  },

  render(tipo, res) {
    this.ultimoTipo = tipo;
    const catalogoTotal = PC.estado.catalogo || [];
    this.ultimosDatos = { tipo, res, catalogoTotal };

    // Actualizar miga de pan y título
    const migaServicio = document.getElementById('miga-servicio');
    if (migaServicio) migaServicio.textContent = tipo === 'movil' ? 'Planes Celular (Postpago/Prepago)' : 'Internet para mi Casa (Fibra)';

    const h1 = document.getElementById('t-resultados');
    if (h1) h1.textContent = res.esCatalogoDirecto ? `Catálogo de planes para ${tipo === 'movil' ? 'celular' : 'hogar'}` : 'Tus opciones recomendadas';

    PC.vaciar(document.getElementById('resumen-perfil'), this.resumenPerfil(tipo, res.necesidad || { gb: 30, mbps: 100 }, res.presupuestoRelajado));

    this.montarBarraFiltros(tipo, catalogoTotal.filter(p => p.tipo === tipo));
    this.aplicarFiltrosYRender();

    const descTitulo = document.getElementById('descartados-titulo');
    if (descTitulo && res.descartados) {
      descTitulo.textContent = `Planes que descartamos y por qué (${res.descartados.length})`;
      const items = res.descartados.map(d => PC.h('li', null, PC.h('strong', null, `${d.plan.operador} ${d.plan.nombre}`), ': ', d.motivo));
      PC.vaciar(document.getElementById('descartados-lista'), items.length ? items : PC.h('li', null, 'Ninguno.'));
    }
  }
};
