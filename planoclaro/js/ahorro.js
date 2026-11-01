/* Calculadora de Ahorro Real: compara lo que pagas hoy en tu recibo frente a los planes de PlanoClaro.
   Detecta sobrecostos comunes (alquiler de routers amortizados, seguros no pedidos) y calcula el ahorro a 12 meses. */
PC.ahorro = {
  render(catalogo) {
    const raiz = document.getElementById('ahorro');
    if (!raiz) return;
    const h = PC.h;
    catalogo = Array.isArray(catalogo) ? catalogo : [];

    let estadoCalculo = {
      tipo: 'movil',
      operadorActual: 'Claro',
      montoMensual: 69.90,
      deco: false,
      router: false,
      seguro: false,
      extra: false,
      planId: null
    };

    // Preseleccionar el plan más equilibrado o económico
    const iniciales = catalogo.filter(p => p.tipo === estadoCalculo.tipo);
    if (iniciales.length) {
      estadoCalculo.planId = iniciales[0].id;
    }

    const contenedor = h('div', { class: 'ahorro-grid' });
    const panelForm = h('div', { class: 'panel ahorro-formulario' });
    const panelResultado = h('div', { class: 'panel ahorro-resultado' });

    function recalcular() {
      const planElegido = catalogo.find(p => p.id === estadoCalculo.planId) || catalogo.find(p => p.tipo === estadoCalculo.tipo);
      if (!planElegido) return;

      // Calcular montos actuales
      let adicionales = 0;
      if (estadoCalculo.deco) adicionales += 15.00;
      if (estadoCalculo.router) adicionales += 12.00;
      if (estadoCalculo.seguro) adicionales += 9.90;
      if (estadoCalculo.extra) adicionales += 15.00;

      const mensualActual = Math.max(0, estadoCalculo.montoMensual + adicionales);
      const anualActual = Math.round(mensualActual * 12 * 100) / 100;
      const anualPlano = PC.costos.anual(planElegido);
      const ahorroAnual = Math.round((anualActual - anualPlano) * 100) / 100;
      const pctAhorro = anualActual > 0 ? Math.round((ahorroAnual / anualActual) * 100) : 0;

      // Alertas regulatorias según OSIPTEL
      const alertas = [];
      if (estadoCalculo.router) {
        alertas.push({
          titulo: 'Alerta sobre alquiler de router',
          texto: 'Si tu contrato tiene más de 2 años, el router ya fue amortizado por la empresa. No deben seguir cobrándote alquiler mensual por un equipo cancelado.'
        });
      }
      if (estadoCalculo.seguro) {
        alertas.push({
          titulo: 'Alerta sobre seguros no contratados',
          texto: 'Por norma de OSIPTEL, tienes derecho a desafiliarte de inmediato de cualquier seguro o servicio adicional si no diste tu consentimiento expreso.'
        });
      }
      if (estadoCalculo.tipo === 'movil' && estadoCalculo.montoMensual > 75) {
        alertas.push({
          titulo: 'Tarifa mensual elevada',
          texto: 'En el mercado peruano actual hay planes móviles con 40 a 65 GB desde S/ 29.90 a S/ 39.90 con minutos y redes ilimitadas.'
        });
      }

      // Renderizar resultado visual
      PC.vaciar(panelResultado,
        h('h2', { class: 'ahorro-res__titulo' }, 'Tu balance a 12 meses'),
        h('div', { class: 'ahorro-cifras' },
          h('div', { class: 'ahorro-cifra' },
            h('span', { class: 'ahorro-cifra__etiqueta' }, 'Con tu operador actual:'),
            h('span', { class: 'ahorro-cifra__monto ahorro-cifra__monto--actual' }, PC.util.soles(anualActual)),
            h('span', { class: 'ahorro-cifra__detalle' }, `${PC.util.soles(mensualActual)} al mes × 12 meses`)
          ),
          h('div', { class: 'ahorro-cifra' },
            h('span', { class: 'ahorro-cifra__etiqueta' }, `Con ${planElegido.nombre} (${planElegido.operador}):`),
            h('span', { class: 'ahorro-cifra__monto ahorro-cifra__monto--plano' }, PC.util.soles(anualPlano)),
            h('span', { class: 'ahorro-cifra__detalle' }, PC.costos.detalle(planElegido))
          )
        ),

        h('div', { class: 'ahorro-destacado' },
          ahorroAnual > 0
            ? [
                h('p', { class: 'ahorro-destacado__frase' }, 'Te ahorrarías aproximadamente:'),
                h('p', { class: 'ahorro-destacado__monto' }, `${PC.util.soles(ahorroAnual)} al año`),
                h('p', { class: 'ahorro-destacado__sub' }, `Representa un ${pctAhorro} % menos de gasto en tus servicios.`)
              ]
            : [
                h('p', { class: 'ahorro-destacado__frase' }, 'Tu tarifa actual ya es muy competitiva frente a este plan.'),
                h('p', { class: 'ahorro-destacado__sub' }, 'Compara los GB o la velocidad para verificar si tienes la mejor calidad.')
              ]
        ),

        alertas.length ? h('div', { class: 'ahorro-alertas' },
          h('h3', { class: 'ahorro-alertas__tit' }, 'Detección de sobrecostos (Normas OSIPTEL)'),
          alertas.map(a => h('div', { class: 'alerta-item' },
            h('p', { class: 'alerta-item__tit' }, a.titulo),
            h('p', { class: 'alerta-item__txt' }, a.texto)
          ))
        ) : null,

        h('div', { class: 'ahorro-acciones' },
          h('button', { type: 'button', class: 'boton boton--primario', dataset: { comp: planElegido.id } }, `Agregar ${planElegido.nombre} al comparador`),
          h('button', { type: 'button', class: 'boton boton--fantasma', dataset: { servicio: estadoCalculo.tipo } }, `Hacer el cuestionario para ${estadoCalculo.tipo === 'movil' ? 'celular' : 'casa'}`)
        )
      );
    }

    // Formulario de entrada
    function pintarFormulario() {
      const selectTipo = h('select', { id: 'calc-tipo', class: 'campo-select' },
        h('option', { value: 'movil', selected: estadoCalculo.tipo === 'movil' }, 'Celular postpago'),
        h('option', { value: 'hogar', selected: estadoCalculo.tipo === 'hogar' }, 'Internet para casa')
      );

      const selectOp = h('select', { id: 'calc-op', class: 'campo-select' },
        ['Claro', 'Movistar', 'Entel', 'Bitel', 'Win', 'WOW', 'MiFibra', 'FiberPro', 'Otro'].map(op =>
          h('option', { value: op, selected: estadoCalculo.operadorActual === op }, op)
        )
      );

      const inputMonto = h('input', {
        type: 'number',
        id: 'calc-monto',
        class: 'campo-numero',
        min: '10',
        max: '1000',
        step: '0.10',
        value: String(estadoCalculo.montoMensual)
      });

      const checkDeco = h('input', { type: 'checkbox', id: 'chk-deco', checked: estadoCalculo.deco });
      const checkRouter = h('input', { type: 'checkbox', id: 'chk-router', checked: estadoCalculo.router });
      const checkSeguro = h('input', { type: 'checkbox', id: 'chk-seguro', checked: estadoCalculo.seguro });
      const checkExtra = h('input', { type: 'checkbox', id: 'chk-extra', checked: estadoCalculo.extra });

      // Selector de planes de PlanoClaro
      const planesFiltrados = catalogo.filter(p => p.tipo === estadoCalculo.tipo);
      const selectPlan = h('select', { id: 'calc-plan-destino', class: 'campo-select' },
        planesFiltrados.map(p =>
          h('option', { value: p.id, selected: p.id === estadoCalculo.planId },
            `${p.operador} ${p.nombre} — ${PC.util.soles(p.precioRegular)}/mes (${p.tipo === 'movil' ? p.gbAltaVelocidad + ' GB' : p.velocidadMbps + ' Mbps'})`
          )
        )
      );

      selectTipo.addEventListener('change', e => {
        estadoCalculo.tipo = e.target.value;
        const nuevos = catalogo.filter(p => p.tipo === estadoCalculo.tipo);
        if (nuevos.length) estadoCalculo.planId = nuevos[0].id;
        pintarFormulario();
        recalcular();
      });

      selectOp.addEventListener('change', e => {
        estadoCalculo.operadorActual = e.target.value;
        recalcular();
      });

      inputMonto.addEventListener('input', e => {
        estadoCalculo.montoMensual = Math.max(0, Number(e.target.value) || 0);
        recalcular();
      });

      checkDeco.addEventListener('change', e => { estadoCalculo.deco = e.target.checked; recalcular(); });
      checkRouter.addEventListener('change', e => { estadoCalculo.router = e.target.checked; recalcular(); });
      checkSeguro.addEventListener('change', e => { estadoCalculo.seguro = e.target.checked; recalcular(); });
      checkExtra.addEventListener('change', e => { estadoCalculo.extra = e.target.checked; recalcular(); });

      selectPlan.addEventListener('change', e => {
        estadoCalculo.planId = e.target.value;
        recalcular();
      });

      PC.vaciar(panelForm,
        h('h2', null, '¿Qué pagas en tu recibo hoy?'),
        h('p', { class: 'intro-corta' }, 'Ingresa los datos de tu último recibo para calcular tu ahorro real.'),

        h('div', { class: 'grupo-campo' },
          h('label', { for: 'calc-tipo' }, 'Tipo de servicio:'),
          selectTipo
        ),

        h('div', { class: 'grupo-campo' },
          h('label', { for: 'calc-op' }, 'Tu operador actual:'),
          selectOp
        ),

        h('div', { class: 'grupo-campo' },
          h('label', { for: 'calc-monto' }, 'Monto que pagas cada mes (S/ con IGV):'),
          inputMonto
        ),

        h('fieldset', { class: 'grupo-adicionales' },
          h('legend', null, '¿Tu recibo incluye alguno de estos cobros?'),
          h('label', { class: 'opcion-chk' }, checkDeco, h('span', null, 'Alquiler de deco o caja TV (+ S/ 15/mes)')),
          h('label', { class: 'opcion-chk' }, checkRouter, h('span', null, 'Alquiler de router o repetidor (+ S/ 12/mes)')),
          h('label', { class: 'opcion-chk' }, checkSeguro, h('span', null, 'Seguro de equipo no solicitado (+ S/ 9.90/mes)')),
          h('label', { class: 'opcion-chk' }, checkExtra, h('span', null, 'Paquetes de canales o llamadas extra (+ S/ 15/mes)'))
        ),

        h('div', { class: 'grupo-campo' },
          h('label', { for: 'calc-plan-destino' }, 'Comparar contra este plan de PlanoClaro:'),
          selectPlan
        )
      );
    }

    pintarFormulario();
    recalcular();

    PC.vaciar(contenedor, panelForm, panelResultado);
    PC.vaciar(raiz, contenedor);
  }
};
