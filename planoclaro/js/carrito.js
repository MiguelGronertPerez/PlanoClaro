/* Favoritos, comparador ("carrito" de 2-3 planes) y recordatorio .ics de fin de promoción. */
PC.favoritos = {
  ids: [],
  async cargar() { try { this.ids = (await PC.almacen.favoritos()).filter(x => typeof x === 'string'); } catch (e) { this.ids = []; } },
  tiene(id) { return this.ids.includes(id); },
  async alternar(id) {
    this.ids = this.tiene(id) ? this.ids.filter(x => x !== id) : [...this.ids, id];
    try { await PC.almacen.guardarFavoritos(this.ids); } catch (e) { PC.avisar('No se pudo guardar: ' + e.message); }
    return this.tiene(id);
  }
};
PC.carrito = {
  MAX: 3,
  ids() { return PC.LS.leer('carrito', []).filter(x => typeof x === 'string').slice(0, this.MAX); },
  tiene(id) { return this.ids().includes(id); },
  alternar(id, catalogo) {
    let ids = this.ids();
    if (ids.includes(id)) ids = ids.filter(x => x !== id);
    else {
      const p = catalogo.find(x => x.id === id), otros = ids.map(i => catalogo.find(x => x.id === i)).filter(Boolean);
      if (otros.length && otros[0].tipo !== p.tipo) { PC.avisar('Solo puedes comparar planes del mismo tipo. Vaciamos el comparador y agregamos este.'); ids = []; }
      if (ids.length >= this.MAX) { PC.avisar(`Máximo ${this.MAX} planes. Quita uno para agregar otro.`); return false; }
      ids.push(id);
    }
    PC.LS.escribir('carrito', ids); this.pintarContador(); return ids.includes(id);
  },
  pintarContador() {
    const n = this.ids().length, el = document.getElementById('carrito-n'); if (!el) return;
    el.textContent = String(n); el.setAttribute('aria-label', `${n} ${n === 1 ? 'plan' : 'planes'} en el comparador`);
    el.classList.remove('nav__cuenta--pulso'); void el.offsetWidth; if (n) el.classList.add('nav__cuenta--pulso');
  },
  render(catalogo) {
    const h = PC.h, s = PC.util.soles, c = PC.costos, cont = document.getElementById('comparador');
    const planes = this.ids().map(i => catalogo.find(x => x.id === i)).filter(Boolean);
    if (planes.length < 2) {
      PC.vaciar(cont, h('div', { class: 'panel vacio' }, h('p', { class: 'vacio__t' }, planes.length ? 'Tienes 1 plan. Agrega otro para comparar.' : 'Aún no agregaste planes.'),
        h('p', null, 'En tus resultados, toca «Comparar» en las tarjetas que te interesen.'),
        planes.length ? h('p', null, `En el comparador: ${planes[0].operador} ${planes[0].nombre}.`) : null,
        (() => { const b = h('button', { type: 'button', class: 'boton boton--primario', dataset: { ir: 'inicio' } }, 'Buscar planes'); return b; })()));
      return;
    }
    const cap = p => p.tipo === 'movil' ? (p.gbAltaVelocidad == null ? Infinity : p.gbAltaVelocidad) : p.velocidadMbps;
    const filas = [
      { t: 'Pagas al inicio', v: p => p.precioPromo ?? p.precioRegular, f: s, mejor: 'min' },
      { t: 'Precio de siempre (después de la oferta)', v: p => p.precioRegular, f: s, mejor: 'min' },
      { t: 'Meses de oferta', v: p => p.precioPromo != null ? p.mesesPromo : 0, f: v => v ? `${v} ${PC.util.plural(v, 'mes', 'meses')}` : 'Sin oferta' },
      { t: 'Total en 12 meses', v: p => c.anual(p), f: s, mejor: 'min', barra: true },
      { t: planes[0].tipo === 'movil' ? 'Datos rápidos al mes' : 'Velocidad', v: cap, f: v => planes[0].tipo === 'movil' ? (v === Infinity ? 'Sin límite' : v + ' GB') : v + ' Mbps', mejor: 'max', barra: true },
      { t: 'Instalación', v: p => typeof p.costoInstalacion === 'number' ? p.costoInstalacion : null, f: v => v == null ? 'No publicado' : s(v), mejor: 'min' },
      { t: 'Permanencia', v: p => p.permanencia || 'No publicada', f: v => v },
      { t: 'Precio verificado', v: p => p.verificacion.precio, f: v => (PC.ETIQUETAS_VERIF[v] || {}).corto || v }
    ];
    const tabla = h('table', { class: 'tabla tabla--comparar' },
      h('caption', null, 'Comparación de planes. Las filas marcadas «Cambia» tienen valores distintos; «Mejor» señala el valor más conveniente.'),
      h('thead', null, h('tr', null, h('th', { scope: 'col' }, 'Concepto'), planes.map(p => {
        const quitar = h('button', { type: 'button', class: 'enlace', dataset: { quitar: p.id } }, 'Quitar');
        return h('th', { scope: 'col' }, h('span', { class: 'tabla__op' }, p.operador), h('span', { class: 'tabla__plan' }, p.nombre), quitar);
      }))),
      h('tbody', null, filas.map(f => {
        const vals = planes.map(f.v), distintos = new Set(vals.map(String)).size > 1;
        const nums = vals.filter(v => typeof v === 'number' && Number.isFinite(v));
        const objetivo = f.mejor && nums.length ? (f.mejor === 'min' ? Math.min(...nums) : Math.max(...nums)) : null;
        const tope = f.barra ? Math.max(...vals.map(v => v === Infinity ? 0 : v), 1) : 0;
        return h('tr', { class: distintos ? 'difiere' : null },
          h('th', { scope: 'row' }, f.t, distintos ? h('span', { class: 'marca-difiere' }, 'Cambia') : null),
          vals.map((v, i) => {
            const esMejor = distintos && (v === objetivo || (f.mejor === 'max' && v === Infinity));
            const barra = f.barra ? h('span', { class: 'barra', 'aria-hidden': 'true' }, h('span', { class: 'barra__llena', dataset: { escala: String(v === Infinity ? 1 : v / tope) } })) : null;
            return h('td', { class: esMejor ? 'mejor' : null }, h('span', { class: 'tabla__v' }, f.f(v)), esMejor ? h('span', { class: 'marca-mejor' }, PC.icono('ok'), 'Mejor') : null, barra);
          }));
      })),
      h('tfoot', null, h('tr', null, h('th', { scope: 'row' }, 'Siguiente paso'), planes.map(p => h('td', null,
        PC.enlaceExterno(PC.util.urlOficial(p), `Contratar en ${p.operador}`, 'boton boton--primario boton--chico boton--ancho'),
        h('button', { type: 'button', class: 'boton boton--fantasma boton--chico boton--ancho', dataset: { elegirPlan: p.id } }, 'Elegí este (calificar)')
      )))));
    const cajaResena = h('aside', { class: 'panel invitar-encuesta', 'aria-labelledby': 't-inv-resena-comp' },
      h('h2', { id: 't-inv-resena-comp' }, '¿Ya elegiste cuál es el mejor producto para ti?'),
      h('p', null, 'Tu calificación y reseña ayudan a la comunidad. Evalúa la satisfacción del servicio y cuéntanos qué plan elegiste.'),
      h('button', { type: 'button', class: 'boton boton--primario', dataset: { ir: 'encuesta' } }, 'Evaluar satisfacción y dejar reseña')
    );
    PC.vaciar(cont, h('div', { class: 'panel tabla-caja' }, tabla),
      h('p', { class: 'nota' }, 'PlanoClaro no vende planes. El botón te lleva a la web del operador. Antes de pagar, confirma el precio y la cobertura en tu dirección.'),
      cajaResena);
    // Barras animadas: transform scaleX (barato), escalonadas.
    requestAnimationFrame(() => cont.querySelectorAll('.barra__llena').forEach((b, i) => { b.style.setProperty('--i', i % 3); b.style.transform = `scaleX(${Number(b.dataset.escala) || 0})`; }));
  }
};
PC.ics = {
  esc(t) { return String(t).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n'); },
  fecha(d) { return d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0'); },
  /* Evento de todo el día en el mes en que llega el precio regular, con alarma 3 días antes. */
  crear(p, hoy = new Date()) {
    const sube = new Date(hoy.getFullYear(), hoy.getMonth() + (p.mesesPromo || 0), hoy.getDate());
    const fin = new Date(sube.getFullYear(), sube.getMonth(), sube.getDate() + 1);
    const ahora = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const titulo = `Sube el precio de ${p.operador} ${p.nombre}: ${PC.util.soles(p.precioRegular)}`;
    const desc = `Si contrataste hoy, desde este mes pagas ${PC.util.soles(p.precioRegular)} al mes (antes ${PC.util.soles(p.precioPromo)}). Revisa tu recibo o compara otra vez en PlanoClaro. Fecha aproximada: depende de tu ciclo de facturación.`;
    return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//PlanoClaro//IHC UCSS//ES', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
      `UID:${p.id}-${this.fecha(sube)}@planoclaro.local`, `DTSTAMP:${ahora}`, `DTSTART;VALUE=DATE:${this.fecha(sube)}`, `DTEND;VALUE=DATE:${this.fecha(fin)}`,
      `SUMMARY:${this.esc(titulo)}`, `DESCRIPTION:${this.esc(desc)}`,
      'BEGIN:VALARM', 'TRIGGER:-P3D', 'ACTION:DISPLAY', `DESCRIPTION:${this.esc(titulo)}`, 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR', ''].join('\r\n');
  },
  descargar(p) { PC.util.descargar(`planoclaro-recordatorio-${p.id}.ics`, this.crear(p), 'text/calendar'); }
};
