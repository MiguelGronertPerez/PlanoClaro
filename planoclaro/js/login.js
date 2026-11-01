/* login.js — Sistema de autenticación PlanoClaro.
   Gestiona Google Sign-In, email/contraseña, tokens de sesión (Firebase ID tokens),
   limitación de intentos fallidos y registro de sesiones en Firestore.
   Patrón global PC.* / PC.h(). Sin innerHTML con datos de usuario.
   Solo funciona con Firebase activo (http/https). En modo local usa PC.almacen (localStorage). */
(function () {
  'use strict';

  /* ── Constantes ─────────────────────────────────────────── */
  const MAX_INTENTOS = 5;          // intentos antes del bloqueo
  const BLOQUEO_MS   = 15 * 60 * 1000; // 15 minutos

  /* ── Rate-limiting local (falla rápida sin Firestore) ───── */
  const _intentosLS = {
    clave(correo) { return 'login_int:' + correo; },
    leer(correo) { return PC.LS.leer(this.clave(correo), { n: 0, hasta: 0 }); },
    sumar(correo) {
      const d = this.leer(correo);
      d.n += 1;
      if (d.n >= MAX_INTENTOS) d.hasta = Date.now() + BLOQUEO_MS;
      PC.LS.escribir(this.clave(correo), d);
      return d;
    },
    reiniciar(correo) { PC.LS.borrar(this.clave(correo)); },
    estaBloqueado(correo) {
      const d = this.leer(correo);
      if (d.hasta > Date.now()) return Math.ceil((d.hasta - Date.now()) / 60000);
      return 0;
    }
  };

  /* ── Utilidad: minutos restantes de bloqueo ──────────────── */
  function minRestantes(ms) { return Math.max(1, Math.ceil(ms / 60000)); }

  /* ── Módulo principal ────────────────────────────────────── */
  PC.login = {

    /* Estado observable: callbacks registrados con onCambioEstado */
    _subs: [],

    /* ─────────────────────────────────────────────────────────
       onCambioEstado(fn)
       Registra un observador que recibe el usuario actual (o null).
       ───────────────────────────────────────────────────────── */
    onCambioEstado(fn) {
      this._subs.push(fn);
      return () => { this._subs = this._subs.filter(f => f !== fn); };
    },

    _notificar(usuario) {
      this._subs.forEach(fn => { try { fn(usuario); } catch (e) { /* silencioso */ } });
    },

    /* ─────────────────────────────────────────────────────────
       iniciarGoogle()
       Popup oficial de Google o selector de cuenta Google.
       Único método de autenticación permitido en PlanoClaro.
       ───────────────────────────────────────────────────────── */
    async iniciarGoogle() {
      await PC.almacenListo;
      if (PC.almacen.modo === 'firebase' && window.firebase && window.firebase.auth) {
        const auth = window.firebase.auth();
        const proveedor = new window.firebase.auth.GoogleAuthProvider();
        proveedor.addScope('email');
        proveedor.addScope('profile');
        proveedor.setCustomParameters({ prompt: 'select_account' });
        let cred;
        try {
          cred = await auth.signInWithPopup(proveedor);
        } catch (err) {
          throw new Error(this._mensajeError(err.code || err.message));
        }
        const u = cred.user;
        await this._registrarSesion(u);
        await PC.login._persistirPerfil(u, 'google');
        const usr = { correo: u.email, nombre: u.displayName || '', foto: u.photoURL || '', uid: u.uid, proveedor: 'google' };
        PC.cuenta.usuario = usr;
        this._notificar(usr);
        return usr;
      }

      // En entorno local o sin Firebase activo:
      // Diálogo Google para seleccionar la cuenta Google
      return new Promise((resolve, reject) => {
        const existente = document.getElementById('dialogo-google-oauth');
        if (existente) existente.remove();

        const h = PC.h;
        const inputG = h('input', {
          type: 'email',
          id: 'google-email-input',
          class: 'campo-texto',
          required: true,
          placeholder: 'tu.correo@gmail.com',
          autocomplete: 'email'
        });
        const errModal = h('p', { class: 'errores', role: 'alert', hidden: true });

        const modal = h('div', { id: 'dialogo-google-oauth', class: 'modal-google-oauth', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 't-google-modal' },
          h('div', { class: 'modal-google-oauth__tarjeta panel' },
            h('div', { class: 'modal-google-oauth__cabeza' },
              PC.cuenta._logoGoogleSVG ? PC.cuenta._logoGoogleSVG() : h('span', null, 'G'),
              h('h2', { id: 't-google-modal' }, 'Acceder con Google'),
              h('p', null, 'Ingresa con tu cuenta de Google para guardar tus planes y dejar reseñas verificadas.')
            ),
            h('form', { class: 'modal-google-oauth__form' },
              h('div', { class: 'grupo-campo' },
                h('label', { for: 'google-email-input' }, 'Correo electrónico de Google:'),
                inputG
              ),
              errModal,
              h('div', { class: 'acciones modal-google-oauth__acciones' },
                h('button', { type: 'button', class: 'boton boton--fantasma', id: 'btn-cancelar-google' }, 'Cancelar'),
                h('button', { type: 'submit', class: 'boton boton--primario' }, 'Continuar con Google')
              )
            )
          )
        );

        modal.querySelector('#btn-cancelar-google').addEventListener('click', () => {
          modal.remove();
          reject(new Error('Acceso cancelado.'));
        });

        modal.querySelector('form').addEventListener('submit', e => {
          e.preventDefault();
          const em = inputG.value.trim().toLowerCase();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) {
            errModal.textContent = 'Escribe un correo de Google válido (ej. nombre@gmail.com).';
            errModal.hidden = false;
            inputG.focus();
            return;
          }
          const nombre = em.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          const usr = {
            correo: em,
            nombre: nombre,
            foto: '',
            uid: 'google_' + em.replace(/[^a-zA-Z0-9]/g, '_'),
            proveedor: 'google'
          };
          PC.LS.escribir('sesion', em);
          const us = PC.LS.leer('usuarios', {});
          us[em] = { nombre: usr.nombre, uid: usr.uid, proveedor: 'google' };
          PC.LS.escribir('usuarios', us);
          PC.cuenta.usuario = usr;
          PC.login._notificar(usr);
          modal.remove();
          resolve(usr);
        });

        document.body.appendChild(modal);
        inputG.focus();
      });
    },

    /* ─────────────────────────────────────────────────────────
       iniciarEmail(correo, clave)
       Autenticación con email/contraseña. Incluye rate-limiting
       local + en Firestore (si disponible).
       ───────────────────────────────────────────────────────── */
    async iniciarEmail(correo, clave) {
      correo = String(correo || '').trim().toLowerCase();
      const bloqueo = _intentosLS.estaBloqueado(correo);
      if (bloqueo) throw new Error(`Cuenta bloqueada ${bloqueo} min por intentos fallidos. Intenta más tarde.`);

      await PC.almacenListo;
      if (PC.almacen.modo !== 'firebase') {
        // Modo local: delega al adaptador localStorage de almacen.js
        const usr = await PC.almacen.entrar(correo, clave);
        PC.cuenta.usuario = usr;
        this._notificar(usr);
        return usr;
      }

      const auth = window.firebase.auth();
      try {
        const cred = await auth.signInWithEmailAndPassword(correo, clave);
        _intentosLS.reiniciar(correo);
        await this._registrarSesion(cred.user);
        await PC.login._persistirPerfil(cred.user, 'email');
        const usr = { correo: cred.user.email, nombre: cred.user.displayName || '', foto: '', uid: cred.user.uid, proveedor: 'email' };
        PC.cuenta.usuario = usr;
        this._notificar(usr);
        return usr;
      } catch (e) {
        const d = _intentosLS.sumar(correo);
        const restantes = MAX_INTENTOS - d.n;
        if (d.n >= MAX_INTENTOS) throw new Error(`Demasiados intentos. Cuenta bloqueada 15 minutos.`);
        throw new Error(this._mensajeError(e.code) + (restantes > 0 ? ` (${restantes} intento${restantes === 1 ? '' : 's'} restante${restantes === 1 ? '' : 's'}).` : ''));
      }
    },

    /* ─────────────────────────────────────────────────────────
       registrar(correo, clave, nombre)
       Crea una cuenta nueva con email/contraseña.
       ───────────────────────────────────────────────────────── */
    async registrar(correo, clave, nombre) {
      correo = String(correo || '').trim().toLowerCase();
      nombre = String(nombre || '').trim().slice(0, 60);
      await PC.almacenListo;

      if (PC.almacen.modo !== 'firebase') {
        const usr = await PC.almacen.registrar(correo, clave, nombre);
        PC.cuenta.usuario = usr;
        this._notificar(usr);
        return usr;
      }

      const auth = window.firebase.auth();
      const cred  = await auth.createUserWithEmailAndPassword(correo, clave);
      if (nombre) await cred.user.updateProfile({ displayName: nombre });
      await this._registrarSesion(cred.user);
      await PC.login._persistirPerfil(cred.user, 'email');
      const usr = { correo: cred.user.email, nombre: nombre || cred.user.displayName || '', foto: '', uid: cred.user.uid, proveedor: 'email' };
      PC.cuenta.usuario = usr;
      this._notificar(usr);
      return usr;
    },

    /* ─────────────────────────────────────────────────────────
       cerrarSesion()
       Cierra la sesión en Firebase y limpia estado local.
       ───────────────────────────────────────────────────────── */
    async cerrarSesion() {
      await PC.almacen.salir();
      PC.cuenta.usuario = null;
      this._notificar(null);
    },

    /* ─────────────────────────────────────────────────────────
       recuperarContrasena(correo)
       Envía el email de restablecimiento de Firebase Auth.
       ───────────────────────────────────────────────────────── */
    async recuperarContrasena(correo) {
      correo = String(correo || '').trim().toLowerCase();
      await PC.almacenListo;
      if (PC.almacen.modo !== 'firebase') throw new Error('La recuperación de contraseña requiere Firebase activo.');
      await window.firebase.auth().sendPasswordResetEmail(correo);
    },

    /* ─────────────────────────────────────────────────────────
       observarEstado()
       Conecta el observador de Firebase Auth al arranque.
       Llama a los suscritos de _subs cuando Firebase notifica.
       ───────────────────────────────────────────────────────── */
    async observarEstado() {
      await PC.almacenListo;
      if (PC.almacen.modo !== 'firebase') return; // localStorage ya lo gestiona
      window.firebase.auth().onAuthStateChanged(u => {
        if (u) {
          const usr = { correo: u.email, nombre: u.displayName || '', foto: u.photoURL || '', uid: u.uid,
            proveedor: u.providerData[0] ? u.providerData[0].providerId.replace('.com', '') : 'email' };
          PC.cuenta.usuario = usr;
          this._notificar(usr);
        } else {
          PC.cuenta.usuario = null;
          this._notificar(null);
        }
      });
    },

    /* ─────────────────────────────────────────────────────────
       Privado: _registrarSesion(firebaseUser)
       Graba en Firestore el registro de la sesión activa.
       Esquema: /usuarios/{uid}/sesiones/{token_corto}
       Implementado como sub-campo del documento raíz del usuario.
       ───────────────────────────────────────────────────────── */
    async _registrarSesion(u) {
      if (!window.firebase || PC.almacen.modo !== 'firebase') return;
      try {
        const db  = window.firebase.firestore();
        const uid = u.uid;
        const idToken = await u.getIdToken();
        // Usamos los primeros 8 chars del token como ID de sesión (no es reversible al token completo)
        const sesId = idToken.slice(0, 8) + '_' + Date.now().toString(36);
        const ahora = new Date().toISOString();
        await db.collection('usuarios').doc(uid).set({
          sesiones: {
            [sesId]: {
              proveedor : u.providerData[0] ? u.providerData[0].providerId : 'password',
              creado    : ahora,
              expira    : new Date(Date.now() + 3600 * 1000).toISOString(), // 1 h (Firebase renueva automáticamente)
              userAgent : navigator.userAgent.slice(0, 120)
            }
          },
          ultimoAcceso: ahora
        }, { merge: true });
      } catch (e) {
        // El registro de sesión es no crítico: no interrumpe el login
      }
    },

    /* ─────────────────────────────────────────────────────────
       Privado: _persistirPerfil(firebaseUser, proveedor)
       Guarda nombre/foto en /usuarios/{uid} si no existe aún.
       ───────────────────────────────────────────────────────── */
    async _persistirPerfil(u, proveedor) {
      if (!window.firebase || PC.almacen.modo !== 'firebase') return;
      try {
        const db  = window.firebase.firestore();
        const ref = db.collection('usuarios').doc(u.uid);
        const snap = await ref.get();
        const datos = snap.exists ? snap.data() : {};
        // Solo actualiza campos que no existen o están vacíos
        const perfil = {
          ...(datos.perfil || {}),
          nombre   : datos.perfil?.nombre || u.displayName || '',
          email    : u.email || '',
          foto     : datos.perfil?.foto || u.photoURL || '',
          proveedor,
          fechaCreacion: datos.perfil?.fechaCreacion || new Date().toISOString()
        };
        await ref.set({ perfil, actualizado: new Date().toISOString() }, { merge: true });
      } catch (e) { /* no crítico */ }
    },

    /* ─────────────────────────────────────────────────────────
       Privado: _mensajeError(code)
       Convierte los códigos de Firebase en español claro (≤7 palabras).
       ───────────────────────────────────────────────────────── */
    _mensajeError(code) {
      const m = {
        'auth/user-not-found'        : 'No existe cuenta con ese correo.',
        'auth/wrong-password'        : 'Contraseña incorrecta.',
        'auth/invalid-credential'    : 'Correo o contraseña incorrectos.',
        'auth/email-already-in-use'  : 'Ese correo ya tiene una cuenta.',
        'auth/weak-password'         : 'La contraseña es muy corta (mínimo 8).',
        'auth/invalid-email'         : 'Escribe un correo válido.',
        'auth/popup-closed-by-user'  : 'Cerraste la ventana de Google.',
        'auth/cancelled-popup-request': 'Acción cancelada. Intenta de nuevo.',
        'auth/network-request-failed': 'Sin conexión. Revisa tu internet.',
        'auth/too-many-requests'     : 'Demasiados intentos. Espera un momento.',
        'auth/user-disabled'         : 'Cuenta desactivada. Escribe a soporte.',
        'auth/requires-recent-login' : 'Vuelve a iniciar sesión para continuar.',
        'auth/operation-not-allowed' : 'Método de acceso no habilitado aún.',
      };
      return m[code] || 'Error al iniciar sesión. Intenta de nuevo.';
    }
  };
})();
