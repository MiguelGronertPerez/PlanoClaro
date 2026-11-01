/* Sonidos suaves generados con Web Audio (sin archivos). Silenciado por defecto; la elección se recuerda.
   El contexto de audio solo se crea tras un gesto del usuario (clic/tecla). El sonido nunca lleva
   información: todo lo que suena también se ve en pantalla. */
PC.sonido = {
  ctx: null,
  activo() { return PC.LS.leer('sonido', 'no') === 'si'; },
  alternar() { PC.LS.escribir('sonido', this.activo() ? 'no' : 'si'); this.pintar(); if (this.activo()) this.tocar('ok'); },
  pintar() {
    const b = document.getElementById('btn-sonido'); if (!b) return;
    const on = this.activo();
    b.setAttribute('aria-pressed', String(on));
    b.querySelector('.sonido__txt').textContent = on ? 'Sonido: sí' : 'Sonido: no';
  },
  tocar(tipo) {
    if (!this.activo() || PC.mov.reducido()) return;
    try {
      this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
      const c = this.ctx, t = c.currentTime;
      const notas = { elegir: [660], ok: [523.25, 783.99], error: [330, 262], paso: [587.33] }[tipo] || [600];
      notas.forEach((f, i) => {
        const o = c.createOscillator(), g = c.createGain();
        o.type = 'sine'; o.frequency.value = f;
        const t0 = t + i * 0.07;
        g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.05, t0 + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.16);
        o.connect(g).connect(c.destination); o.start(t0); o.stop(t0 + 0.18);
      });
    } catch (e) { /* sin audio */ }
  }
};
