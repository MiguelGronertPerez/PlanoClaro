/* Resultados: tarjetas de vidrio con inclinación 3D, contadores de precio y acciones
   (favorito, comparar, recordatorio .ics y «Contratar en la web oficial»). Todo con APIs del DOM. */
PC.vista = {
  sello(estado, corto) {
    const e = PC.ETIQUETAS_VERIF[estado] || PC.ETIQUETAS_VERIF.no_verificado;
    return PC.h('span', { class: 'sello sello--' + e.clase }, PC.icono(e.icono), corto ? e.corto : e.texto);
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
      const datos = p.gbAltaVelocidad == null ? 'Internet sin límite de GB (con reglas de uso justo)' : `${p.gbAltaVelocidad} GB rápidos: ${PC.util.explicarGB(p.gbAltaVelocidad)}${p.datosIlimitados ? '. Después sigues navegando, pero más lento' : ''}`;
      return [datos, ...(p.extras || [])];
    }
    return [`${p.velocidadMbps} Mbps por ${p.tecnologia.toLowerCase()}: ${PC.util.explicarMbps(p.velocidadMbps)}`,
      p.simetrica ? 'Sube archivos igual de rápido que descarga' : (p.simetrica === false ? 'Sube archivos más lento de lo que descarga' : 'Velocidad de subida: no la pudimos verificar'),
      p.cobertura === 'lima' ? 'Solo en Lima Metropolitana y Callao' : 'Sujeto a cobertura en tu distrito',
      p.incluyeMesh && typeof p.costoEquipo !== 'string' ? 'Incluye repetidor WiFi (según evaluación técnica)' : null, p.costoEquipo && typeof p.costoEquipo === 'string' ? 'Equipo: ' + p.costoEquipo : null].filter(Boolean);
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
    const instal = typeof p.costoInstalacion === 'number' ? (p.costoInstalacion === 0 ? 'S/ 0.00' : s(p.costoInstalacion)) : 'no publicado';
    const tid = 'plan-' + p.id;
    const monto = h('span', { class: 'precio__monto', dataset: { valor: String(hayPromo ? p.precioPromo : p.precioRegular) } }, s(hayPromo ? p.precioPromo : p.precioRegular));
    const anual = h('strong', { class: 'anual__monto', dataset: { valor: String(c.anual(p)) } }, s(c.anual(p)));
    const fav = this.botonAccion('estrella', 'Guardar', { 'aria-pressed': String(PC.favoritos.tiene(p.id)), dataset: { fav: p.id }, 'aria-label': `Guardar ${p.operador} ${p.nombre} en favoritos` });
    const comp = this.botonAccion('mas', 'Comparar', { 'aria-pressed': String(PC.carrito.tiene(p.id)), dataset: { comp: p.id }, 'aria-label': `Comparar ${p.operador} ${p.nombre}` });
    const elegir = this.botonAccion('ok', 'Elegí este', { dataset: { elegirPlan: p.id }, 'aria-label': `Elegir ${p.operador} ${p.nombre} y dejar reseña` });
    const acciones = [fav, comp, elegir];
    if (hayPromo) {
      const ics = this.botonAccion('calendario', 'Avísame', { dataset: { ics: p.id }, 'aria-label': `Avísame cuando sube el precio de ${p.operador} ${p.nombre} (descarga un recordatorio)` });
      acciones.push(ics);
    }
    const urlOf = PC.util.urlOficial(p);
    return h('article', { class: `plan plan--${o.clave} inclinable`, 'aria-labelledby': tid, dataset: { id: p.id } },
      h('div', { class: 'plan__brillo', 'aria-hidden': 'true' }),
      h('div', { class: 'plan__cabeza' },
        h('p', { class: 'plan__perfil' }, o.titulo),
        h('h3', { id: tid }, h('span', { class: 'plan__operador' }, p.operador), ' ', h('span', { class: 'plan__nombre' }, p.nombre))),
      h('p', { class: 'precio' }, h('span', { class: 'precio__etq' }, hayPromo ? 'Pagas al inicio' : 'Pagas cada mes'), monto, h('span', { class: 'precio__per' }, ' al mes')),
      h('dl', { class: 'recibo' },
        this.fila(hayPromo ? `Mes 1${p.mesesPromo > 1 ? ' al ' + p.mesesPromo : ''} (oferta)` : 'Todos los meses', s(hayPromo ? p.precioPromo : p.precioRegular)),
        hayPromo ? this.fila(`Desde el mes ${p.mesesPromo + 1}`, s(p.precioRegular), 'fila--fuerte') : null,
        this.fila('Instalación o activación', instal)),
      hayPromo && p.condicionPromo ? h('p', { class: 'precio__cond' }, h('strong', null, 'Ojo, la oferta pide: '), p.condicionPromo) : null,
      h('div', { class: 'anual' },
        h('p', { class: 'anual__fila' }, h('span', null, 'En 12 meses pagarás'), anual),
        h('p', { class: 'anual__detalle' }, `${c.detalle(p)}. Promedio: ${s(c.promedioMensual(p))} al mes.`)),
      h('h4', null, 'Qué incluye'),
      h('ul', { class: 'incluye' }, this.queIncluye(p).map(x => h('li', null, x))),
      p.tipo === 'hogar' && n.casaGrande && !p.incluyeMesh ? h('p', { class: 'nota-plan' }, h('strong', null, 'Consejo: '), 'tu casa es grande. Quizá necesites un repetidor WiFi aparte. Pregunta cuánto cuesta.') : null,
      p.notas ? h('p', { class: 'nota-plan' }, h('strong', null, 'Ojo: '), p.notas) : null,
      h('div', { class: 'plan__pie' },
        h('p', { class: 'plan__verif' }, 'Precio: ', this.sello(p.verificacion.precio)),
        h('p', { class: 'plan__fuente' }, 'Fuente: ', this.enlacesFuente(p), ` · revisado el ${PC.util.fecha(p.fechaConsulta)}`),
        h('div', { class: 'plan__acciones', role: 'group', 'aria-label': 'Acciones' }, acciones),
        urlOf ? PC.enlaceExterno(urlOf, `Contratar en la web de ${p.operador}`, 'boton boton--primario boton--ancho') : null));
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
      ? [`Oferta por ${p.mesesPromo} ${PC.util.plural(p.mesesPromo, 'mes', 'meses')}. Desde el mes ${p.mesesPromo + 1} pagas ${s(p.precioRegular)}. `, sello(p.verificacion.precio)]
      : [`Sin oferta: ${s(p.precioRegular)} desde el primer mes. `, sello(p.verificacion.precio)];
    const perm = p => [p.permanencia ? p.permanencia + '. ' : 'No lo publican en las páginas que revisamos. Pídelo por escrito. ', sello(p.permanencia ? 'no_verificado' : p.verificacion.permanencia)];
    const equipo = p => {
      const inst = typeof p.costoInstalacion === 'number' ? (p.costoInstalacion === 0 ? 'Instalación o activación gratis' : `Instalación ${s(p.costoInstalacion)}`) : 'No publican cuánto cuesta instalar';
      return [inst, p.tipo === 'hogar' ? ['. ', sello(p.verificacion.instalacion)] : null,
        p.tipo === 'movil' ? '. Si compras un celular en cuotas, esas cuotas te atan al contrato.' : '. Los equipos son prestados: devuélvelos al darte de baja.'];
    };
    return [
      bloque('Velocidad y uso justo', 'En internet fijo, la ley exige garantizar al menos el 70 % de la velocidad contratada (Ley 31207). Si no llega, puedes reclamar.', vel),
      bloque('La oferta y el precio de siempre', 'La oferta dura poco. Lo que pagarás la mayor parte del año es el precio regular.', promo),
      bloque('Contrato y permanencia', '«Plazo forzoso» significa que te cobran si te vas antes de tiempo. Pide la duración y la penalidad por escrito.', perm),
      bloque('Instalación y equipos', 'Pregunta si el router y el repetidor son prestados o se pagan aparte.', equipo),
      h('article', { class: 'lc lc--osiptel revelar' }, h('h3', null, 'Tus derechos (OSIPTEL)'),
        h('ul', null,
          h('li', null, 'Cambiarte de empresa manteniendo tu número (portabilidad) es gratis y en celular se hace en máximo 24 horas. ', PC.enlaceExterno('https://www.osiptel.gob.pe/portal-del-usuario/preguntas-frecuentes/portabilidad-numerica', 'Preguntas frecuentes de OSIPTEL')),
          h('li', null, 'Revisa qué líneas están a tu nombre en ', PC.enlaceExterno('https://checatuslineas.osiptel.gob.pe/', 'Checa tus líneas'), '.'),
          h('li', null, 'Busca la tarifa oficial registrada del plan en el ', PC.enlaceExterno('https://serviciosweb.osiptel.gob.pe/ConsultaSIRT/', 'SIRT de OSIPTEL'), '.'),
          h('li', null, 'Si tienes un problema, primero reclama a la empresa. Si no te dan la razón, puedes apelar ante el TRASU de OSIPTEL.'),
          h('li', null, '¿Quieres cancelar tu servicio o reclamar por cobros o lentitud? ', PC.h('button', { type: 'button', class: 'enlace', dataset: { ir: 'reclamos' } }, 'Redactar solicitud formal OSIPTEL'), '.')))
    ];
  },
  render(tipo, res) {
    const h = PC.h;
    PC.vaciar(document.getElementById('resumen-perfil'), this.resumenPerfil(tipo, res.necesidad, res.presupuestoRelajado));
    const cont = document.getElementById('resultados'), lc = document.getElementById('letra-chica');
    if (!res.opciones.length) {
      PC.vaciar(cont, h('p', { class: 'alerta panel' }, 'No encontramos planes para tus respuestas. Prueba cambiando alguna respuesta.'));
      PC.vaciar(lc);
    } else {
      PC.vaciar(cont, res.opciones.map(o => this.tarjeta(o, res.necesidad)),
        res.opciones.length < 3 ? h('p', { class: 'alerta' }, `Solo ${res.opciones.length === 1 ? 'un plan cumple' : 'dos planes cumplen'} con lo que necesitas.`) : null);
      cont.querySelectorAll('.plan').forEach((el, i) => el.style.setProperty('--i', i));
      PC.vaciar(lc, this.letraChica(res.opciones));
      // Contadores: arrancan cuando la tarjeta "se imprime" (misma coreografía, un solo momento).
      cont.querySelectorAll('[data-valor]').forEach(el => PC.mov.contar(el, Number(el.dataset.valor), PC.util.soles));
      PC.mov.inclinarTodo(cont); PC.mov.revelar(lc);
    }
    document.getElementById('descartados-titulo').textContent = `Planes que descartamos y por qué (${res.descartados.length})`;
    const items = res.descartados.map(d => h('li', null, h('strong', null, `${d.plan.operador} ${d.plan.nombre}`), ': ', d.motivo));
    PC.vaciar(document.getElementById('descartados-lista'), items.length ? items : h('li', null, 'Ninguno.'));
  }
};
