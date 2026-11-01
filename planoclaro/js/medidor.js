/* Guía para medir el consumo real de datos (Android / iPhone) y usarlo en el cuestionario. */
PC.medidor = {
  PASOS: {
    android: ['Abre «Ajustes» (el ícono de engranaje).', 'Entra a «Redes e Internet» o «Conexiones» (el nombre cambia según la marca).', 'Toca «Uso de datos» o «Uso de datos móviles».', 'Elige el periodo del último mes completo. Mira el número total en GB.', 'Anótalo aquí abajo.'],
    iphone: ['Abre «Configuración» (el ícono de engranaje).', 'Toca «Celular» o «Datos celulares».', 'Mira «Periodo actual». Ojo: el iPhone suma desde la última vez que se reiniciaron las estadísticas, no por mes.', 'Si quieres un mes exacto, baja hasta el final, toca «Restablecer estadísticas» y vuelve a mirar en 30 días.', 'Anota el número en GB aquí abajo.']
  },
  render() {
    const h = PC.h, cont = document.getElementById('medidor');
    const lista = h('ol', { class: 'pasos-medir', id: 'pasos-medir' });
    const tabs = ['android', 'iphone'].map((t, i) => {
      const b = h('button', { type: 'button', role: 'tab', id: 'tab-' + t, 'aria-selected': String(i === 0), 'aria-controls': 'panel-medir', tabindex: i === 0 ? '0' : '-1', class: 'tab' }, PC.icono('celular'), t === 'android' ? 'Android' : 'iPhone');
      b.addEventListener('click', () => elegir(t));
      b.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const otro = t === 'android' ? 'iphone' : 'android'; elegir(otro); document.getElementById('tab-' + otro).focus(); } });
      return b;
    });
    const elegir = t => {
      tabs.forEach(b => { const sel = b.id === 'tab-' + t; b.setAttribute('aria-selected', String(sel)); b.tabIndex = sel ? 0 : -1; });
      document.getElementById('panel-medir').setAttribute('aria-labelledby', 'tab-' + t);
      PC.vaciar(lista, this.PASOS[t].map((p, i) => h('li', { class: 'revelar' }, h('span', { class: 'paso__n', 'aria-hidden': 'true' }, String(i + 1)), h('span', null, p))));
      PC.mov.revelar(lista);
    };
    const entrada = h('input', { id: 'gb-medido', type: 'number', inputmode: 'decimal', min: '0', max: '1000', step: '0.1', 'aria-describedby': 'gb-ayuda gb-err' });
    const prev = PC.estado && PC.estado.gbMedido; if (prev) entrada.value = prev;
    const err = h('p', { class: 'campo__error', id: 'gb-err', hidden: true });
    const form = h('form', { class: 'panel formulario', novalidate: true },
      h('div', { class: 'campo' }, h('label', { for: 'gb-medido' }, '¿Cuántos GB usaste el último mes?'), entrada,
        h('p', { class: 'campo__ayuda', id: 'gb-ayuda' }, 'Escribe solo el número, por ejemplo 14 o 7.5. Si ves «MB», divide entre 1000 (por ejemplo 800 MB = 0.8 GB).'), err),
      h('div', { class: 'acciones' }, h('button', { type: 'submit', class: 'boton boton--primario' }, 'Usar este número en el cuestionario')));
    form.addEventListener('submit', ev => {
      ev.preventDefault();
      const v = Number(String(entrada.value).replace(',', '.'));
      if (!entrada.value || !Number.isFinite(v) || v <= 0 || v > 1000) { err.textContent = 'Escribe un número entre 0.1 y 1000.'; err.hidden = false; entrada.setAttribute('aria-invalid', 'true'); entrada.focus(); PC.sonido.tocar('error'); return; }
      err.hidden = true; entrada.removeAttribute('aria-invalid');
      PC.app.usarMedido(Math.round(v * 10) / 10);
    });
    PC.vaciar(cont, h('div', { class: 'tabs', role: 'tablist', 'aria-label': 'Tipo de celular' }, tabs),
      h('div', { class: 'panel', role: 'tabpanel', id: 'panel-medir', 'aria-labelledby': 'tab-android', tabindex: '0' }, lista,
        h('p', { class: 'nota' }, 'También puedes verlo en la app de tu operador (Mi Claro, Mi Movistar, Mi Entel o Mi Bitel), en la sección de consumo.')),
      form);
    elegir('android');
  }
};
