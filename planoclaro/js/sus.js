/* sus.js — Encuesta SUS (System Usability Scale) y Reseñas de producto.
   Conecta la medición cuantitativa de usabilidad (0-100) con la reseña cualitativa
   y calificación en estrellas del servicio que el usuario eligió o comparó.
   Requisito para publicar reseña: autenticación ÚNICAMENTE con cuenta de Google. */
PC.sus = {
  ITEMS: [
    'Creo que me gustaría usar PlanoClaro con frecuencia.',
    'Me pareció más complicado de lo necesario.',
    'Me pareció fácil de usar.',
    'Creo que necesitaría ayuda de otra persona para usarlo.',
    'Las partes de la página funcionan bien juntas.',
    'Encontré cosas que no cuadraban entre sí.',
    'Creo que la mayoría de personas aprendería a usarlo muy rápido.',
    'Me pareció incómodo de usar.',
    'Me sentí seguro(a) usándolo.',
    'Tuve que aprender muchas cosas antes de poder usarlo.'
  ],

  planElegido: null,
  calificacionNueva: 5,
  sentimientoNuevo: 'positivo',

  puntaje(r) {
    let s = 0;
    r.forEach((v, i) => { s += i % 2 === 0 ? v - 1 : 5 - v; });
    return s * 2.5;
  },

  interpretar(p) {
    return p >= 80.3
      ? 'Excelente usabilidad'
      : p >= 68
        ? 'Buena usabilidad (sobre el promedio de 68)'
        : p >= 51
          ? 'Aceptable, con aspectos por pulir'
          : 'Dificultad detectada: continuaremos mejorando';
  },

  render() {
    const h = PC.h, cont = document.getElementById('encuesta');
    if (!cont) return;

    const usuario = PC.cuenta ? PC.cuenta.usuario : null;
    const planInfo = this.planElegido;
    const planNombreDefault = planInfo ? `${planInfo.operador} ${planInfo.nombre}` : '';

    const etiquetas = [
      'Totalmente en desacuerdo',
      'En desacuerdo',
      'Ni de acuerdo ni en desacuerdo',
      'De acuerdo',
      'Totalmente de acuerdo'
    ];

    // 1. Preguntas SUS
    const itemsSUS = this.ITEMS.map((t, i) => h('fieldset', { class: 'panel sus-item', id: 'sus-' + i },
      h('legend', null, h('span', { class: 'pregunta__num' }, `${i + 1} de 10`), h('span', null, t)),
      h('div', { class: 'escala' }, etiquetas.map((e, v) => h('label', { class: 'escala__op' },
        h('input', { type: 'radio', name: 'sus' + i, value: String(v + 1) }),
        h('span', { class: 'escala__n' }, String(v + 1)),
        h('span', { class: 'escala__t' }, e)
      ))),
      h('p', { class: 'campo__error', id: 'sus-err-' + i, hidden: true })
    ));

    // 2. Apartado integrado de reseña y calificación del producto/servicio
    const inputTitulo = h('input', {
      type: 'text',
      id: 'sus-resena-titulo',
      class: 'campo-texto',
      maxlength: 80,
      placeholder: 'Ej. Gran servicio, me ahorré cobros ocultos de instalación'
    });

    const areaComentario = h('textarea', {
      id: 'sus-resena-comentario',
      class: 'campo-area',
      rows: 3,
      maxlength: 500,
      placeholder: 'Cuéntanos qué te pareció la comparación, por qué elegiste este plan de internet o celular y cómo fue tu experiencia...'
    });

    const inputPlan = h('input', {
      type: 'text',
      id: 'sus-resena-plan',
      class: 'campo-texto',
      maxlength: 70,
      value: planNombreDefault,
      placeholder: 'Ej. WOW Fibra 300 Mbps o Claro Max 69.90 (opcional)'
    });

    // Selector interactivo de estrellas para la reseña
    const btnEstrellas = [];
    for (let i = 1; i <= 5; i++) {
      const btn = h('button', {
        type: 'button',
        class: `btn-estrella-voto ${i <= this.calificacionNueva ? 'btn-estrella-voto--activa' : ''}`,
        'aria-label': `${i} de 5 estrellas`
      }, PC.icono('estrella'));

      btn.addEventListener('click', () => {
        this.calificacionNueva = i;
        btnEstrellas.forEach((b, idx) => {
          b.classList.toggle('btn-estrella-voto--activa', idx + 1 <= i);
        });
        PC.sonido.tocar('elegir');
      });
      btnEstrellas.push(btn);
    }

    // Selector de recomendación (positiva/crítica)
    const radioPos = h('input', {
      type: 'radio',
      name: 'sus-sentimiento',
      value: 'positivo',
      checked: this.sentimientoNuevo === 'positivo'
    });
    const radioCrit = h('input', {
      type: 'radio',
      name: 'sus-sentimiento',
      value: 'critico',
      checked: this.sentimientoNuevo === 'critico'
    });
    [radioPos, radioCrit].forEach(r => {
      r.addEventListener('change', () => { if (r.checked) this.sentimientoNuevo = r.value; });
    });

    // Bloque de autenticación Google para la reseña
    let authBloque;
    if (usuario) {
      authBloque = h('div', { class: 'sus-google-auth sus-google-auth--ok' },
        h('span', { class: 'sello-google-verif' },
          PC.cuenta._logoGoogleSVG ? PC.cuenta._logoGoogleSVG() : PC.icono('verificado'),
          h('strong', null, 'Conectado con Google: ')
        ),
        h('span', null, ` ${usuario.nombre || 'Usuario'} (${PC.resenas.enmascararCorreo(usuario.correo)})`)
      );
    } else {
      const btnAuthG = h('button', {
        type: 'button',
        class: 'boton boton--google boton--chico',
        id: 'btn-google-sus'
      },
        PC.cuenta._logoGoogleSVG ? PC.cuenta._logoGoogleSVG() : PC.icono('verificado'),
        'Acceder con Google para publicar'
      );
      btnAuthG.addEventListener('click', async () => {
        try {
          await PC.login.iniciarGoogle();
          this.render();
        } catch (e) {
          PC.avisar(e.message);
        }
      });

      authBloque = h('div', { class: 'sus-google-auth' },
        h('p', { class: 'sus-google-auth__txt' },
          'Para publicar tu reseña en la página de inicio, debes acceder con tu cuenta de Google. ' +
          'No se solicitan contraseñas ni registros en PlanoClaro.'
        ),
        btnAuthG
      );
    }

    const panelResena = h('fieldset', { class: 'panel sus-panel-resena' },
      h('legend', null, h('span', null, 'Tu calificación y reseña del plan elegido (opcional)')),
      h('p', { class: 'intro-corta' },
        planInfo
          ? `Elegiste el plan ${planInfo.operador} ${planInfo.nombre}. Califica tu decisión:`
          : 'Si ya elegiste o comparaste un servicio de internet o celular, comparte tu opinión:'
      ),
      authBloque,
      h('div', { class: 'grupo-campo' },
        h('label', null, 'Calificación en estrellas:'),
        h('div', { class: 'selector-estrellas' }, ...btnEstrellas)
      ),
      h('div', { class: 'grupo-campo' },
        h('label', null, '¿Recomiendas este servicio?'),
        h('div', { class: 'opciones-sentimiento' },
          h('label', { class: 'opcion-sentimiento' }, radioPos, h('span', { class: 'sentimiento-etq sentimiento-etq--pos' }, '👍 Positiva (Lo recomiendo)')),
          h('label', { class: 'opcion-sentimiento' }, radioCrit, h('span', { class: 'sentimiento-etq sentimiento-etq--crit' }, '👎 Crítica (A mejorar)'))
        )
      ),
      h('div', { class: 'fila-dos-campos' },
        h('div', { class: 'grupo-campo' },
          h('label', { for: 'sus-resena-plan' }, 'Plan que elegiste o comparaste:'),
          inputPlan
        ),
        h('div', { class: 'grupo-campo' },
          h('label', { for: 'sus-resena-titulo' }, 'Título de tu reseña:'),
          inputTitulo
        )
      ),
      h('div', { class: 'grupo-campo' },
        h('label', { for: 'sus-resena-comentario' }, 'Comentario u opinión:'),
        areaComentario
      )
    );

    const erroresBox = h('div', { class: 'errores', id: 'sus-errores', role: 'alert', hidden: true, tabindex: '-1' });

    const btnEnviar = h('button', { type: 'submit', class: 'boton boton--primario', id: 'btn-enviar-sus' }, 'Enviar satisfacción y reseña');

    const form = h('form', { class: 'formulario sus-formulario', novalidate: true },
      ...itemsSUS,
      panelResena,
      erroresBox,
      h('div', { class: 'acciones' }, btnEnviar)
    );

    form.addEventListener('change', e => {
      const m = /^sus(\d)$/.exec(e.target.name);
      if (m) {
        const errEl = form.querySelector('#sus-err-' + m[1]);
        if (errEl) errEl.hidden = true;
        PC.sonido.tocar('elegir');
      }
    });

    form.addEventListener('submit', async ev => {
      ev.preventDefault();
      erroresBox.hidden = true;

      // 1. Validar las 10 preguntas SUS
      const r = this.ITEMS.map((_, i) => {
        const x = form.querySelector(`input[name="sus${i}"]:checked`);
        const v = x ? Number(x.value) : 0;
        return v >= 1 && v <= 5 ? v : 0;
      });

      const faltan = r.map((v, i) => v ? null : i).filter(v => v !== null);
      if (faltan.length) {
        faltan.forEach(i => {
          const p = form.querySelector('#sus-err-' + i);
          if (p) { p.textContent = 'Elige un número del 1 al 5.'; p.hidden = false; }
        });
        erroresBox.textContent = `Faltan responder ${faltan.length} frase(s) de satisfacción: ${faltan.map(i => i + 1).join(', ')}.`;
        erroresBox.hidden = false;
        erroresBox.focus();
        PC.sonido.tocar('error');
        return;
      }

      // 2. Calcular puntaje SUS
      const p = this.puntaje(r);
      const listaSUS = PC.LS.leer('sus', []);
      listaSUS.push({ ts: Date.now(), puntaje: p, respuestas: r, variante: PC.metricas ? PC.metricas.variante() : 'A' });
      PC.LS.escribir('sus', listaSUS.slice(-500));

      // 3. Procesar reseña si fue escrita
      const com = areaComentario.value.trim();
      const tit = inputTitulo.value.trim();
      const planTxt = inputPlan.value.trim();
      let resenaGuardada = false;

      if (com.length > 0) {
        const usrActual = PC.cuenta ? PC.cuenta.usuario : null;
        if (!usrActual) {
          erroresBox.textContent = 'Para publicar tu reseña escrita, inicia sesión con tu cuenta de Google arriba.';
          erroresBox.hidden = false;
          erroresBox.focus();
          PC.sonido.tocar('error');
          return;
        }

        try {
          await PC.almacen.guardarResena({
            uid: usrActual.uid || usrActual.correo,
            autor: usrActual.nombre || usrActual.correo.split('@')[0],
            correo: usrActual.correo,
            foto: usrActual.foto || '',
            calificacion: Number(this.calificacionNueva) || 5,
            sentimiento: this.sentimientoNuevo,
            planElegido: planTxt || (this.planElegido ? `${this.planElegido.operador} ${this.planElegido.nombre}` : 'Internet/Celular'),
            titulo: tit,
            comentario: com,
            susScore: p,
            verificado: true
          });
          resenaGuardada = true;
          this.planElegido = null;
          if (PC.resenas && PC.resenas.renderFlotantes) {
            PC.resenas.renderFlotantes();
          }
        } catch (e) {
          // Si falla, se informa
          PC.avisar('No se pudo guardar la reseña: ' + e.message);
        }
      }

      PC.sonido.tocar('ok');

      // 4. Pantalla de resultado final
      const res = h('div', { class: 'panel resultado-sus', tabindex: '-1' },
        h('h2', null, '¡Muchas gracias por tu evaluación!'),
        h('p', { class: 'kpi__v' }, `${p.toFixed(1)} / 100`),
        h('p', { class: 'resultado-sus__interpretacion' }, this.interpretar(p) + '.'),
        resenaGuardada
          ? h('div', { class: 'alerta alerta--ok' },
              h('p', null, '✓ Tu reseña ha sido registrada y ahora rota de forma flotante en la página de inicio.')
            )
          : null,
        h('div', { class: 'acciones resultado-sus__acciones' },
          h('button', { type: 'button', class: 'boton boton--primario', dataset: { ir: 'inicio' } }, 'Ir a la página principal'),
          h('button', { type: 'button', class: 'boton boton--fantasma', dataset: { ir: 'metricas' } }, 'Ver métricas de experiencia')
        )
      );

      PC.vaciar(cont, res);
      res.focus();
    });

    PC.vaciar(cont, form);
  }
};
