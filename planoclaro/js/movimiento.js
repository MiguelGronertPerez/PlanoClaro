/* Movimiento compartido, siguiendo emil-design-eng:
   - Resortes que conservan velocidad (interrumpibles) para inclinación 3D y parallax.
   - Contadores de precios con ease-out (no ease-in), < 700 ms, saltados con movimiento reducido.
   - Revelado escalonado con IntersectionObserver (una sola vez por elemento).
   - Inclinación solo con puntero fino (hover real); nunca en táctil. */
PC.mov = {
  reducido: () => matchMedia('(prefers-reduced-motion: reduce)').matches,
  finoHover: () => matchMedia('(hover: hover) and (pointer: fine)').matches,
  /* Resorte 2D genérico: llama a aplicar(x, y) en cada frame hasta quedar quieto. */
  resorte(aplicar, { k = 170, c = 26 } = {}) {
    const e = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, raf: 0, t: 0 };
    const paso = ahora => {
      const dt = Math.min(0.032, (ahora - e.t) / 1000 || 0.016); e.t = ahora;
      e.vx += (k * (e.tx - e.x) - c * e.vx) * dt; e.x += e.vx * dt;
      e.vy += (k * (e.ty - e.y) - c * e.vy) * dt; e.y += e.vy * dt;
      aplicar(e.x, e.y);
      const quieto = Math.abs(e.tx - e.x) + Math.abs(e.ty - e.y) + Math.abs(e.vx) + Math.abs(e.vy) < 0.02;
      e.raf = quieto ? 0 : requestAnimationFrame(paso);
    };
    return { ir(tx, ty) { e.tx = tx; e.ty = ty; if (!e.raf) { e.t = performance.now(); e.raf = requestAnimationFrame(paso); } }, estado: e };
  },
  /* Inclinación 3D al pasar el puntero (tarjetas). Máx. 6° para que el texto siga legible. */
  inclinar(el, max = 6) {
    if (el.dataset.inclina || this.reducido() || !this.finoHover()) return;
    el.dataset.inclina = '1';
    const r = this.resorte((x, y) => {
      el.style.transform = `perspective(900px) rotateX(${x.toFixed(2)}deg) rotateY(${y.toFixed(2)}deg)`;
      el.style.setProperty('--luz-x', (50 + y * 6).toFixed(1) + '%'); el.style.setProperty('--luz-y', (50 - x * 6).toFixed(1) + '%');
    });
    el.addEventListener('pointermove', ev => {
      const b = el.getBoundingClientRect();
      r.ir(-((ev.clientY - b.top) / b.height - 0.5) * 2 * max, ((ev.clientX - b.left) / b.width - 0.5) * 2 * max);
    });
    el.addEventListener('pointerleave', () => r.ir(0, 0));
  },
  inclinarTodo(raiz) { (raiz || document).querySelectorAll('.inclinable').forEach(el => this.inclinar(el)); },
  /* Contador de soles: de 0 (o valor previo) al valor final. */
  contar(el, valor, formato, ms = 650) {
    if (this.reducido()) { el.textContent = formato(valor); return; }
    const ini = performance.now(), desde = valor * 0.55;
    const ease = t => 1 - Math.pow(1 - t, 4); // ease-out fuerte
    const paso = ahora => {
      const t = Math.min(1, (ahora - ini) / ms);
      el.textContent = formato(desde + (valor - desde) * ease(t));
      if (t < 1) requestAnimationFrame(paso); else el.textContent = formato(valor);
    };
    el.textContent = formato(desde); requestAnimationFrame(paso);
  },
  /* Revela .revelar al entrar en pantalla, con retardo escalonado por índice. */
  revelar(raiz) {
    const els = [...(raiz || document).querySelectorAll('.revelar:not(.revelado)')];
    if (!('IntersectionObserver' in window) || this.reducido()) { els.forEach(e => e.classList.add('revelado')); return; }
    const io = new IntersectionObserver(ents => ents.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('revelado'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach((e, i) => { e.style.setProperty('--i', i % 6); io.observe(e); });
  }
};
