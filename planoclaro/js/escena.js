/* Tarjetas de vidrio flotantes del inicio: tres planes reales del catálogo (los de mayor salto
   entre oferta y precio regular). Capa de profundidad sobre la fibra 3D, con inclinación por resorte. */
PC.escena = {
  montar(catalogo, fechaConsulta) {
    const raiz = document.getElementById('escena'); if (!raiz) return;
    const h = PC.h, s = PC.util.soles, c = PC.costos;
    let ej = catalogo.filter(p => p.precioPromo != null && p.precioRegular > p.precioPromo)
      .sort((a, b) => (b.precioRegular - b.precioPromo) - (a.precioRegular - a.precioPromo));
    const vistos = new Set(); ej = ej.filter(p => !vistos.has(p.operador) && vistos.add(p.operador)).slice(0, 3);
    if (ej.length < 3) ej = ej.concat(catalogo.filter(p => !ej.includes(p))).slice(0, 3);
    const tickets = ej.map((p, i) => {
      const promo = p.precioPromo != null;
      return h('div', { class: 'ticket ticket--' + i, 'aria-hidden': i === 0 ? null : 'true' },
        h('p', { class: 'ticket__op' }, p.operador),
        h('p', { class: 'ticket__plan' }, p.nombre, ' · ', p.tipo === 'movil' ? 'celular' : 'internet de casa'),
        h('dl', { class: 'recibo recibo--mini' },
          PC.vista.fila(promo ? `Mes 1${p.mesesPromo > 1 ? ' al ' + p.mesesPromo : ''}` : 'Cada mes', s(promo ? p.precioPromo : p.precioRegular)),
          promo ? PC.vista.fila(`Desde el mes ${p.mesesPromo + 1}`, s(p.precioRegular), 'fila--fuerte') : null),
        h('p', { class: 'ticket__total' }, h('span', null, 'En 12 meses'), h('strong', null, s(c.anual(p)))),
        h('p', { class: 'ticket__verif' }, PC.vista.sello(p.verificacion.precio, true)));
    });
    const pila = h('div', { class: 'pila' }, tickets.slice().reverse());
    PC.vaciar(raiz, pila, h('figcaption', { class: 'escena__nota' }, `Ejemplos reales del catálogo (revisado el ${PC.util.fecha(fechaConsulta)}). La oferta es lo primero que ves; el total de 12 meses es lo que pagas.`));
    raiz.setAttribute('aria-label', 'Ejemplo: ' + ej.map(p => `${p.operador} ${p.nombre}, ${s(c.anual(p))} en 12 meses`).join('; '));
    requestAnimationFrame(() => raiz.classList.add('escena--lista'));
    if (PC.mov.reducido() || !PC.mov.finoHover()) return;
    const r = PC.mov.resorte((x, y) => { pila.style.transform = `rotateX(${x.toFixed(2)}deg) rotateY(${y.toFixed(2)}deg)`; });
    raiz.addEventListener('pointermove', e => { const b = raiz.getBoundingClientRect(); r.ir(-((e.clientY - b.top) / b.height - 0.5) * 14, ((e.clientX - b.left) / b.width - 0.5) * 22); });
    raiz.addEventListener('pointerleave', () => r.ir(0, 0));
  }
};
