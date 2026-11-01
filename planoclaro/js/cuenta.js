/* Cuenta: vista completa de autenticación y perfil para PlanoClaro.
   Usa PC.login para Google Sign-In, email/contraseña y recuperación.
   UI construida con PC.h() — sin innerHTML con datos de usuario.
   Patrón global PC.*. Accesibilidad: focus, role=alert, aria-live. */
PC.cuenta = {
  usuario: null,

  /* ── Arranque ─────────────────────────────────────────────── */
  async iniciar() {
    await PC.almacenListo;
    try { this.usuario = await PC.almacen.usuario(); } catch (e) { this.usuario = null; }
    if (typeof PC.login !== 'undefined') {
      PC.login.onCambioEstado(usr => {
        this.usuario = usr;
        this.pintarNav();
        if (document.body && document.body.dataset.vista === 'cuenta') {
          this.render(PC.estado ? PC.estado.catalogo : []);
        }
      });
      PC.login.observarEstado();
    }
    this.pintarNav();
  },

  pintarNav() {
    const b = document.getElementById('nav-cuenta');
    if (!b) return;
    if (this.usuario) {
      b.textContent = this.usuario.nombre ? this.usuario.nombre.split(' ')[0] : 'Mi cuenta';
    } else {
      b.textContent = 'Mi cuenta';
    }
  },

  /* ── Campo de formulario reutilizable ─────────────────────── */
  _campo(id, etiqueta, tipo, extra) {
    const h = PC.h;
    return h('div', { class: 'campo' },
      h('label', { for: id }, etiqueta),
      h('input', Object.assign({ id, name: id, type: tipo }, extra || {})),
      h('p', { class: 'campo__error', id: id + '-err', hidden: true })
    );
  },

  /* ── Mensaje de error (role=alert, foco) ──────────────────── */
  _mostrarError(el, msg) {
    el.textContent = msg; el.hidden = false;
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus();
  },

  /* ── Logo oficial de Google en SVG ──────────────────────── */
  _logoGoogleSVG() {
    const h = PC.h;
    return h('svg', { viewBox: '0 0 24 24', class: 'ico ico--google', 'aria-hidden': 'true', focusable: 'false' },
      h('path', { fill: '#4285F4', d: 'M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' }),
      h('path', { fill: '#34A853', d: 'M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' }),
      h('path', { fill: '#FBBC05', d: 'M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z' }),
      h('path', { fill: '#EA4335', d: 'M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' })
    );
  },

  /* ── Botón Google ────────────────────────────────────────── */
  _btnGoogle() {
    const h = PC.h;
    const btn = h('button', { type: 'button', class: 'boton boton--google', id: 'btn-google' }, this._logoGoogleSVG(), 'Continuar con Google');
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      const err = document.getElementById('c-error-google');
      if (err) err.hidden = true;
      try {
        await PC.login.iniciarGoogle();
        await PC.favoritos.cargar();
        PC.sonido.tocar('ok');
        PC.avisar('Bienvenido/a. Sesión iniciada con Google.');
        this.pintarNav();
        if (PC.cuenta.volverA) {
          const v = PC.cuenta.volverA;
          PC.cuenta.volverA = null;
          PC.app.mostrar(v);
        } else {
          this.render(PC.estado ? PC.estado.catalogo : []);
        }
      } catch (e) {
        if (err) this._mostrarError(err, e.message);
        PC.sonido.tocar('error');
      } finally { btn.disabled = false; }
    });
    return btn;
  },

  /* ── FORMULARIO: Entrar (Únicamente con Google) ──────────── */
  async render(catalogo) {
    const h = PC.h, cont = document.getElementById('cuenta');
    if (!cont) return;

    const modoEl = document.getElementById('cuenta-modo');
    if (modoEl) {
      modoEl.textContent = 'Acceso seguro mediante cuenta de Google. Sincroniza tus planes guardados y reseñas verificadas.';
    }

    if (!this.usuario) {
      this._renderLogin(cont, catalogo);
      return;
    }
    this._renderPerfil(cont, catalogo);
  },

  /* ── Vista: no autenticado (Solo Google) ──────────────────── */
  _renderLogin(cont, catalogo) {
    const h = PC.h;
    const errGoogle = h('p', { class: 'errores', id: 'c-error-google', role: 'alert', hidden: true });

    const panelPrincipal = h('div', { class: 'panel login__panel' },
      h('div', { class: 'login__cabeza-google' },
        this._logoGoogleSVG(),
        h('h2', { id: 't-acceso' }, 'Ingresa a tu cuenta'),
        h('p', { class: 'login__sub' },
          'Inicia sesión únicamente con tu cuenta de Google para guardar tus planes favoritos, ' +
          'sincronizar tu perfil y compartir reseñas verificadas sin formularios de registro.'
        )
      ),
      this._btnGoogle(),
      errGoogle
    );

    PC.vaciar(cont, panelPrincipal, this._bloqueInvitado());
  },

  /* ── Vista: usuario autenticado ─────────────────────────────── */
  async _renderPerfil(cont, catalogo) {
    const h = PC.h, u = this.usuario;

    // Botón salir
    const btnSalir = h('button', { type: 'button', class: 'boton boton--fantasma login__salir' }, 'Cerrar sesión');
    btnSalir.addEventListener('click', async () => {
      await PC.login.cerrarSesion();
      await PC.favoritos.cargar();
      this.pintarNav();
      PC.avisar('Sesión cerrada.');
      this.render(catalogo);
    });

    // Avatar
    const avatar = u.foto
      ? h('img', { src: u.foto, alt: '', class: 'login__avatar', width: 48, height: 48, referrerpolicy: 'no-referrer' })
      : h('span', { class: 'login__avatar-inicial', 'aria-hidden': 'true' }, (u.nombre || u.correo || '?')[0].toUpperCase());

    // Tarjeta de perfil
    const tarjetaPerfil = h('div', { class: 'panel login__perfil-panel' },
      h('div', { class: 'login__perfil-fila' }, avatar,
        h('div', { class: 'login__perfil-info' },
          h('p', { class: 'login__nombre' }, u.nombre || 'Sin nombre'),
          h('p', { class: 'login__correo' }, u.correo),
          h('p', { class: 'login__proveedor' },
            u.proveedor === 'google' ? '✓ Cuenta de Google' : '✓ Correo y contraseña'
          )
        )
      ),
      btnSalir
    );

    // Perfil de consumo
    let perfil = null;
    try { perfil = await PC.almacen.leerPerfil(); } catch (e) { /* sin perfil */ }
    const btnUsarPerfil = h('button', { type: 'button', class: 'boton boton--primario' }, 'Usar mi perfil guardado');
    btnUsarPerfil.addEventListener('click', () => PC.app.usarPerfil(perfil));

    const tarjetaConsumo = h('div', { class: 'panel' },
      h('h2', null, 'Mi perfil de consumo'),
      perfil
        ? h('div', null,
            h('p', null,
              `Guardado el ${new Date(perfil.fecha).toLocaleDateString('es-PE')} para ${perfil.tipo === 'movil' ? 'celular' : 'internet de casa'}`,
              perfil.gbMedido ? ` · ${perfil.gbMedido} GB medidos` : ''
            ),
            btnUsarPerfil
          )
        : h('p', null, 'Aún no tienes perfil. Se guarda cuando terminas el cuestionario.')
    );

    const nodos = [tarjetaPerfil, tarjetaConsumo, this._bloqueFavoritos(catalogo)];
    PC.vaciar(cont, ...nodos);
  },

  /* ── Bloque: favoritos ────────────────────────────────────── */
  _bloqueFavoritos(catalogo) {
    const h = PC.h;
    const favs = PC.favoritos.ids.map(i => catalogo.find(p => p.id === i)).filter(Boolean);
    return h('div', { class: 'panel' },
      h('h2', null, 'Planes guardados'),
      favs.length
        ? h('ul', { class: 'lista-favs' }, ...favs.map(p => {
            const quitar = h('button', { type: 'button', class: 'enlace', dataset: { fav: p.id } }, 'Quitar');
            return h('li', null,
              h('span', null, h('strong', null, `${p.operador} ${p.nombre}`), ` · ${PC.util.soles(PC.costos.anual(p))} en 12 meses`),
              quitar
            );
          }))
        : h('p', null, 'Toca «Guardar» en una tarjeta de resultados para verla aquí.')
    );
  },

  /* ── Bloque: nota para invitados ─────────────────────────── */
  _bloqueInvitado() {
    const h = PC.h;
    return h('div', { class: 'panel login__panel-invitado' },
      h('h2', null, '¿Prefieres no crear cuenta?'),
      h('p', null, 'Puedes comparar planes, usar la calculadora de ahorro y generar reclamos sin registrarte. Solo tus planes guardados no se conservarán al cerrar el navegador.')
    );
  }
};
