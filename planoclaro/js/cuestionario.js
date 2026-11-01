/* Cuestionario: una pregunta por pantalla, con fichas grandes (icono + texto + explicación).
   Prueba A/B: A = al elegir una opción única avanza solo; B = siempre se pulsa «Siguiente».
   Transición entre pasos: la pregunta saliente se desliza y desenfoca; la nueva entra desde el lado
   de la dirección elegida (continuidad espacial). Con movimiento reducido: cambio por fundido. */
PC.cuestionario = {
  tipo: null, paso: 0, variante: 'A', temporizador: 0,
  render(tipo, previas = {}) {
    const h = PC.h, qs = PC.PREGUNTAS[tipo];
    this.tipo = tipo; this.paso = 0; this.variante = PC.metricas.variante();
    const cont = document.getElementById('preguntas');
    PC.vaciar(cont, qs.map((q, i) => {
      const tipoInput = q.multiple ? 'checkbox' : 'radio';
      const ops = q.opciones.map(o => {
        const input = h('input', { type: tipoInput, name: q.id, value: o.v });
        input.checked = q.multiple ? (previas[q.id] || []).includes(o.v) : previas[q.id] === o.v;
        return h('label', { class: 'opcion' }, input,
          h('span', { class: 'opcion__icono' }, PC.icono(o.icono || 'ok')),
          h('span', { class: 'opcion__textos' }, h('span', { class: 'opcion__t' }, o.t), o.d ? h('span', { class: 'opcion__d' }, o.d) : null),
          h('span', { class: 'opcion__marca', 'aria-hidden': 'true' }, PC.icono('ok')));
      });
      const desc = [q.ayuda ? 'ayuda-' + q.id : '', 'error-' + q.id].filter(Boolean).join(' ');
      return h('fieldset', { class: 'pregunta', id: 'q-' + q.id, 'aria-describedby': desc, hidden: i !== 0, dataset: { paso: String(i) } },
        h('legend', null, h('span', { class: 'pregunta__num' }, `Pregunta ${i + 1} de ${qs.length}`), h('span', { class: 'pregunta__texto' }, q.texto)),
        q.ayuda ? h('p', { class: 'pregunta__ayuda', id: 'ayuda-' + q.id }, q.ayuda) : null,
        h('div', { class: 'opciones' + (q.opciones.length === 4 ? ' opciones--4' : '') }, ops),
        h('p', { class: 'pregunta__error', id: 'error-' + q.id, hidden: true }));
    }));
    cont.querySelectorAll('input').forEach(el => el.addEventListener('change', () => this.alElegir(el)));
    document.getElementById('resumen-errores').hidden = true;
    this.actualizarBotones(); this.actualizarProgreso();
  },
  preguntaActual() { return PC.PREGUNTAS[this.tipo][this.paso]; },
  alElegir(el) {
    this.limpiarError(el.name); this.actualizarProgreso(); PC.sonido.tocar('elegir');
    const q = this.preguntaActual();
    clearTimeout(this.temporizador);
    // Variante A: avanza sola en preguntas de una respuesta (tras un breve instante para ver lo elegido).
    if (this.variante === 'A' && !q.multiple && q.id === el.name && this.paso < PC.PREGUNTAS[this.tipo].length - 1) {
      this.temporizador = setTimeout(() => this.ir(this.paso + 1), 320);
    }
  },
  ir(n, enfocarError) {
    const qs = PC.PREGUNTAS[this.tipo];
    if (n < 0 || n >= qs.length || n === this.paso) return;
    const viejo = document.getElementById('q-' + qs[this.paso].id), nuevo = document.getElementById('q-' + qs[n].id);
    const adelante = n > this.paso;
    this.paso = n;
    viejo.hidden = true; nuevo.hidden = false;
    nuevo.classList.remove('entra-der', 'entra-izq'); void nuevo.offsetWidth;
    nuevo.classList.add(adelante ? 'entra-der' : 'entra-izq');
    PC.sonido.tocar('paso');
    this.actualizarBotones(); this.actualizarProgreso();
    // El foco va a la nueva pregunta para lectores de pantalla y teclado.
    const destino = enfocarError ? nuevo.querySelector('input') : nuevo.querySelector('legend');
    if (destino) { if (!destino.hasAttribute('tabindex') && destino.tagName === 'LEGEND') destino.setAttribute('tabindex', '-1'); destino.focus({ preventScroll: true }); }
    PC.metricas.registrar('paso', { n });
  },
  siguiente() {
    const q = this.preguntaActual(), r = this.leer();
    const falta = q.multiple ? !(r[q.id] && r[q.id].length) : !r[q.id];
    if (falta) { this.mostrarErrores([{ id: q.id, texto: q.multiple ? 'Marca al menos una opción para seguir.' : 'Elige una opción para seguir.', pregunta: q.texto }], true); return; }
    this.ir(this.paso + 1);
  },
  actualizarBotones() {
    const total = PC.PREGUNTAS[this.tipo].length, ultimo = this.paso === total - 1;
    document.getElementById('btn-anterior').hidden = this.paso === 0;
    document.getElementById('btn-volver').hidden = this.paso !== 0;
    const q = this.preguntaActual();
    document.getElementById('btn-siguiente').hidden = ultimo || (this.variante === 'A' && !q.multiple && !this.leer()[q.id]);
    document.getElementById('btn-enviar').hidden = !ultimo;
  },
  leer() {
    const f = document.getElementById('form-cuestionario');
    const r = {};
    PC.PREGUNTAS[this.tipo].forEach(q => {
      const sel = [...f.querySelectorAll('input:checked')].filter(x => x.name === q.id).map(x => x.value)
        .filter(v => q.opciones.some(o => o.v === v)); // lista blanca: solo valores definidos
      r[q.id] = q.multiple ? sel : (sel[0] || null);
    });
    return r;
  },
  validar(r) {
    return PC.PREGUNTAS[this.tipo].filter(q => q.multiple ? !(r[q.id] && r[q.id].length) : !r[q.id])
      .map(q => ({ id: q.id, texto: q.multiple ? 'Marca al menos una opción.' : 'Elige una opción.', pregunta: q.texto }));
  },
  mostrarErrores(errores, soloPaso) {
    const h = PC.h, resumen = document.getElementById('resumen-errores'), n = errores.length;
    PC.sonido.tocar('error'); PC.metricas.registrar('error_validacion', { n });
    errores.forEach(e => {
      const p = document.getElementById('error-' + e.id);
      p.textContent = e.texto; p.hidden = false;
      document.getElementById('q-' + e.id).classList.add('pregunta--error');
    });
    if (soloPaso) { resumen.hidden = true; document.getElementById('q-' + errores[0].id).querySelector('input').focus(); return; }
    const idx = PC.PREGUNTAS[this.tipo].findIndex(q => q.id === errores[0].id);
    PC.vaciar(resumen,
      h('p', null, h('strong', null, n > 1 ? `Faltan ${n} respuestas.` : 'Falta 1 respuesta.'), ' Toca cada una para ir a contestarla:'),
      h('ul', null, errores.map(e => {
        const a = h('a', { href: '#q-' + e.id }, e.pregunta);
        a.addEventListener('click', ev => { ev.preventDefault(); this.ir(PC.PREGUNTAS[this.tipo].findIndex(q => q.id === e.id), true); });
        return h('li', null, a);
      })));
    resumen.hidden = false;
    if (idx !== this.paso) this.ir(idx);
    resumen.focus();
  },
  limpiarError(id) {
    const p = document.getElementById('error-' + id); if (p) p.hidden = true;
    const q = document.getElementById('q-' + id); if (q) q.classList.remove('pregunta--error');
  },
  actualizarProgreso() {
    const r = this.leer(); const total = PC.PREGUNTAS[this.tipo].length;
    const hechas = total - this.validar(r).length;
    document.getElementById('progreso-barra').style.transform = `scaleX(${hechas / total})`;
    document.getElementById('progreso-texto').textContent = `${hechas} de ${total} preguntas respondidas`;
    if (hechas === total) document.getElementById('resumen-errores').hidden = true;
    this.actualizarBotones();
  }
};
