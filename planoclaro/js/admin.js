/* Panel de administración (CRUD del catálogo, importar/exportar JSON). */
PC.admin = {
  HASH_DEMO: 'dae5e5f203f7c9e180cb05c46ee4b362eea0626686171051d29e7ff68cff2feb',
  dentro() { try { return sessionStorage.getItem('pc:admin') === '1'; } catch (e) { return false; } },
  async sha(t) { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); },
  render(estado) {
    const h = PC.h, cont = document.getElementById('admin');
    if (!this.dentro()) {
      const err = h('p', { class: 'errores', role: 'alert', hidden: true });
      const f = h('form', { class: 'panel formulario', novalidate: true },
        h('h2', null, 'Acceso de administración'), h('p', null, 'Ingresa con tus credenciales autorizadas.'),
        PC.cuenta.campo('a-usuario', 'Usuario', 'text', { autocomplete: 'username', maxlength: 40 }),
        PC.cuenta.campo('a-clave', 'Clave', 'password', { autocomplete: 'current-password', maxlength: 64 }), err,
        h('button', { type: 'submit', class: 'boton boton--primario' }, 'Entrar al panel'));
      f.addEventListener('submit', async ev => {
        ev.preventDefault();
        const ok = (await this.sha(f.querySelector('#a-usuario').value.trim() + ':' + f.querySelector('#a-clave').value)) === this.HASH_DEMO;
        if (!ok) { err.textContent = 'Usuario o clave incorrectos.'; err.hidden = false; return; }
        try { sessionStorage.setItem('pc:admin', '1'); } catch (e) { /* sin sesión */ }
        this.render(estado);
      });
      PC.vaciar(cont, f); return;
    }
    const lista = estado.catalogo;
    const nuevo = h('button', { type: 'button', class: 'boton boton--primario' }, PC.icono('mas'), 'Nuevo plan');
    nuevo.addEventListener('click', () => this.editar(estado, null));
    const exportar = h('button', { type: 'button', class: 'boton boton--fantasma' }, 'Exportar JSON');
    exportar.addEventListener('click', () => PC.util.descargar('planoclaro-catalogo.json', JSON.stringify({ planes: lista }, null, 1), 'application/json'));
    const archivo = h('input', { type: 'file', accept: 'application/json,.json', id: 'importar', class: 'sr-only' });
    const importar = h('label', { for: 'importar', class: 'boton boton--fantasma' }, 'Importar JSON');
    archivo.addEventListener('change', () => this.importar(archivo.files[0], estado));
    const restaurar = h('button', { type: 'button', class: 'boton boton--fantasma' }, 'Volver al catálogo original');
    restaurar.addEventListener('click', async () => { if (!confirm('¿Descartar los cambios del panel y volver al catálogo original?')) return; await PC.almacen.borrarCatalogo(); estado.catalogo = estado.original; PC.avisar('Catálogo original restaurado.'); this.render(estado); });
    const salir = h('button', { type: 'button', class: 'enlace' }, 'Salir del panel');
    salir.addEventListener('click', () => { try { sessionStorage.removeItem('pc:admin'); } catch (e) { /* */ } this.render(estado); });
    const tabla = h('table', { class: 'tabla tabla--admin' }, h('caption', null, `${lista.length} planes en el catálogo`),
      h('thead', null, h('tr', null, ['Plan', 'Tipo', 'Regular', 'Verificación', 'Acciones'].map(t => h('th', { scope: 'col' }, t)))),
      h('tbody', null, lista.map(p => {
        const ed = h('button', { type: 'button', class: 'enlace', 'aria-label': 'Editar ' + p.operador + ' ' + p.nombre }, 'Editar');
        ed.addEventListener('click', () => this.editar(estado, p));
        const bo = h('button', { type: 'button', class: 'enlace enlace--peligro', 'aria-label': 'Borrar ' + p.operador + ' ' + p.nombre }, 'Borrar');
        bo.addEventListener('click', async () => { if (!confirm(`¿Borrar ${p.operador} ${p.nombre}?`)) return; await this.guardar(estado, lista.filter(x => x.id !== p.id)); });
        return h('tr', null, h('th', { scope: 'row' }, `${p.operador} ${p.nombre}`), h('td', null, p.tipo === 'movil' ? 'Celular' : 'Hogar'), h('td', null, PC.util.soles(p.precioRegular)), h('td', null, PC.vista.sello(p.verificacion.precio, true)), h('td', null, ed, ' ', bo));
      })));
    PC.vaciar(cont, h('div', { class: 'acciones acciones--izq' }, nuevo, exportar, importar, archivo, restaurar, salir),
      h('p', { class: 'nota' }, estado.origen === 'admin' ? 'Estás viendo el catálogo editado en el panel.' : 'Estás viendo el catálogo original (data/planes.json).'),
      h('div', { id: 'admin-form' }), h('div', { class: 'panel tabla-caja' }, tabla));
  },
  async guardar(estado, planes) {
    try { await PC.almacen.guardarCatalogo(planes); estado.catalogo = planes; estado.origen = 'admin'; PC.avisar('Catálogo guardado.'); PC.sonido.tocar('ok'); this.render(estado); }
    catch (e) { PC.avisar('No se pudo guardar: ' + e.message); }
  },
  importar(file, estado) {
    if (!file) return;
    if (file.size > 1024 * 1024) { PC.avisar('El archivo es muy grande (máximo 1 MB).'); return; }
    const r = new FileReader();
    r.onload = () => {
      try {
        const d = JSON.parse(String(r.result)), planes = Array.isArray(d) ? d : d.planes;
        if (!Array.isArray(planes)) throw new Error('El JSON debe tener una lista «planes».');
        const malos = planes.map((p, i) => ({ i, e: PC.datos.errores(p) })).filter(x => x.e.length);
        if (malos.length) throw new Error(`${malos.length} plan(es) con errores. Primero: #${malos[0].i + 1}: ${malos[0].e.join('; ')}`);
        const ids = new Set(planes.map(p => p.id)); if (ids.size !== planes.length) throw new Error('Hay planes con el mismo id.');
        this.guardar(estado, planes);
      } catch (e) { PC.avisar('No se importó: ' + e.message); }
    };
    r.readAsText(file);
  },
  editar(estado, p) {
    const h = PC.h, cont = document.getElementById('admin-form'), nuevo = !p;
    p = p || { id: '', tipo: 'movil', operador: '', nombre: '', precioPromo: null, mesesPromo: 0, precioRegular: 0, gbAltaVelocidad: null, velocidadMbps: null, fuentes: [], verificacion: { precio: 'no_verificado' }, fechaConsulta: new Date().toISOString().slice(0, 10), extras: [] };
    const campo = (id, et, tipo, valor, extra) => { const c = PC.cuenta.campo('f-' + id, et, tipo, Object.assign({ required: false }, extra)); c.querySelector('input').value = valor == null ? '' : valor; return c; };
    const sel = (id, et, ops, valor) => { const s = h('select', { id: 'f-' + id }, ops.map(o => h('option', { value: o[0] }, o[1]))); s.value = valor; return h('div', { class: 'campo' }, h('label', { for: 'f-' + id }, et), s); };
    const err = h('div', { class: 'errores', role: 'alert', tabindex: '-1', hidden: true });
    const f = h('form', { class: 'panel formulario formulario--rejilla', novalidate: true, 'aria-labelledby': 't-editar' },
      h('h2', { id: 't-editar' }, nuevo ? 'Nuevo plan' : 'Editar ' + p.operador + ' ' + p.nombre),
      campo('id', 'Id (minúsculas y guiones)', 'text', p.id, nuevo ? { maxlength: 60 } : { readonly: true }),
      sel('tipo', 'Tipo', [['movil', 'Celular'], ['hogar', 'Internet hogar']], p.tipo),
      campo('operador', 'Operador', 'text', p.operador, { maxlength: 40 }), campo('nombre', 'Nombre del plan', 'text', p.nombre, { maxlength: 80 }),
      campo('precioPromo', 'Precio de oferta S/ (vacío = sin oferta)', 'number', p.precioPromo, { step: '0.01', min: '0' }),
      campo('mesesPromo', 'Meses de oferta', 'number', p.mesesPromo, { min: '0', max: '24' }),
      campo('precioRegular', 'Precio regular S/', 'number', p.precioRegular, { step: '0.01', min: '1' }),
      campo('gb', 'GB rápidos (celular; vacío = ilimitado)', 'number', p.gbAltaVelocidad, { min: '0' }),
      campo('mbps', 'Velocidad Mbps (hogar)', 'number', p.velocidadMbps, { min: '1' }),
      campo('fuentes', 'Fuentes (URLs https, separadas por coma)', 'text', (p.fuentes || []).join(', '), { maxlength: 1000 }),
      sel('verif', 'Verificación del precio', PC.datos.VERIF.map(v => [v, PC.ETIQUETAS_VERIF[v].corto]), p.verificacion.precio),
      err, h('div', { class: 'acciones' }, h('button', { type: 'submit', class: 'boton boton--primario' }, 'Guardar plan')));
    f.addEventListener('submit', ev => {
      ev.preventDefault();
      const v = id => f.querySelector('#f-' + id).value.trim(), n = id => v(id) === '' ? null : Number(v(id));
      const tipo = v('tipo');
      const plan = Object.assign({}, p, { id: v('id'), tipo, operador: v('operador'), nombre: v('nombre'), precioPromo: n('precioPromo'), mesesPromo: n('mesesPromo') || 0,
        precioRegular: n('precioRegular'), fuentes: v('fuentes').split(',').map(x => x.trim()).filter(Boolean), verificacion: Object.assign({}, p.verificacion, { precio: v('verif') }) });
      if (tipo === 'movil') { plan.gbAltaVelocidad = n('gb'); plan.datosIlimitados = plan.datosIlimitados || false; plan.extras = plan.extras || []; plan.internacional = plan.internacional || 'no_verificado'; plan.verificacion.velocidadTrasConsumo = plan.verificacion.velocidadTrasConsumo || 'no_verificado'; plan.verificacion.permanencia = plan.verificacion.permanencia || 'no_verificado'; }
      else { plan.velocidadMbps = n('mbps'); plan.tecnologia = plan.tecnologia || 'Fibra óptica'; plan.cobertura = plan.cobertura || 'nacional'; plan.verificacion.instalacion = plan.verificacion.instalacion || 'no_verificado'; plan.verificacion.permanencia = plan.verificacion.permanencia || 'no_verificado'; }
      const errores = PC.datos.errores(plan);
      if (nuevo && estado.catalogo.some(x => x.id === plan.id)) errores.push('id: ya existe');
      if (errores.length) { PC.vaciar(err, h('p', null, h('strong', null, 'Revisa estos campos:')), h('ul', null, errores.map(e => h('li', null, e)))); err.hidden = false; err.focus(); return; }
      this.guardar(estado, nuevo ? [...estado.catalogo, plan] : estado.catalogo.map(x => x.id === plan.id ? plan : x));
    });
    PC.vaciar(cont, f); f.querySelector('input').focus();
  }
};
