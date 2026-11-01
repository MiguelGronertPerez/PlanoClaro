/* Motor de recomendación: estima la necesidad, descarta planes incompatibles y elige 3 perfiles. */
PC.motor = {
  opcion(tipo, idPregunta, valor) {
    const q = PC.PREGUNTAS[tipo].find(x => x.id === idPregunta);
    return q && q.opciones.find(o => o.v === valor);
  },

  necesidad(tipo, r) {
    if (tipo === 'movil') {
      let gb = ['fuera', 'video', 'compartir'].reduce((s, k) => s + (this.opcion(tipo, k, r[k]).gb || 0), 0);
      // Si midió su consumo real (guía "Mide tu consumo"), usamos el mayor entre la estimación y lo medido + 10% de holgura.
      const medido = Number(r.gbMedido);
      if (Number.isFinite(medido) && medido > 0 && medido <= 1000) gb = Math.max(gb, Math.ceil(medido * 1.1));
      return { gb, intl: r.intl === 'si', max: this.opcion(tipo, 'presupuesto', r.presupuesto).max };
    }
    const acts = r.actividades || [];
    const mbps = this.opcion(tipo, 'personas', r.personas).mbps + acts.reduce((s, a) => s + (this.opcion(tipo, 'actividades', a).mbps || 0), 0);
    return { mbps, acts, exigente: acts.some(a => a !== 'basico') || r.personas !== '1-2', casaGrande: r.vivienda === 'casa', zona: r.zona || 'lima', max: this.opcion(tipo, 'presupuesto', r.presupuesto).max };
  },

  capacidad(p) { return p.tipo === 'movil' ? (p.gbAltaVelocidad == null ? Infinity : p.gbAltaVelocidad) : p.velocidadMbps; },

  motivoDescarte(p, n, ignorarPresupuesto) {
    if (p.tipo === 'movil') {
      if (this.capacidad(p) < n.gb) return `Trae ${p.gbAltaVelocidad} GB y estimamos que necesitas unos ${n.gb} GB al mes.`;
      if (n.intl && !['si', 'roaming'].includes(p.internacional)) return 'No pudimos confirmar que incluya uso o llamadas fuera del Perú.';
    } else {
      if (n.zona === 'provincia' && p.cobertura === 'lima') return 'Este operador solo atiende Lima Metropolitana y Callao.';
      if (n.exigente && p.topeGB) return 'Internet inalámbrico con tope de datos: no alcanza para el uso de tu casa.';
      if (p.velocidadMbps < n.mbps) return `Ofrece ${p.velocidadMbps} Mbps y para tu casa recomendamos al menos ${n.mbps} Mbps.`;
    }
    if (!ignorarPresupuesto && p.precioRegular > n.max) return `Su precio regular (${PC.util.soles(p.precioRegular)}) supera tu presupuesto.`;
    return null;
  },

  recomendar(tipo, respuestas, catalogo) {
    const n = this.necesidad(tipo, respuestas);
    const planes = catalogo.filter(p => p.tipo === tipo);
    let presupuestoRelajado = false;
    let compatibles = planes.filter(p => !this.motivoDescarte(p, n, false));
    if (compatibles.length === 0) { // si nada entra en el presupuesto, lo relajamos y lo avisamos
      compatibles = planes.filter(p => !this.motivoDescarte(p, n, true));
      presupuestoRelajado = compatibles.length > 0;
    }
    const descartados = planes.filter(p => !compatibles.includes(p)).map(p => ({ plan: p, motivo: this.motivoDescarte(p, n, presupuestoRelajado) }));
    const anual = p => PC.costos.anual(p);
    const orden = [...compatibles].sort((a, b) => anual(a) - anual(b));
    const usados = new Set();
    const tomar = p => { if (p) usados.add(p.id); return p || null; };

    const economica = tomar(orden[0]);
    // Alto consumo: mayor capacidad (bonus a mesh si la casa es grande); empate -> menor costo anual
    const bonus = p => (tipo === 'hogar' && n.casaGrande && p.incluyeMesh ? 1 : 0);
    const alto = tomar([...orden].filter(p => !usados.has(p.id))
      .sort((a, b) => (this.capacidad(b) - this.capacidad(a)) || (bonus(b) - bonus(a)) || (anual(a) - anual(b)))[0]);
    // Equilibrada: entre el resto, el más barato que dé holgura (≥1.5× la necesidad); si no hay, el de costo intermedio
    const necesidadBase = tipo === 'movil' ? Math.max(n.gb, 5) : n.mbps;
    const resto = orden.filter(p => !usados.has(p.id));
    const equilibrada = tomar(resto.find(p => this.capacidad(p) >= necesidadBase * 1.5) || resto[Math.floor(resto.length / 2)]);

    const opciones = [
      { clave: 'economica', titulo: 'La más económica', plan: economica },
      { clave: 'equilibrada', titulo: 'La equilibrada', plan: equilibrada },
      { clave: 'alto', titulo: 'Para alto consumo', plan: alto }
    ].filter(o => o.plan);
    return { necesidad: n, opciones, descartados, presupuestoRelajado, totalCompatibles: compatibles.length };
  }
};
