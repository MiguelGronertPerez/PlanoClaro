/* Generador de Solicitudes y Reclamos ante OSIPTEL:
   Permite redactar documentos formales con base legal oficial peruana (Ley 31207, TUO de Condiciones de Uso y Reglamento de Reclamos).
   Privacidad total: se procesa al 100 % en el navegador del usuario sin enviar datos a servidores externos. */
PC.reclamos = {
  render() {
    const raiz = document.getElementById('reclamos');
    if (!raiz) return;
    const h = PC.h;

    const MOTIVOS = [
      {
        id: 'baja',
        nombre: 'Solicitud de baja definitiva (cancelación de plan)',
        articulo: 'Art. 67 del TUO de Condiciones de Uso de los Servicios Públicos de Telecomunicaciones (Res. 138-2012-CD/OSIPTEL)',
        plazo: 'Máximo 5 días hábiles para ejecutar la baja.',
        generarTexto: d => `SOLICITUD FORMAL DE BAJA DEFINITIVA DE SERVICIO DE TELECOMUNICACIONES

Señores:
${d.operador.toUpperCase()} PERÚ
Atención: Área de Atención al Cliente y Bajas

Yo, ${d.nombre.toUpperCase()}, identificado(a) con ${d.tipoDoc} N° ${d.numDoc}, titular del servicio registrado bajo el número o código de cliente: ${d.servicio}, ante ustedes me presento y expongo:

1. Que, en ejercicio de mi derecho consagrado en el Artículo 67 del Texto Único Ordenado de las Condiciones de Uso de los Servicios Públicos de Telecomunicaciones (aprobado por Resolución de Consejo Directivo N° 138-2012-CD/OSIPTEL), solicito la BAJA DEFINITIVA E INMEDIATA del servicio mencionado.

2. Se deja constancia expresa de que la normativa vigente de OSIPTEL establece un plazo perentorio de cinco (5) días hábiles para hacer efectiva la baja solicitada, quedando prohibido condicionar dicho trámite a pagos futuros no devengados o a la entrega presencial de equipos en locales comerciales.

3. En caso de contar con equipos provistos en comodato o alquiler (router / módem), solicito se coordine el recojo en mi domicilio o se me indique el canal reglamentario sin generar ningún costo adicional por mora o retraso administrativo de su parte.

Por tanto:
Agradeceré registrar la presente solicitud de manera inmediata y proporcionarme el CÓDIGO DE REGISTRO / TRÁMITE correspondiente, de acuerdo con la regulación de telecomunicaciones del Perú.

Fecha: ${d.fecha}
Firma: ${d.nombre}
Documento: ${d.tipoDoc} ${d.numDoc}`
      },
      {
        id: 'velocidad',
        nombre: 'Reclamo por incumplimiento de velocidad mínima garantizada (Ley 31207)',
        articulo: 'Ley N° 31207 y Reglamento General de Calidad de los Servicios de Telecomunicaciones',
        plazo: 'Hasta 15 días hábiles para emitir resolución de primera instancia.',
        generarTexto: d => `FORMULARIO DE RECLAMO POR CALIDAD DEL SERVICIO DE INTERNET (INCUMPLIMIENTO DE VELOCIDAD MÍNIMA)

Señores:
${d.operador.toUpperCase()} PERÚ
Atención: Oficina de Reclamos y Atención al Usuario

Yo, ${d.nombre.toUpperCase()}, con ${d.tipoDoc} N° ${d.numDoc}, titular del servicio de internet con código / línea: ${d.servicio}, presento RECLAMO POR CALIDAD DE SERVICIO con base en los siguientes fundamentos:

1. Que, mediante la Ley N° 31207 y la normativa técnica de OSIPTEL, las empresas operadoras tienen la obligación de garantizar un mínimo del 70 % de la velocidad contratada en todo momento para conexiones de internet.

2. En reiteradas mediciones he verificado que la velocidad real recibida es sustancialmente menor a dicho porcentaje mínimo legal garantizado, afectando el uso ordinario de mis actividades laborales y formativas.

3. Detalle de la incidencia: ${d.detalle || 'Velocidad de descarga y subida por debajo del 70 % de lo contratado en las horas de uso habitual.'}

Por tanto:
Exijo la verificación técnica de mi línea, la normalización inmediata de la velocidad contratada y la aplicación del ajuste o descuento correspondiente en la facturación por el periodo en que se brindó un servicio deficiente. Solicito el CÓDIGO DE RECLAMO para el seguimiento ante el TRASU de OSIPTEL en caso de denegatoria.

Fecha: ${d.fecha}
Firma: ${d.nombre}
Documento: ${d.tipoDoc} ${d.numDoc}`
      },
      {
        id: 'facturacion',
        nombre: 'Reclamo por cobro indebido o facturación no reconocida',
        articulo: 'Art. 40 del Reglamento de Reclamos de Usuarios de OSIPTEL',
        plazo: 'Hasta 15 días hábiles para responder formalmente.',
        generarTexto: d => `RECLAMO POR FACTURACIÓN Y COBRO INDEBIDO

Señores:
${d.operador.toUpperCase()} PERÚ
Atención: Área de Reclamos

Yo, ${d.nombre.toUpperCase()}, con ${d.tipoDoc} N° ${d.numDoc}, titular de la línea / cuenta: ${d.servicio}, presento RECLAMO FORMAL POR MATERIA DE FACTURACIÓN al amparo del Reglamento de Atención de Reclamos de Usuarios de OSIPTEL:

1. Que, en mi último recibo se consignan importes por conceptos no autorizados ni contratados expresamente por mi persona (servicios de valor agregado, seguros, alquileres indebidos o cargos posteriores a la fecha de corte).

2. Detalle del concepto reclamado: ${d.detalle || 'Cobro de conceptos adicionales no contratados expresamente por el titular.'}

3. Conforme a las normas de protección al usuario de telecomunicaciones, la empresa no puede suspender el servicio respecto de los conceptos no controvertidos mientras el presente reclamo se encuentre en trámite de resolución.

Por tanto:
Solicito la anulación del cobro indebido, la emisión de una nota de crédito o refacturación del recibo correspondiente y la entrega inmediata de mi CÓDIGO DE RECLAMO formal.

Fecha: ${d.fecha}
Firma: ${d.nombre}
Documento: ${d.tipoDoc} ${d.numDoc}`
      },
      {
        id: 'averia',
        nombre: 'Reclamo por avería e interrupción no reparada',
        articulo: 'Art. 48 del TUO de Condiciones de Uso de OSIPTEL',
        plazo: 'Descuento obligatorio en el siguiente ciclo por corte de servicio.',
        generarTexto: d => `RECLAMO POR INTERRUPCIÓN PROLONGADA Y SOLICITUD DE COMPENSACIÓN

Señores:
${d.operador.toUpperCase()} PERÚ
Atención: Área Técnica y de Reclamos

Yo, ${d.nombre.toUpperCase()}, con ${d.tipoDoc} N° ${d.numDoc}, titular del servicio con código / línea: ${d.servicio}, interpongo RECLAMO FORMAL POR AVERÍA E INTERRUPCIÓN DEL SERVICIO:

1. Que, mi servicio ha sufrido una interrupción prolongada atribuible a la red de su empresa, privándome de conectividad durante el periodo comprendido: ${d.detalle || 'Interrupción continua no resuelta en los plazos reglamentarios de atención de averías.'}

2. De acuerdo con el Artículo 48 del TUO de Condiciones de Uso de OSIPTEL, la empresa operadora se encuentra obligada a descontar de forma automática y proporcional el monto correspondiente al tiempo en que el servicio estuvo interrumpido.

Por tanto:
Solicito la restitución técnica del servicio y la acreditación de la devolución compensatoria en mi siguiente recibo mensual, así como el número de reporte y CÓDIGO DE RECLAMO.

Fecha: ${d.fecha}
Firma: ${d.nombre}
Documento: ${d.tipoDoc} ${d.numDoc}`
      }
    ];

    let datos = {
      motivoId: 'baja',
      nombre: '',
      tipoDoc: 'DNI',
      numDoc: '',
      operador: 'Claro',
      servicio: '',
      detalle: '',
      fecha: new Date().toLocaleDateString('es-PE')
    };

    const contenedor = h('div', { class: 'reclamos-grid' });
    const panelForm = h('div', { class: 'panel reclamos-form' });
    const panelVisor = h('div', { class: 'panel reclamos-visor' });

    function actualizarVisor() {
      const motivo = MOTIVOS.find(m => m.id === datos.motivoId) || MOTIVOS[0];
      const textoFinal = motivo.generarTexto({
        ...datos,
        nombre: datos.nombre.trim() || '[TU NOMBRE COMPLETO]',
        numDoc: datos.numDoc.trim() || '[NÚMERO DE DOCUMENTO]',
        servicio: datos.servicio.trim() || '[NÚMERO DE LÍNEA O CÓDIGO DE CLIENTE]'
      });

      PC.vaciar(panelVisor,
        h('div', { class: 'visor-cabeza' },
          h('h2', null, 'Vista previa de tu solicitud formal'),
          h('div', { class: 'visor-base-legal' },
            h('strong', null, 'Base legal: '), h('span', null, motivo.articulo),
            h('br', null),
            h('strong', null, 'Plazo legal: '), h('span', null, motivo.plazo)
          )
        ),

        h('pre', { class: 'visor-documento', id: 'doc-texto', tabindex: '0', 'aria-label': 'Documento generado' }, textoFinal),

        h('div', { class: 'visor-acciones' },
          h('button', {
            type: 'button',
            class: 'boton boton--primario',
            id: 'btn-copiar-doc'
          }, PC.h('span', { dataIcono: 'copiar', ariaHidden: 'true' }), h('span', null, 'Copiar texto para WhatsApp o Web')),

          h('button', {
            type: 'button',
            class: 'boton boton--fantasma',
            id: 'btn-descargar-doc'
          }, h('span', null, 'Descargar documento (.txt)'))
        ),

        h('div', { class: 'visor-pasos' },
          h('h3', null, 'Pasos para presentar tu reclamo ante la empresa:'),
          h('ol', { class: 'pasos-guia' },
            h('li', null, 'Copia este texto y envíalo por WhatsApp, app o el canal web oficial de tu operador.'),
            h('li', null, 'EXIGE SIEMPRE TU CÓDIGO DE RECLAMO (código de 10 dígitos). Guárdalo con fecha y hora.'),
            h('li', null, 'La empresa tiene un plazo legal de 15 días hábiles para responder (5 días hábiles para baja).'),
            h('li', null, 'Si la empresa no responde o te deniega el pedido, puedes apelar ante el TRASU de OSIPTEL con tu código de reclamo.')
          )
        )
      );

      PC.hidratarIconos(panelVisor);

      // Eventos de botones
      const btnCopiar = document.getElementById('btn-copiar-doc');
      const btnDescargar = document.getElementById('btn-descargar-doc');

      if (btnCopiar) {
        btnCopiar.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(textoFinal);
            PC.avisar('¡Documento copiado al portapapeles! Listo para pegar.');
            PC.sonido.tocar('ok');
          } catch (e) {
            PC.avisar('No se pudo copiar automáticamente. Puedes seleccionarlo y copiarlo.');
          }
        });
      }

      if (btnDescargar) {
        btnDescargar.addEventListener('click', () => {
          PC.util.descargar(`reclamo_${datos.motivoId}_${datos.operador.toLowerCase()}.txt`, textoFinal, 'text/plain;charset=utf-8');
          PC.avisar('Descargamos tu documento formal en archivo de texto.');
          PC.sonido.tocar('ok');
        });
      }
    }

    function pintarFormulario() {
      const selectMotivo = h('select', { id: 'rec-motivo', class: 'campo-select' },
        MOTIVOS.map(m => h('option', { value: m.id, selected: m.id === datos.motivoId }, m.nombre))
      );

      const inputNombre = h('input', {
        type: 'text',
        id: 'rec-nombre',
        class: 'campo-texto',
        placeholder: 'Ej.: Juan Pérez Quispe',
        value: datos.nombre,
        autocomplete: 'name'
      });

      const selectTipoDoc = h('select', { id: 'rec-tipodoc', class: 'campo-select' },
        ['DNI', 'Carné de Extranjería', 'RUC', 'Pasaporte'].map(t => h('option', { value: t, selected: t === datos.tipoDoc }, t))
      );

      const inputNumDoc = h('input', {
        type: 'text',
        id: 'rec-numdoc',
        class: 'campo-texto',
        placeholder: 'Ej.: 45892134',
        value: datos.numDoc,
        maxlength: '15'
      });

      const selectOperador = h('select', { id: 'rec-operador', class: 'campo-select' },
        ['Claro', 'Movistar', 'Entel', 'Bitel', 'Win', 'WOW', 'MiFibra', 'FiberPro'].map(op =>
          h('option', { value: op, selected: op === datos.operador }, op)
        )
      );

      const inputServicio = h('input', {
        type: 'text',
        id: 'rec-servicio',
        class: 'campo-texto',
        placeholder: 'Ej.: 987654321 o Cód. de cliente 1029384',
        value: datos.servicio
      });

      const inputDetalle = h('textarea', {
        id: 'rec-detalle',
        class: 'campo-area',
        rows: '3',
        placeholder: 'Agrega cualquier dato extra (opcional: fecha en que llamaste, velocidad recibida, etc.)...'
      }, datos.detalle);

      selectMotivo.addEventListener('change', e => { datos.motivoId = e.target.value; actualizarVisor(); });
      inputNombre.addEventListener('input', e => { datos.nombre = e.target.value; actualizarVisor(); });
      selectTipoDoc.addEventListener('change', e => { datos.tipoDoc = e.target.value; actualizarVisor(); });
      inputNumDoc.addEventListener('input', e => { datos.numDoc = e.target.value; actualizarVisor(); });
      selectOperador.addEventListener('change', e => { datos.operador = e.target.value; actualizarVisor(); });
      inputServicio.addEventListener('input', e => { datos.servicio = e.target.value; actualizarVisor(); });
      inputDetalle.addEventListener('input', e => { datos.detalle = e.target.value; actualizarVisor(); });

      PC.vaciar(panelForm,
        h('h2', null, 'Completa los datos de tu trámite'),
        h('p', { class: 'intro-corta' }, 'Tus datos no salen de tu navegador. Se usan exclusivamente para redactar el documento formal.'),

        h('div', { class: 'grupo-campo' },
          h('label', { for: 'rec-motivo' }, '¿Qué trámite deseas realizar?'),
          selectMotivo
        ),

        h('div', { class: 'grupo-campo' },
          h('label', { for: 'rec-operador' }, 'Empresa operadora a la que te diriges:'),
          selectOperador
        ),

        h('div', { class: 'grupo-campo' },
          h('label', { for: 'rec-nombre' }, 'Nombre completo del titular del servicio:'),
          inputNombre
        ),

        h('div', { class: 'fila-dos-campos' },
          h('div', { class: 'grupo-campo' },
            h('label', { for: 'rec-tipodoc' }, 'Tipo de documento:'),
            selectTipoDoc
          ),
          h('div', { class: 'grupo-campo' },
            h('label', { for: 'rec-numdoc' }, 'Número de documento:'),
            inputNumDoc
          )
        ),

        h('div', { class: 'grupo-campo' },
          h('label', { for: 'rec-servicio' }, 'Número de teléfono o código de cliente / servicio:'),
          inputServicio
        ),

        h('div', { class: 'grupo-campo' },
          h('label', { for: 'rec-detalle' }, 'Detalle complementario de tu caso (opcional):'),
          inputDetalle
        )
      );
    }

    pintarFormulario();
    actualizarVisor();

    PC.vaciar(contenedor, panelForm, panelVisor);
    PC.vaciar(raiz, contenedor);
  }
};
