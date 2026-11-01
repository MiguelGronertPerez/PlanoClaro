/* resenas.js — Exhibición de reseñas flotantes y rotatorias en la página principal.
   Las reseñas son opiniones reales de usuarios que iniciaron sesión con Google y evaluaron
   el servicio tras comparar o completar la encuesta SUS.
   Sin datos inventados ni de prueba. Seguro (PC.h()), accesible y sin innerHTML con datos de usuario. */
(function () {
  'use strict';

  function formatearFecha(iso) {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return String(iso);
      const dia = String(d.getDate()).padStart(2, '0');
      const mes = String(d.getMonth() + 1).padStart(2, '0');
      const anio = d.getFullYear();
      return `${dia}/${mes}/${anio}`;
    } catch (e) {
      return String(iso);
    }
  }

  function enmascararCorreo(correo) {
    if (!correo || typeof correo !== 'string') return '';
    const partes = correo.split('@');
    if (partes.length !== 2) return correo;
    const nombre = partes[0];
    const dom = partes[1];
    const visible = nombre.length > 3 ? nombre.slice(0, 3) + '***' : nombre.slice(0, 1) + '***';
    return `${visible}@${dom}`;
  }

  function renderEstrellas(n, tamanoClase) {
    const h = PC.h;
    const estrellas = [];
    const val = Math.max(1, Math.min(5, Math.round(Number(n) || 5)));
    for (let i = 1; i <= 5; i++) {
      estrellas.push(h('span', {
        class: `estrella-svg ${i <= val ? 'estrella-svg--llena' : 'estrella-svg--vacia'} ${tamanoClase || ''}`,
        'aria-hidden': 'true'
      }, PC.icono('estrella')));
    }
    return h('div', { class: 'estrellas-grupo', 'aria-label': `${val} de 5 estrellas` }, ...estrellas);
  }

  PC.resenas = {
    renderEstrellas,
    enmascararCorreo,
    formatearFecha,

    /* ─────────────────────────────────────────────────────────
       renderFlotantes()
       Pinta las tarjetas de reseñas flotantes en la página de inicio.
       Cada tarjeta rota e interactúa en 3D con el cursor / scroll.
       ───────────────────────────────────────────────────────── */
    async renderFlotantes() {
      const cont = document.getElementById('resenas-flotantes-contenedor');
      if (!cont) return;

      const h = PC.h;
      await PC.almacenListo;
      const resenas = await PC.almacen.listarResenas();

      if (!resenas || !resenas.length) {
        // Estado vacío: Sin datos de prueba falsos, invitación honesta y elegante
        const tarjetaVacia = h('div', { class: 'resena-flotante resena-flotante--vacia' },
          h('div', { class: 'resena-flotante__cabeza' },
            h('div', { class: 'resena-flotante__icono-vacio', 'aria-hidden': 'true' }, PC.icono('estrella')),
            h('div', null,
              h('h3', { class: 'resena-flotante__titulo-vacio' }, 'Sé el primero en dejar una reseña'),
              h('p', { class: 'resena-flotante__correo' }, 'Acceso verificado únicamente con Google')
            )
          ),
          h('p', { class: 'resena-flotante__comentario' },
            'Aún no hay reseñas registradas por usuarios. Compara tus opciones de internet o celular ' +
            'en PlanoClaro y comparte tu experiencia y calificación.'
          ),
          h('div', { class: 'resena-flotante__pie' },
            h('button', {
              type: 'button',
              class: 'boton boton--primario boton--chico',
              dataset: { ir: 'encuesta' }
            }, 'Evaluar satisfacción y opinar')
          )
        );
        PC.vaciar(cont, tarjetaVacia);
        return;
      }

      // Renderizar las reseñas con ángulos de rotación alternados
      const angulos = [-2.2, 1.8, -1.4, 2.4, -1.9, 1.6];
      const retrasos = ['0s', '-1.5s', '-3s', '-4.2s', '-2s', '-3.6s'];

      const tarjetas = resenas.map((r, i) => {
        const ang = angulos[i % angulos.length];
        const ret = retrasos[i % retrasos.length];
        const cal = Math.max(1, Math.min(5, Math.round(Number(r.calificacion) || 5)));
        const esPositiva = cal >= 4 || r.sentimiento === 'positivo';
        const inicial = (r.autor || 'U').charAt(0).toUpperCase();

        const btnUtil = h('button', {
          type: 'button',
          class: 'btn-util',
          dataset: { idResena: r.id },
          'aria-label': `Marcar como útil. ${r.utiles || 0} personas lo encontraron útil.`
        },
          PC.icono('pulgar'),
          h('span', null, 'Útil'),
          h('span', { class: 'util-contador' }, String(r.utiles || 0))
        );

        btnUtil.addEventListener('click', async () => {
          btnUtil.disabled = true;
          try {
            const nuevo = await PC.almacen.votarUtilResena(r.id);
            r.utiles = nuevo;
            const cnt = btnUtil.querySelector('.util-contador');
            if (cnt) cnt.textContent = String(nuevo);
            PC.sonido.tocar('ok');
          } catch (e) { /* silencioso */ }
        });

        const tarjeta = h('article', {
          class: 'resena-flotante inclinable',
          dataset: { id: r.id }
        },
          h('div', { class: 'resena-flotante__cabeza' },
            h('div', { class: 'resena-flotante__autor-wrap' },
              r.foto
                ? h('img', { src: r.foto, alt: '', class: 'resena-flotante__avatar', width: 44, height: 44, referrerpolicy: 'no-referrer' })
                : h('div', { class: 'resena-flotante__avatar-inicial', 'aria-hidden': 'true' }, inicial),
              h('div', null,
                h('div', { class: 'resena-flotante__nombre-fila' },
                  h('strong', { class: 'resena-flotante__nombre' }, r.autor || 'Usuario Google'),
                  h('span', { class: 'sello-google-verif', title: 'Usuario verificado con cuenta de Google' },
                    PC.cuenta._logoGoogleSVG ? PC.cuenta._logoGoogleSVG() : PC.icono('verificado'),
                    h('span', null, 'Google')
                  )
                ),
                h('p', { class: 'resena-flotante__correo' }, enmascararCorreo(r.correo))
              )
            ),
            h('div', { class: 'resena-flotante__meta' },
              renderEstrellas(cal),
              h('time', { class: 'resena-flotante__fecha' }, formatearFecha(r.fecha))
            )
          ),

          h('div', { class: 'resena-flotante__etiquetas' },
            h('span', {
              class: `badge-sentimiento ${esPositiva ? 'badge-sentimiento--positivo' : 'badge-sentimiento--critico'}`
            }, esPositiva ? '👍 Recomienda' : '👎 Crítica / A mejorar'),
            r.planElegido ? h('span', { class: 'badge-plan' }, r.planElegido) : null,
            typeof r.susScore === 'number' ? h('span', { class: 'badge-sus' }, `SUS: ${r.susScore.toFixed(0)}/100`) : null
          ),

          r.titulo ? h('h3', { class: 'resena-flotante__titulo' }, r.titulo) : null,
          h('p', { class: 'resena-flotante__comentario' }, r.comentario),

          h('div', { class: 'resena-flotante__pie' },
            h('span', { class: 'resena-flotante__nota' }, 'Opinión ciudadana verificada'),
            btnUtil
          )
        );

        tarjeta.style.setProperty('--rotacion', `${ang}deg`);
        tarjeta.style.setProperty('--retraso', ret);

        return tarjeta;
      });

      PC.vaciar(cont, ...tarjetas);
      if (PC.mov && PC.mov.inclinarTodo) PC.mov.inclinarTodo(cont);
    }
  };

  // Inicializar en carga y escuchar cambios de scroll suave
  window.addEventListener('load', () => {
    PC.resenas.renderFlotantes();
  });

  // Re-renderizar si el usuario inicia o cierra sesión con Google
  if (PC.login && PC.login.onCambioEstado) {
    PC.login.onCambioEstado(() => {
      PC.resenas.renderFlotantes();
    });
  }

})();
