/* Carga del catálogo: data/planes.json (http) o data/planes.js (file://). Si el panel admin guardó
   un catálogo editado, se usa ese (validado igual que el original). */
PC.datos = {
  async cargar() {
    let base = null;
    if (location.protocol !== 'file:') {
      try { const r = await fetch('data/planes.json', { cache: 'no-store' }); if (r.ok) base = this.validar(await r.json(), 'planes.json'); } catch (e) { /* respaldo */ }
    }
    if (!base && window.PLANOCLARO_DATA) base = this.validar(window.PLANOCLARO_DATA, 'planes.js');
    if (!base) throw new Error('No se pudo cargar el catálogo de planes.');
    base.original = base.planes;
    try {
      await PC.almacenListo;
      const adm = await PC.almacen.catalogoAdmin();
      if (adm && Array.isArray(adm.planes)) { const v = this.validar({ planes: adm.planes }, 'admin'); if (v.planes.length) { base.planes = v.planes; base.origen = 'admin'; } }
    } catch (e) { /* catálogo original */ }
    return base;
  },
  VERIF: ['oficial', 'secundaria', 'no_verificado', 'en_conflicto'],
  /* Validación de entrada: solo pasan planes con la forma esperada (tipos y rangos razonables). */
  errores(p) {
    const e = [], txt = (v, max = 200) => typeof v === 'string' && v.trim().length > 0 && v.length <= max;
    const num = (v, min, max) => typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max;
    if (!p || typeof p !== 'object') return ['Formato inválido'];
    if (!txt(p.id, 60) || !/^[a-z0-9-]+$/.test(p.id)) e.push('id: solo minúsculas, números y guiones');
    if (p.tipo !== 'movil' && p.tipo !== 'hogar') e.push('tipo: movil u hogar');
    if (!txt(p.operador, 40)) e.push('operador: obligatorio');
    if (!txt(p.nombre, 80)) e.push('nombre: obligatorio');
    if (!num(p.precioRegular, 1, 2000)) e.push('precio regular: entre S/ 1 y S/ 2000');
    if (p.precioPromo != null && !num(p.precioPromo, 0, 2000)) e.push('precio promo: número o vacío');
    if (p.precioPromo != null && !num(p.mesesPromo, 1, 24)) e.push('meses de promoción: 1 a 24');
    if (p.tipo === 'movil' && p.gbAltaVelocidad != null && !num(p.gbAltaVelocidad, 0, 5000)) e.push('GB: número o vacío (ilimitado)');
    if (p.tipo === 'hogar' && !num(p.velocidadMbps, 1, 100000)) e.push('velocidad Mbps: obligatoria');
    if (!Array.isArray(p.fuentes) || !p.fuentes.length || p.fuentes.some(u => !PC.util.urlSegura(u))) e.push('fuentes: al menos una URL https://');
    if (!p.verificacion || !this.VERIF.includes(p.verificacion.precio)) e.push('verificación del precio: oficial, secundaria, no_verificado o en_conflicto');
    return e;
  },
  validar(d, origen) {
    if (!d || !Array.isArray(d.planes)) throw new Error('Catálogo con formato inválido.');
    const planes = d.planes.filter(p => this.errores(p).length === 0);
    return { ...d, planes, origen };
  }
};
