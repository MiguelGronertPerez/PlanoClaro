/* Controlador principal: vistas, navegación, eventos delegados y arranque. */
(function () {
  const estado = { catalogo: [], original: [], origen: '', tipo: null, respuestas: {}, gbMedido: null, inicioMs: 0 };
  PC.estado = estado;
  const vistas = ['inicio', 'cuestionario', 'resultados', 'comparar', 'cuenta', 'medidor', 'ahorro', 'reclamos', 'glosario', 'encuesta', 'metricas', 'admin'];
  const render = { comparar: () => PC.carrito.render(estado.catalogo), cuenta: () => PC.cuenta.render(estado.catalogo), medidor: () => PC.medidor.render(),
    ahorro: () => PC.ahorro.render(estado.catalogo), reclamos: () => PC.reclamos.render(), glosario: () => PC.glosario.render(),
    encuesta: () => PC.sus.render(), metricas: () => PC.metricas.render(), admin: () => PC.admin.render(estado) };
  function mostrar(nombre, foco) {
    if (!vistas.includes(nombre)) nombre = 'inicio';
    if (render[nombre]) render[nombre]();
    vistas.forEach(v => { document.getElementById('vista-' + v).hidden = v !== nombre; });
    document.body.dataset.vista = nombre;
    document.querySelectorAll('.nav__btn[data-ir]').forEach(b => b.toggleAttribute('aria-current', b.dataset.ir === nombre));
    const sec = document.getElementById('vista-' + nombre);
    sec.classList.remove('vista--entra'); void sec.offsetWidth; sec.classList.add('vista--entra');
    window.scrollTo(0, 0);
    const el = document.getElementById(foco || 't-' + nombre) || document.getElementById('principal');
    if (el) { if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true }); }
    if (nombre === 'inicio') {
      if (PC.fibra3d.reanudar) PC.fibra3d.reanudar();
      if (PC.resenas && PC.resenas.renderFlotantes) PC.resenas.renderFlotantes();
    }
    if (location.hash.slice(1) !== nombre) history.replaceState(null, '', nombre === 'inicio' ? location.pathname + location.search : '#' + nombre);
  }
  function iniciarCuestionario(tipo) {
    if (estado.tipo !== tipo) estado.respuestas = {};
    estado.tipo = tipo; estado.inicioMs = performance.now();
    document.getElementById('t-cuestionario').textContent = tipo === 'movil' ? 'Cuéntanos cómo usas tu celular' : 'Cuéntanos cómo usan internet en tu casa';
    const aviso = document.getElementById('aviso-medido');
    aviso.hidden = !(tipo === 'movil' && estado.gbMedido);
    if (!aviso.hidden) aviso.textContent = `Usaremos tu consumo medido: ${estado.gbMedido} GB al mes (más un 10 % de margen).`;
    PC.cuestionario.render(tipo, estado.respuestas);
    PC.metricas.registrar('inicio', { tipo });
    mostrar('cuestionario', 't-cuestionario');
  }
  PC.app = {
    mostrar, iniciarCuestionario,
    usarMedido(gb) { estado.gbMedido = gb; PC.almacen.guardarPerfil({ ...(estado.perfil || {}), tipo: 'movil', gbMedido: gb, respuestas: estado.respuestas, fecha: Date.now() }).catch(() => {}); PC.avisar(`Guardamos ${gb} GB. Ahora responde el cuestionario.`); iniciarCuestionario('movil'); },
    usarPerfil(p) { if (!p) return; estado.respuestas = p.respuestas || {}; estado.gbMedido = p.gbMedido || null; estado.tipo = p.tipo; iniciarCuestionario(p.tipo); }
  };
  PC.tema = {
    aplicar(id) {
      document.body.dataset.tema = id;
      document.documentElement.dataset.tema = id;
      try { localStorage.setItem('pc_tema', id); } catch (e) {}
      document.querySelectorAll('[data-selector-tema]').forEach(b => {
        const activo = b.dataset.selectorTema === id;
        b.classList.toggle('selector-color--activo', activo);
        b.setAttribute('aria-pressed', String(activo));
      });
      const nombres = { monocromo: 'Monocromo Pro', azul: 'Azul Andino', esmeralda: 'Esmeralda Ahorro', purpura: 'Púrpura Tech', terracota: 'Terracota Andino' };
      if (PC.avisar) PC.avisar(`Paleta de color: ${nombres[id] || id}`);
    },
    iniciar() {
      const guardado = (function() { try { return localStorage.getItem('pc_tema'); } catch(e) { return null; } })() || 'monocromo';
      this.aplicar(guardado);
    }
  };

  // Eventos delegados (sin atributos on* en el HTML).
  document.addEventListener('click', async e => {
    const t = e.target.closest('[data-ir],[data-servicio],[data-fav],[data-comp],[data-ics],[data-quitar],[data-elegir-plan],[data-selector-tema],#btn-sonido');
    if (!t) return;
    if (t.id === 'btn-sonido') { PC.sonido.alternar(); return; }
    if (t.dataset.selectorTema) {
      PC.tema.aplicar(t.dataset.selectorTema);
      if (PC.sonido) PC.sonido.tocar('elegir');
      return;
    }
    if (t.dataset.servicio) { PC.sonido.tocar('elegir'); iniciarCuestionario(t.dataset.servicio); return; }
    if (t.dataset.elegirPlan) {
      const plan = estado.catalogo.find(x => x.id === t.dataset.elegirPlan);
      if (plan) {
        if (PC.sus) PC.sus.planElegido = plan;
        PC.sonido.tocar('ok');
        PC.avisar(`Elegiste ${plan.operador} ${plan.nombre}. Cuéntanos tu experiencia.`);
        mostrar('encuesta', 't-encuesta');
      }
      return;
    }
    if (t.dataset.ir) {
      e.preventDefault();
      const irA = t.dataset.ir;
      if (irA === 'catalogo-directo') {
        estado.tipo = estado.tipo || 'movil';
        PC.vista.render(estado.tipo, {
          necesidad: { gb: 30, mbps: 100 },
          presupuestoRelajado: false,
          opciones: estado.catalogo.filter(p => p.tipo === estado.tipo).slice(0, 6).map((plan, i) => ({
            plan,
            clave: i === 0 ? 'eco' : (i === 1 ? 'eq' : 'alto'),
            titulo: plan.nombre
          })),
          descartados: [],
          esCatalogoDirecto: true
        });
        mostrar('resultados', 't-resultados');
        return;
      }
      const panel = document.getElementById('asistente');
      if (!panel.hidden && panel.contains(t)) document.getElementById('cerrar-asistente').click();
      mostrar(irA);
      return;
    }
    if (t.dataset.fav) {
      const on = await PC.favoritos.alternar(t.dataset.fav);
      document.querySelectorAll(`[data-fav="${CSS.escape(t.dataset.fav)}"]`).forEach(b => b.setAttribute('aria-pressed', String(on)));
      PC.avisar(on ? 'Guardado en «Mi cuenta».' : 'Quitado de tus guardados.'); PC.sonido.tocar(on ? 'ok' : 'paso');
      if (document.body.dataset.vista === 'cuenta') PC.cuenta.render(estado.catalogo);
      return;
    }
    if (t.dataset.comp) {
      const on = PC.carrito.alternar(t.dataset.comp, estado.catalogo);
      document.querySelectorAll('[data-comp]').forEach(b => b.setAttribute('aria-pressed', String(PC.carrito.tiene(b.dataset.comp))));
      const n = PC.carrito.ids().length;
      PC.avisar(on ? `Agregado al comparador (${n} de 3).${n >= 2 ? ' Toca «Comparar» arriba para verlos.' : ''}` : 'Quitado del comparador.'); PC.sonido.tocar('elegir');
      return;
    }
    if (t.dataset.quitar) { PC.carrito.alternar(t.dataset.quitar, estado.catalogo); PC.carrito.render(estado.catalogo); return; }
    if (t.dataset.ics) { const p = estado.catalogo.find(x => x.id === t.dataset.ics); if (p) { PC.ics.descargar(p); PC.avisar('Descargamos un recordatorio. Ábrelo para agregarlo a tu calendario.'); } }
  });
  document.getElementById('btn-volver').addEventListener('click', () => mostrar('inicio'));
  document.getElementById('btn-anterior').addEventListener('click', () => PC.cuestionario.ir(PC.cuestionario.paso - 1));
  document.getElementById('btn-siguiente').addEventListener('click', () => PC.cuestionario.siguiente());
  document.getElementById('btn-editar').addEventListener('click', () => iniciarCuestionario(estado.tipo));
  document.getElementById('btn-reiniciar').addEventListener('click', () => { estado.respuestas = {}; estado.tipo = null; mostrar('inicio'); });
  document.getElementById('form-cuestionario').addEventListener('submit', e => {
    e.preventDefault();
    const r = PC.cuestionario.leer();
    const errores = PC.cuestionario.validar(r);
    if (errores.length) { PC.cuestionario.mostrarErrores(errores); return; }
    estado.respuestas = r;
    const res = PC.motor.recomendar(estado.tipo, { ...r, gbMedido: estado.tipo === 'movil' ? estado.gbMedido : null }, estado.catalogo);
    PC.vista.render(estado.tipo, res);
    PC.metricas.registrar('recomendacion', { tipo: estado.tipo, ms: Math.round(performance.now() - estado.inicioMs) });
    PC.almacen.guardarPerfil({ tipo: estado.tipo, respuestas: r, gbMedido: estado.gbMedido, fecha: Date.now() }).catch(() => {});
    PC.sonido.tocar('ok');
    mostrar('resultados', 't-resultados');
  });
  // Consentimiento de métricas (opt-in; no se mide nada antes de aceptar).
  const banner = document.getElementById('consentimiento');
  if (PC.LS.leer('consent', null) === null) banner.hidden = false;
  const decidir = v => { PC.LS.escribir('consent', v); banner.hidden = true; PC.avisar(v === 'si' ? 'Gracias. Puedes desactivarlo en Métricas.' : 'De acuerdo, no mediremos nada.'); };
  document.getElementById('consent-si').addEventListener('click', () => decidir('si'));
  document.getElementById('consent-no').addEventListener('click', () => decidir('no'));

  document.body.dataset.vista = 'inicio';
  PC.hidratarIconos(); PC.sonido.pintar(); PC.carrito.pintarContador(); PC.accesibilidad.iniciar(); PC.asistente.iniciar(); PC.tema.iniciar();
  PC.mov.inclinarTodo(document.getElementById('vista-inicio')); PC.mov.revelar();
  // Three.js (650 KB) se carga después del primer pintado: el contenido no espera a la decoración.
  const cargar3d = () => {
    if (!document.getElementById('fibra')) return;
    const s = document.createElement('script'); s.src = 'vendor/three/three.min.js';
    s.onload = () => { try { PC.fibra3d.iniciar(); } catch (e) { /* la escena es decorativa */ } };
    s.onerror = () => document.getElementById('fibra').hidden = true;
    document.head.appendChild(s);
  };
  if ('requestIdleCallback' in window) requestIdleCallback(cargar3d, { timeout: 1500 }); else setTimeout(cargar3d, 600);
  PC.datos.cargar().then(async d => {
    estado.catalogo = d.planes; estado.original = d.original; estado.origen = d.origen;
    const ops = new Set(d.planes.map(p => p.operador)).size, m = d.planes.filter(p => p.tipo === 'movil').length;
    document.getElementById('aviso-datos').textContent = `${m} planes de celular y ${d.planes.length - m} de internet de casa, de ${ops} empresas. Revisados el ${PC.util.fecha(d.fechaConsulta)}.`;
    try { PC.escena.montar(d.planes, d.fechaConsulta); } catch (e) { /* decorativa */ }
    await PC.cuenta.iniciar(); await PC.favoritos.cargar();
    window.PC_ESTADO = estado; // útil para pruebas
    const destino = location.hash.slice(1);
    if (vistas.includes(destino) && !['cuestionario', 'resultados'].includes(destino)) mostrar(destino);
  }).catch(err => {
    document.getElementById('aviso-datos').textContent = 'Error: ' + err.message;
    document.querySelectorAll('[data-servicio]').forEach(b => { b.disabled = true; });
  });
})();
