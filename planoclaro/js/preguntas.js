/* Cuestionario en palabras de todos los días. Una pregunta por pantalla.
   Cada opción tiene icono + texto (el icono nunca va solo) y aporta valores al motor. */
PC.PREGUNTAS = {
  movil: [
    { id: 'fuera', icono: 'calle', texto: '¿Cuánto usas internet en el celular cuando estás fuera de casa?', ayuda: 'Piensa en un día normal: en la calle, en el trabajo o en la combi. Sin contar el WiFi.', opciones: [
      { v: 'poco', icono: 'chat', t: 'Poco', d: 'WhatsApp y mirar algo de vez en cuando', gb: 5 },
      { v: 'medio', icono: 'ubicacion', t: 'Normal', d: 'Redes sociales y mapas varias veces al día', gb: 12 },
      { v: 'mucho', icono: 'señal', t: 'Bastante', d: 'Estoy conectado casi todo el día', gb: 25 } ] },
    { id: 'video', icono: 'video', texto: '¿Ves videos o escuchas música fuera de casa?', ayuda: 'YouTube, TikTok, Netflix, Spotify… Ver videos es lo que más datos gasta.', opciones: [
      { v: 'no', icono: 'no', t: 'Casi nunca', d: 'Solo en casa con WiFi', gb: 0 },
      { v: 'aveces', icono: 'musica', t: 'A veces', d: 'Algunos videos o música en el camino', gb: 15 },
      { v: 'diario', icono: 'video', t: 'Todos los días', d: 'Varias horas al día', gb: 50 } ] },
    { id: 'compartir', icono: 'compartir', texto: '¿Le pasas internet de tu celular a otro equipo?', ayuda: 'Por ejemplo, a tu laptop o al celular de otra persona (se llama «compartir datos» o «punto de acceso»).', opciones: [
      { v: 'no', icono: 'no', t: 'No', d: 'Nunca lo hago', gb: 0 },
      { v: 'aveces', icono: 'compartir', t: 'A veces', d: 'De vez en cuando', gb: 15 },
      { v: 'seguido', icono: 'maletin', t: 'Seguido', d: 'Lo uso para trabajar o estudiar', gb: 50 } ] },
    { id: 'intl', icono: 'mundo', texto: '¿Necesitas usar tu celular fuera del Perú?', ayuda: 'Para viajar o llamar a otros países.', opciones: [
      { v: 'no', icono: 'no', t: 'No', d: 'Solo lo uso en el Perú' },
      { v: 'si', icono: 'mundo', t: 'Sí', d: 'Viajo o llamo al extranjero' } ] },
    { id: 'presupuesto', icono: 'billetera', texto: '¿Cuánto es lo máximo que quieres pagar al mes?', ayuda: 'Pensamos en el precio de siempre, el que llega cuando se acaba la oferta.', opciones: [
      { v: '40', icono: 'billetera', t: 'Hasta S/ 40', d: 'Al mes', max: 40 },
      { v: '60', icono: 'billetera', t: 'Hasta S/ 60', d: 'Al mes', max: 60 },
      { v: '100', icono: 'billetera', t: 'Hasta S/ 100', d: 'Al mes', max: 100 },
      { v: 'sin', icono: 'infinito', t: 'Sin límite fijo', d: 'Quiero ver todas las opciones', max: Infinity } ] }
  ],
  hogar: [
    { id: 'personas', icono: 'personas', texto: '¿Cuántas personas usan internet en tu casa?', ayuda: 'Cuenta a todos los que se conectan, también a los niños.', opciones: [
      { v: '1-2', icono: 'personas', t: '1 o 2 personas', d: 'Casa pequeña', mbps: 100 },
      { v: '3-4', icono: 'personas', t: '3 o 4 personas', d: 'Familia mediana', mbps: 200 },
      { v: '5+', icono: 'personas', t: '5 o más', d: 'Familia grande', mbps: 400 } ] },
    { id: 'actividades', icono: 'casa', multiple: true, texto: '¿Para qué usan internet en casa?', ayuda: 'Puedes marcar varias. Marca al menos una.', opciones: [
      { v: 'basico', icono: 'chat', t: 'Lo básico', d: 'Redes, noticias y tareas', mbps: 0 },
      { v: 'teletrabajo', icono: 'maletin', t: 'Trabajo o clases', d: 'Videollamadas por Zoom o Meet', mbps: 100 },
      { v: 'streaming', icono: 'video', t: 'Series y fútbol', d: 'Netflix, YouTube, L1MAX', mbps: 100 },
      { v: 'juegos', icono: 'juego', t: 'Videojuegos', d: 'Juegos en línea', mbps: 100 } ] },
    { id: 'zona', icono: 'ubicacion', texto: '¿Dónde está tu casa?', ayuda: 'Algunas empresas solo llegan a Lima y Callao. En provincias, pregunta siempre por tu dirección exacta.', opciones: [
      { v: 'lima', icono: 'edificio', t: 'Lima o Callao', d: 'Lima Metropolitana o Callao' },
      { v: 'provincia', icono: 'ubicacion', t: 'Otra región', d: 'Arequipa, Piura, Cusco y demás' } ] },
    { id: 'vivienda', icono: 'edificio', texto: '¿Cómo es tu casa?', ayuda: 'Así sabemos si el WiFi llegará a todos los cuartos.', opciones: [
      { v: 'depa', icono: 'edificio', t: 'Un solo piso', d: 'Departamento o casa pequeña' },
      { v: 'casa', icono: 'casa', t: 'Dos pisos o más', d: 'O cuartos alejados del router' } ] },
    { id: 'presupuesto', icono: 'billetera', texto: '¿Cuánto es lo máximo que quieres pagar al mes?', ayuda: 'Pensamos en el precio de siempre, el que llega cuando se acaba la oferta.', opciones: [
      { v: '80', icono: 'billetera', t: 'Hasta S/ 80', d: 'Al mes', max: 80 },
      { v: '110', icono: 'billetera', t: 'Hasta S/ 110', d: 'Al mes', max: 110 },
      { v: '150', icono: 'billetera', t: 'Hasta S/ 150', d: 'Al mes', max: 150 },
      { v: 'sin', icono: 'infinito', t: 'Sin límite fijo', d: 'Quiero ver todas las opciones', max: Infinity } ] }
  ]
};
