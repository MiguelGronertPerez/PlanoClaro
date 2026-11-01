/* Cálculo de costos reales: promoción vs. precio regular y proyección a 12 meses. */
PC.costos = {
  mesesPromoEnAnio(p) { return p.precioPromo != null ? Math.min(p.mesesPromo || 0, 12) : 0; },
  anual(p) {
    const mp = this.mesesPromoEnAnio(p);
    const servicio = mp * (p.precioPromo || 0) + (12 - mp) * p.precioRegular;
    const unicos = (typeof p.costoInstalacion === 'number' ? p.costoInstalacion : 0) + (typeof p.costoEquipo === 'number' ? p.costoEquipo : 0);
    return Math.round((servicio + unicos) * 100) / 100;
  },
  promedioMensual(p) { return Math.round(this.anual(p) / 12 * 100) / 100; },
  detalle(p) {
    const mp = this.mesesPromoEnAnio(p);
    const partes = [];
    if (mp > 0) partes.push(`${mp} ${mp === 1 ? 'mes' : 'meses'} × ${PC.util.soles(p.precioPromo)}`);
    if (12 - mp > 0) partes.push(`${12 - mp} meses × ${PC.util.soles(p.precioRegular)}`);
    if (typeof p.costoInstalacion === 'number' && p.costoInstalacion > 0) partes.push(`instalación ${PC.util.soles(p.costoInstalacion)}`);
    return partes.join(' + ');
  }
};
