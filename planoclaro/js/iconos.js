/* Iconos propios en SVG (trazo 1.7, esquinas redondeadas). Se crean con createElementNS: sin innerHTML. */
PC.ICONOS = {
  celular: ['M8 2.8h8a1.8 1.8 0 0 1 1.8 1.8v14.8a1.8 1.8 0 0 1-1.8 1.8H8a1.8 1.8 0 0 1-1.8-1.8V4.6A1.8 1.8 0 0 1 8 2.8z', 'M10.5 18h3'],
  casa: ['M3.5 11 12 4l8.5 7', 'M6 9.6V20h12V9.6', 'M9.6 15.4a3.4 3.4 0 0 1 4.8 0', 'M11.1 17.6a1.3 1.3 0 0 1 1.8 0'],
  flecha: ['M5 12h13', 'M13 7l5 5-5 5'],
  cerrar: ['M6 6l12 12', 'M18 6 6 18'],
  calle: ['M4 20 9 4', 'M20 20 15 4', 'M12 6v2', 'M12 11v2', 'M12 16v2'],
  video: ['M4 6.5h11v11H4z', 'M15 10.5l5-3v9l-5-3'],
  compartir: ['M12 15V4', 'M8 8l4-4 4 4', 'M5 13v6h14v-6'],
  mundo: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z', 'M3 12h18', 'M12 3c2.6 2.6 2.6 15.4 0 18', 'M12 3c-2.6 2.6-2.6 15.4 0 18'],
  billetera: ['M4 7h14a2 2 0 0 1 2 2v9H6a2 2 0 0 1-2-2z', 'M4 7l11-3v3', 'M16 13h2'],
  personas: ['M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6', 'M16 5.3a3 3 0 0 1 0 5.4', 'M17.5 14.6c1.6.6 2.6 2 3 4.4'],
  maletin: ['M4 8h16v11H4z', 'M9 8V5.5h6V8', 'M4 13h16'],
  juego: ['M7 9h10a4 4 0 0 1 0 8c-1.5 0-2.3-1-3-2h-4c-.7 1-1.5 2-3 2a4 4 0 0 1 0-8z', 'M8 11.5v3', 'M6.5 13h3', 'M15.5 12.5h.01', 'M17 14h.01'],
  edificio: ['M5 20V5h9v15', 'M14 10h5v10', 'M8 8h3', 'M8 11h3', 'M8 14h3', 'M3 20h18'],
  ubicacion: ['M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z', 'M12 12.3a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6z'],
  ok: ['M5 12.5l4.5 4.5L19 7.5'],
  no: ['M6 6l12 12', 'M18 6 6 18'],
  estrella: ['M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z'],
  mas: ['M12 5v14', 'M5 12h14'],
  calendario: ['M4.5 6h15v14h-15z', 'M4.5 10h15', 'M8.5 3.5v4', 'M15.5 3.5v4'],
  externo: ['M14 4h6v6', 'M20 4l-9 9', 'M18 14v6H4V6h6'],
  señal: ['M5 19v-3', 'M10 19v-7', 'M15 19V8', 'M20 19V4'],
  musica: ['M9 18V5l11-2v13', 'M9 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z', 'M20 16a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z'],
  libro: ['M4 5.5C6.5 4 9.5 4 12 5.5 14.5 4 17.5 4 20 5.5V19c-2.5-1.5-5.5-1.5-8 0-2.5-1.5-5.5-1.5-8 0z', 'M12 5.5V19'],
  infinito: ['M7 9c-4 0-4 6 0 6 3 0 7-6 10-6 4 0 4 6 0 6-3 0-7-6-10-6z'],
  chat: ['M4 5h16v11H9l-5 4z'],
  calculadora: ['M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'M8 8h8', 'M8 12h.01', 'M12 12h.01', 'M16 12h.01', 'M8 16h.01', 'M12 16h.01', 'M16 16h.01'],
  documento: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8', 'M10 9H8'],
  voz: ['M11 5L6 9H2v6h4l5 4V5z', 'M15.54 8.46a5 5 0 0 1 0 7.07', 'M19.07 4.93a10 10 0 0 1 0 14.14'],
  fuente: ['M5 19L11 4h2l6 15', 'M7.5 14h9'],
  alerta: ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z', 'M12 9v4', 'M12 17h.01'],
  copiar: ['M8 4h11a2 2 0 0 1 2 2v11', 'M5 8h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z'],
  pulgar: ['M7 10v11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3z', 'M7 10l5-8a2 2 0 0 1 2 2v3h6a2 2 0 0 1 2 2v2.5a2 2 0 0 1-.5 1.4L18 21H7'],
  pulgarAbajo: ['M7 14V3H4a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3z', 'M7 14l5 8a2 2 0 0 0 2-2v-3h6a2 2 0 0 0 2-2v-2.5a2 2 0 0 0-.5-1.4L18 3H7'],
  verificado: ['M12 2l2.4 2.1 3.2-.5 1.2 3 2.8 1.6-.7 3.1 1.7 2.7-2.1 2.4.5 3.2-3 1.2-1.6 2.8-3.1-.7-2.7 1.7-2.4-2.1-3.2.5-1.2-3-2.8-1.6.7-3.1L2.8 12l2.1-2.4-.5-3.2 3-1.2L9 2.4l3.1.7z', 'M9 12l2 2 4-4']
};
PC.icono = function (nombre, clase) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
  svg.setAttribute('class', 'ico' + (clase ? ' ' + clase : ''));
  (PC.ICONOS[nombre] || PC.ICONOS.ok).forEach(d => { const p = document.createElementNS(ns, 'path'); p.setAttribute('d', d); svg.appendChild(p); });
  return svg;
};
PC.hidratarIconos = function (raiz) {
  (raiz || document).querySelectorAll('[data-icono]:empty').forEach(el => el.appendChild(PC.icono(el.dataset.icono)));
};
