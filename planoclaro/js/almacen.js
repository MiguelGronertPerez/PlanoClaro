/* Capa de datos. Interfaz única con dos adaptadores:
   - local (por defecto): localStorage, funciona sin conexión y con file://.
   - firebase (opcional): Auth + Firestore si js/firebase-config.js define PC_FIREBASE_CONFIG.
   Métricas y encuesta SUS siempre son locales (privacidad). */
(function () {
  const LS = {
    leer(k, def) { try { const v = localStorage.getItem('pc:' + k); return v == null ? def : JSON.parse(v); } catch (e) { return def; } },
    escribir(k, v) { try { localStorage.setItem('pc:' + k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    borrar(k) { try { localStorage.removeItem('pc:' + k); } catch (e) { /* sin almacenamiento */ } }
  };
  const correoValido = c => typeof c === 'string' && c.length <= 120 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c);
  const aHex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  async function derivar(pass, salHex) {
    if (!(window.crypto && crypto.subtle)) throw new Error('Tu navegador no permite cifrar la contraseña.');
    const sal = new Uint8Array(salHex.match(/../g).map(h => parseInt(h, 16)));
    const clave = await crypto.subtle.importKey('raw', new TextEncoder().encode(pass), 'PBKDF2', false, ['deriveBits']);
    return aHex(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: sal, iterations: 120000, hash: 'SHA-256' }, clave, 256));
  }
  function validarCredenciales(correo, pass) {
    if (!correoValido(correo)) throw new Error('Escribe un correo válido, por ejemplo nombre@correo.pe.');
    if (typeof pass !== 'string' || pass.length < 8 || pass.length > 128) throw new Error('La contraseña debe tener al menos 8 caracteres.');
  }

  const local = {
    modo: 'local',
    async usuario() { const c = LS.leer('sesion', null); const u = c && LS.leer('usuarios', {})[c]; return u ? { correo: c, nombre: u.nombre, foto: '', uid: c, proveedor: 'local' } : null; },
    async registrar(correo, pass, nombre) {
      correo = String(correo || '').trim().toLowerCase(); validarCredenciales(correo, pass);
      nombre = String(nombre || '').trim().slice(0, 60);
      const us = LS.leer('usuarios', {});
      if (us[correo]) throw new Error('Ya existe una cuenta con ese correo en este dispositivo.');
      const sal = aHex(crypto.getRandomValues(new Uint8Array(16)));
      us[correo] = { nombre, sal, hash: await derivar(pass, sal) };
      LS.escribir('usuarios', us); LS.escribir('sesion', correo);
      this._migrarInvitado(correo); return { correo, nombre };
    },
    async entrar(correo, pass) {
      correo = String(correo || '').trim().toLowerCase(); validarCredenciales(correo, pass);
      const u = LS.leer('usuarios', {})[correo];
      if (!u || (await derivar(pass, u.sal)) !== u.hash) throw new Error('Correo o contraseña incorrectos.');
      LS.escribir('sesion', correo); return { correo, nombre: u.nombre };
    },
    async salir() { LS.borrar('sesion'); },
    _clave() { return LS.leer('sesion', null) || 'invitado'; },
    _migrarInvitado(correo) {
      const f = LS.leer('fav:invitado', []); if (f.length) { LS.escribir('fav:' + correo, f); LS.borrar('fav:invitado'); }
      const p = LS.leer('perfil:invitado', null); if (p) { LS.escribir('perfil:' + correo, p); LS.borrar('perfil:invitado'); }
    },
    async leerPerfil() { return LS.leer('perfil:' + this._clave(), null); },
    async guardarPerfil(p) { LS.escribir('perfil:' + this._clave(), p); },
    async favoritos() { return LS.leer('fav:' + this._clave(), []); },
    async guardarFavoritos(ids) { LS.escribir('fav:' + this._clave(), ids.slice(0, 50)); },
    async catalogoAdmin() { return LS.leer('catalogo', null); },
    async guardarCatalogo(planes) { if (!LS.escribir('catalogo', { planes, actualizado: new Date().toISOString() })) throw new Error('No hay espacio para guardar.'); },
    async borrarCatalogo() { LS.borrar('catalogo'); },
    async listarResenas() {
      let r = LS.leer('resenas', []);
      if (!Array.isArray(r)) r = [];
      // Si existieran reseñas antiguas de prueba, limpiarlas
      if (r.some(x => String(x.id).match(/^res-[1-5]$/))) {
        r = r.filter(x => !String(x.id).match(/^res-[1-5]$/));
        LS.escribir('resenas', r);
      }
      return r;
    },
    async guardarResena(resena) {
      const lista = await this.listarResenas();
      const nueva = Object.assign({
        id: 'res-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
        fecha: new Date().toISOString(),
        utiles: 0
      }, resena);
      lista.unshift(nueva);
      LS.escribir('resenas', lista);
      return nueva;
    },
    async votarUtilResena(id) {
      const lista = await this.listarResenas();
      const r = lista.find(x => x.id === id);
      if (r) {
        r.utiles = (Number(r.utiles) || 0) + 1;
        LS.escribir('resenas', lista);
        return r.utiles;
      }
      return 0;
    }
  };

  /* Adaptador Firebase: mismo contrato. Solo se usa si hay configuración y protocolo http(s). */
  function firebaseAdaptador(fb) {
    const auth = fb.auth(), db = fb.firestore();
    const doc = () => auth.currentUser ? db.collection('usuarios').doc(auth.currentUser.uid) : null;
    const leerDoc = async () => { const d = doc(); if (!d) return {}; const s = await d.get(); return s.exists ? s.data() : {}; };
    return {
      modo: 'firebase',
      usuario: () => new Promise(res => { const off = auth.onAuthStateChanged(u => { off(); res(u ? { correo: u.email, nombre: u.displayName || '', foto: u.photoURL || '', uid: u.uid, proveedor: u.providerData && u.providerData[0] ? u.providerData[0].providerId.replace('.com', '') : 'email' } : null); }); }),
      async registrar(correo, pass, nombre) { validarCredenciales(correo, pass); const c = await auth.createUserWithEmailAndPassword(correo, pass); if (nombre) await c.user.updateProfile({ displayName: String(nombre).slice(0, 60) }); return { correo, nombre }; },
      async entrar(correo, pass) { validarCredenciales(correo, pass); const c = await auth.signInWithEmailAndPassword(correo, pass); return { correo: c.user.email, nombre: c.user.displayName || '' }; },
      async salir() { await auth.signOut(); },
      async leerPerfil() { return doc() ? (await leerDoc()).perfil || null : local.leerPerfil(); },
      async guardarPerfil(p) { return doc() ? doc().set({ perfil: p, actualizado: new Date().toISOString() }, { merge: true }) : local.guardarPerfil(p); },
      async favoritos() { return doc() ? (await leerDoc()).favoritos || [] : local.favoritos(); },
      async guardarFavoritos(ids) { return doc() ? doc().set({ favoritos: ids.slice(0, 50), actualizado: new Date().toISOString() }, { merge: true }) : local.guardarFavoritos(ids); },
      async catalogoAdmin() { try { const s = await db.collection('catalogo').doc('actual').get(); return s.exists ? s.data() : null; } catch (e) { return null; } },
      async guardarCatalogo(planes) { await db.collection('catalogo').doc('actual').set({ planes, actualizado: new Date().toISOString() }); },
      async borrarCatalogo() { await db.collection('catalogo').doc('actual').delete(); },
      async listarResenas() {
        try {
          const snap = await db.collection('resenas').orderBy('fecha', 'desc').limit(50).get();
          if (snap.empty) return local.listarResenas();
          return snap.docs.map(d => Object.assign({ id: d.id }, d.data()));
        } catch (e) {
          return local.listarResenas();
        }
      },
      async guardarResena(resena) {
        try {
          const docData = Object.assign({
            fecha: new Date().toISOString(),
            utiles: 0
          }, resena);
          const ref = await db.collection('resenas').add(docData);
          return Object.assign({ id: ref.id }, docData);
        } catch (e) {
          return local.guardarResena(resena);
        }
      },
      async votarUtilResena(id) {
        try {
          const ref = db.collection('resenas').doc(id);
          const snap = await ref.get();
          if (snap.exists) {
            const nuevosUtiles = (snap.data().utiles || 0) + 1;
            await ref.update({ utiles: nuevosUtiles });
            return nuevosUtiles;
          }
        } catch (e) {}
        return local.votarUtilResena(id);
      }
    };
  }
  function cargarScript(src) {
    return new Promise((ok, mal) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => mal(new Error('No se pudo cargar ' + src)); document.head.appendChild(s); });
  }
  PC.almacen = local;
  PC.LS = LS;
  PC.almacenListo = (async () => {
    const cfg = window.PC_FIREBASE_CONFIG;
    if (!cfg || location.protocol === 'file:') return PC.almacen;
    try {
      for (const f of ['firebase-app-compat.js', 'firebase-auth-compat.js', 'firebase-firestore-compat.js']) await cargarScript('vendor/firebase/' + f);
      window.firebase.initializeApp(cfg);
      PC.almacen = firebaseAdaptador(window.firebase);
    } catch (e) { PC.almacen = local; PC.almacenError = e.message; }
    return PC.almacen;
  })();
})();
