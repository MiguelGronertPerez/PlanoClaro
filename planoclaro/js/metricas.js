/* Métricas UX locales (opt-in) y asignación A/B. Nada sale del dispositivo. */
PC.metricas = {
  consentido() { return PC.LS.leer('consent', null) === 'si'; },
  variante() {
    const q = new URLSearchParams(location.search).get('variante');
    if (q === 'A' || q === 'B') { PC.LS.escribir('variante', q); return q; } // forzar en pruebas
    let v = PC.LS.leer('variante', null);
    if (v !== 'A' && v !== 'B') { v = crypto.getRandomValues(new Uint8Array(1))[0] % 2 ? 'B' : 'A'; PC.LS.escribir('variante', v); }
    return v;
  },
  registrar(tipo, datos = {}) {
    if (!this.consentido()) return;
    const ev = PC.LS.leer('eventos', []);
    ev.push({ t: tipo, ts: Date.now(), variante: this.variante(), ...datos });
    PC.LS.escribir('eventos', ev.slice(-2000));
  },
  eventos() { return PC.LS.leer('eventos', []); },
  borrar() { PC.LS.borrar('eventos'); PC.LS.borrar('sus'); },
  resumen() {
    const ev = this.eventos(), sus = PC.LS.leer('sus', []);
    const por = v => {
      const ini = ev.filter(e => e.t === 'inicio' && e.variante === v).length;
      const rec = ev.filter(e => e.t === 'recomendacion' && e.variante === v);
      const tiempos = rec.map(e => e.ms).filter(Number.isFinite);
      const s = sus.filter(x => x.variante === v).map(x => x.puntaje);
      const err = ev.filter(e => e.t === 'error_validacion' && e.variante === v).length;
      return { inicios: ini, completadas: rec.length, abandono: ini ? Math.max(0, 1 - rec.length / ini) : 0,
        exito: ini ? Math.min(1, rec.length / ini) : 0, tiempoMedio: tiempos.length ? tiempos.reduce((a, b) => a + b, 0) / tiempos.length : 0,
        sus: s.length ? s.reduce((a, b) => a + b, 0) / s.length : 0, nSus: s.length, errores: err };
    };
    const todosSus = sus.map(x => x.puntaje);
    return { A: por('A'), B: por('B'), susMedio: todosSus.length ? todosSus.reduce((a, b) => a + b, 0) / todosSus.length : 0, nSus: todosSus.length, nEventos: ev.length };
  },
  /* Gráfico de barras en SVG accesible (role=img + tabla equivalente). */
  barras(titulo, filas, formato, max) {
    const ns = 'http://www.w3.org/2000/svg', h = PC.h;
    const tope = max || Math.max(1, ...filas.map(f => f.valor));
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 320 ${filas.length * 44 + 8}`); svg.setAttribute('class', 'grafico');
    svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', titulo + ': ' + filas.map(f => `${f.etiqueta} ${formato(f.valor)}`).join(', '));
    filas.forEach((f, i) => {
      const y = i * 44 + 8, w = Math.max(2, (f.valor / tope) * 220);
      const t = document.createElementNS(ns, 'text'); t.setAttribute('x', 0); t.setAttribute('y', y + 18); t.textContent = f.etiqueta; svg.appendChild(t);
      const fondo = document.createElementNS(ns, 'rect'); fondo.setAttribute('x', 70); fondo.setAttribute('y', y + 4); fondo.setAttribute('width', 220); fondo.setAttribute('height', 20); fondo.setAttribute('rx', 10); fondo.setAttribute('class', 'grafico__fondo'); svg.appendChild(fondo);
      const r = document.createElementNS(ns, 'rect'); r.setAttribute('x', 70); r.setAttribute('y', y + 4); r.setAttribute('width', w); r.setAttribute('height', 20); r.setAttribute('rx', 10); r.setAttribute('class', 'grafico__barra ' + (f.clase || '')); r.style.setProperty('--i', i); svg.appendChild(r);
      const v = document.createElementNS(ns, 'text'); v.setAttribute('x', 296); v.setAttribute('y', y + 18); v.setAttribute('class', 'grafico__valor'); v.textContent = formato(f.valor); svg.appendChild(v);
    });
    return h('figure', { class: 'panel grafico-caja revelar' }, h('figcaption', null, titulo), svg);
  },
  render() {
    const h = PC.h, r = this.resumen(), cont = document.getElementById('metricas');
    const pct = v => Math.round(v * 100) + '%', seg = v => (v / 1000).toFixed(1) + ' s', pts = v => v.toFixed(1);
    const estado = this.consentido() ? 'Medición activada en este dispositivo.' : 'La medición está desactivada (no diste permiso). Los gráficos muestran solo lo ya guardado.';
    const tabla = h('table', { class: 'tabla' }, h('caption', null, 'Prueba A/B: A = avanza solo al elegir · B = botón «Siguiente»'),
      h('thead', null, h('tr', null, ['Métrica', 'Variante A', 'Variante B'].map(x => h('th', { scope: 'col' }, x)))),
      h('tbody', null, [
        ['Cuestionarios iniciados', r.A.inicios, r.B.inicios], ['Recomendaciones (tarea completada)', r.A.completadas, r.B.completadas],
        ['Tasa de éxito', pct(r.A.exito), pct(r.B.exito)], ['Abandono', pct(r.A.abandono), pct(r.B.abandono)],
        ['Tiempo medio hasta la recomendación', seg(r.A.tiempoMedio), seg(r.B.tiempoMedio)], ['Errores de validación', r.A.errores, r.B.errores],
        ['SUS promedio (n)', `${pts(r.A.sus)} (${r.A.nSus})`, `${pts(r.B.sus)} (${r.B.nSus})`]
      ].map(f => h('tr', null, h('th', { scope: 'row' }, f[0]), h('td', null, String(f[1])), h('td', null, String(f[2]))))));
    const descargar = h('button', { type: 'button', class: 'boton boton--fantasma' }, 'Exportar datos (JSON)');
    descargar.addEventListener('click', () => PC.util.descargar('planoclaro-metricas.json', JSON.stringify({ eventos: this.eventos(), sus: PC.LS.leer('sus', []) }, null, 1), 'application/json'));
    const borrar = h('button', { type: 'button', class: 'boton boton--fantasma' }, 'Borrar mis datos');
    borrar.addEventListener('click', () => { this.borrar(); PC.avisar('Datos de métricas borrados.'); this.render(); });
    const permiso = h('button', { type: 'button', class: 'boton boton--fantasma' }, this.consentido() ? 'Desactivar medición' : 'Activar medición');
    permiso.addEventListener('click', () => { PC.LS.escribir('consent', this.consentido() ? 'no' : 'si'); this.render(); });
    PC.vaciar(cont,
      h('p', { class: 'estado-linea' }, estado, ` Tu variante asignada: ${this.variante()}.`),
      h('div', { class: 'kpis' }, [['SUS promedio', r.nSus ? pts(r.susMedio) : '—', r.nSus ? `${r.nSus} respuestas · 68 = promedio de referencia` : 'Aún sin respuestas'],
        ['Tareas completadas', String(r.A.completadas + r.B.completadas), `de ${r.A.inicios + r.B.inicios} iniciadas`],
        ['Eventos guardados', String(r.nEventos), 'solo en este dispositivo']].map(k => h('div', { class: 'kpi panel revelar' }, h('p', { class: 'kpi__t' }, k[0]), h('p', { class: 'kpi__v' }, k[1]), h('p', { class: 'kpi__d' }, k[2])))),
      h('div', { class: 'graficos' },
        this.barras('Tiempo medio hasta la recomendación', [{ etiqueta: 'A', valor: r.A.tiempoMedio }, { etiqueta: 'B', valor: r.B.tiempoMedio, clase: 'b' }], seg),
        this.barras('Tasa de éxito de la tarea', [{ etiqueta: 'A', valor: r.A.exito }, { etiqueta: 'B', valor: r.B.exito, clase: 'b' }], pct, 1),
        this.barras('Abandono del cuestionario', [{ etiqueta: 'A', valor: r.A.abandono }, { etiqueta: 'B', valor: r.B.abandono, clase: 'b' }], pct, 1),
        this.barras('SUS promedio (0–100)', [{ etiqueta: 'A', valor: r.A.sus }, { etiqueta: 'B', valor: r.B.sus, clase: 'b' }], pts, 100)),
      h('div', { class: 'panel' }, tabla),
      h('p', { class: 'nota' }, 'Con pocos datos las diferencias no son concluyentes. Para el informe, junta al menos 5 participantes por variante (ver docs/plan-pruebas-usabilidad-y-ab.md).'),
      h('div', { class: 'acciones' }, permiso, descargar, borrar));
    PC.mov.revelar(cont);
  }
};
