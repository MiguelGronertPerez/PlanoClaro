/* Héroe 3D con Three.js (r159, vendorizado en vendor/three, funciona con file://).
   Idea: hilos de fibra óptica en grises que convergen; pulsos de luz viajan por ellos (los datos).
   - Parallax de cámara con resorte (interrumpible) según el puntero; nada en táctil.
   - Se pausa fuera de pantalla, con la pestaña oculta y fuera de la vista de inicio.
   - prefers-reduced-motion: se dibuja un solo cuadro estático.
   - Sin WebGL o sin Three: el lienzo se oculta y queda el fondo plano (el sitio funciona igual). */
PC.fibra3d = {
  iniciar() {
    const lienzo = document.getElementById('fibra');
    const T = window.THREE;
    if (!lienzo || !T) { if (lienzo) lienzo.hidden = true; return; }
    let rend;
    try { rend = new T.WebGLRenderer({ canvas: lienzo, antialias: true, alpha: true, powerPreference: 'low-power' }); }
    catch (e) { lienzo.hidden = true; return; }
    rend.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const escena = new T.Scene();
    const cam = new T.PerspectiveCamera(38, 1, 0.1, 100); cam.position.set(0, 0, 14);
    const grupo = new T.Group(); escena.add(grupo);
    const N = window.innerWidth < 700 ? 34 : 64, curvas = [], pulsos = [];
    const azar = (a, b) => a + Math.random() * (b - a);
    for (let i = 0; i < N; i++) {
      const y0 = azar(-6, 6), z0 = azar(-3, 2);
      const c = new T.CatmullRomCurve3([new T.Vector3(-13, y0, z0), new T.Vector3(-5, y0 * 0.55, z0 * 0.6), new T.Vector3(1.5, y0 * 0.12 + azar(-0.3, 0.3), azar(-0.4, 0.4)), new T.Vector3(9, azar(-0.35, 0.35) + 0.4, azar(-0.2, 0.2))]);
      curvas.push(c);
      const g = new T.BufferGeometry().setFromPoints(c.getPoints(80));
      const gris = 0.45 + Math.random() * 0.35;
      grupo.add(new T.Line(g, new T.LineBasicMaterial({ color: new T.Color(gris, gris, gris), transparent: true, opacity: 0.38 })));
    }
    const geoP = new T.SphereGeometry(0.07, 10, 10);
    for (let i = 0; i < Math.round(N * 0.6); i++) {
      const m = new T.Mesh(geoP, new T.MeshBasicMaterial({ color: 0x111111 }));
      m.userData = { c: curvas[i % curvas.length], t: Math.random(), v: azar(0.05, 0.12) };
      grupo.add(m); pulsos.push(m);
    }
    // Núcleo: anillo de vidrio (solo líneas de borde) donde convergen los hilos.
    const aro = new T.LineSegments(new T.EdgesGeometry(new T.TorusGeometry(1.25, 0.38, 10, 40)), new T.LineBasicMaterial({ color: 0x222222, transparent: true, opacity: 0.32 }));
    aro.position.set(8.2, 0.4, 0); aro.rotation.y = Math.PI / 2.4; grupo.add(aro);

    const ajustar = () => {
      const w = lienzo.clientWidth || window.innerWidth, h = lienzo.clientHeight || window.innerHeight;
      rend.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
      grupo.position.x = w < 960 ? -2.5 : 0; grupo.scale.setScalar(w < 700 ? 0.75 : 1);
    };
    ajustar(); window.addEventListener('resize', ajustar);
    const dibujar = () => rend.render(escena, cam);
    const colocar = dt => pulsos.forEach(p => { const u = p.userData; u.t = (u.t + u.v * dt) % 1; p.position.copy(u.c.getPointAt(u.t)); });
    colocar(0);
    if (PC.mov.reducido()) { dibujar(); return; }

    const res = PC.mov.resorte((x, y) => { cam.position.x = y * 0.6; cam.position.y = -x * 0.4; cam.lookAt(0, 0, 0); });
    if (PC.mov.finoHover()) window.addEventListener('pointermove', e => res.ir((e.clientY / window.innerHeight - 0.5) * 2, (e.clientX / window.innerWidth - 0.5) * 2), { passive: true });

    let visible = true, raf = 0, t0 = performance.now();
    const activo = () => visible && !document.hidden && document.body.dataset.vista === 'inicio';
    const bucle = ahora => {
      const dt = Math.min(0.05, (ahora - t0) / 1000); t0 = ahora;
      colocar(dt); aro.rotation.x += dt * 0.15; dibujar();
      raf = activo() ? requestAnimationFrame(bucle) : 0;
    };
    const reanudar = () => { if (!raf && activo()) { t0 = performance.now(); raf = requestAnimationFrame(bucle); } };
    new IntersectionObserver(e => { visible = e[0].isIntersecting; reanudar(); }).observe(lienzo);
    document.addEventListener('visibilitychange', reanudar);
    PC.fibra3d.reanudar = reanudar;
    reanudar();
  }
};
