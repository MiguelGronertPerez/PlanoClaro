/* Arranque (se ejecuta antes de pintar; archivo externo porque la CSP no permite scripts inline).
   - Marca que hay JS (la escena 3D se oculta hasta desplegarse).
   - Fuente: por http(s) se usa css/fuente.css (woff2 autoalojado, con preload);
     por file:// Chrome bloquea fuentes locales, así que se registra una copia embebida con FontFace. */
(function () {
  var d = document, raiz = d.documentElement;
  raiz.classList.add('js');
  try {
    var t = localStorage.getItem('pc_tema') || 'monocromo';
    raiz.dataset.tema = t;
  } catch (e) {}
  if (location.protocol === 'file:') {
    var s = d.createElement('script'); s.src = 'vendor/bricolage-grotesque/fuente-file.js'; d.head.appendChild(s);
  } else {
    var p = d.createElement('link'); p.rel = 'preload'; p.as = 'font'; p.type = 'font/woff2'; p.crossOrigin = 'anonymous';
    p.href = 'vendor/bricolage-grotesque/bricolage-grotesque-latin-standard-normal.woff2'; d.head.appendChild(p);
    var l = d.createElement('link'); l.rel = 'stylesheet'; l.href = 'css/fuente.css'; d.head.appendChild(l);
  }
})();
