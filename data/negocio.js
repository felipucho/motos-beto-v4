// Datos del negocio. Fuente única para todo el sitio.
export const negocio = {
  nombre: 'Motos Beto',
  rubro: 'Motos, bicicletas y repuestos',
  direccion: 'B. Mitre 310, Las Varillas, Córdoba, Argentina',
  telefonoTexto: '(03533) 68-9287',
  telefonoLink: 'tel:+543533689287',
  whatsappTexto: '+54 9 3533 68-9287',
  whatsappLink:
    'https://wa.me/5493533689287?text=' +
    encodeURIComponent('¡Hola Motos Beto! Quería hacerles una consulta.'),
  instagramUsuario: '@motosbetolv',
  instagramLink: 'https://www.instagram.com/motosbetolv',
  antiguedad: 'Más de 25 años en Las Varillas.',
  horarios: [
    { dias: 'Lunes a viernes', horas: '8:30 a 12:30 hs y 15:30 a 19:30 hs' },
    { dias: 'Sábados', horas: '9:30 a 12:30 hs' },
    { dias: 'Domingos', horas: 'Cerrado' },
  ],

  // Ubicación tomada de la ficha de Google del negocio, no de una búsqueda por
  // dirección. Todo lo de acá abajo sale de la URL real de esa ficha:
  // https://maps.app.goo.gl/buuGYRjqs3fWM8dSA
  //   .../place/Motos+Beto/@...!1s0x95cb646fb380f6f9:0xc6964408dc27792e
  //           !8m2!3d-31.8769593!4d-62.7188429
  coordenadas: { lat: -31.8769593, lng: -62.7188429 },

  // Identificador de lugar de Google, derivado del par hexadecimal de esa URL
  // y comprobado: abre la misma ficha. Es lo que hace que "ver en el mapa" y
  // "cómo llegar" caigan en el negocio y no en una búsqueda por texto, que es
  // lo que fallaba antes en la aplicación del teléfono.
  googlePlaceId: 'ChIJ-faAs29ky5URLnkn3AhElsY',

  // Mapa centrado en el local, con el negocio marcado por nombre.
  mapaEmbed:
    'https://www.google.com/maps?q=' +
    encodeURIComponent('Motos Beto, B. Mitre 310, Las Varillas, Córdoba') +
    '&ll=-31.8769593,-62.7188429&z=17&hl=es&output=embed',

  // Ficha del negocio, en la forma que Google documenta para enlaces: nombre
  // más identificador de lugar. La abre igual el navegador y la aplicación.
  mapaLink:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Motos Beto, B. Mitre 310, Las Varillas, Córdoba') +
    '&query_place_id=ChIJ-faAs29ky5URLnkn3AhElsY',

  // Cómo llegar, con el destino puesto en el negocio y no en un punto suelto:
  // así el destino aparece con nombre y no como un par de coordenadas.
  comoLlegarLink:
    'https://www.google.com/maps/dir/?api=1&destination=' +
    encodeURIComponent('Motos Beto, B. Mitre 310, Las Varillas, Córdoba') +
    '&destination_place_id=ChIJ-faAs29ky5URLnkn3AhElsY',

  /* ---------------------------------------------------------------------------
     QUÉ SE OFRECE

     Todo lo que sigue lo dictó el dueño, Edilberto "Beto" Pautasso, el 1 de
     septiembre de 2026, respondiendo el cuestionario del sitio.

     Regla de este bloque: lo que se entendió con claridad se publica; lo que
     quedó dudoso en el audio quedó afuera y está anotado en el README, en
     "Datos a confirmar". Media marca mal escrita es peor que una marca menos.
     --------------------------------------------------------------------------- */

  motos: {
    condicion: 'Subagente multimarca: cinco marcas, ninguna en exclusiva.',
    marcas: ['Honda', 'Yamaha', 'Guerrero', 'Corven', 'CF Moto'],
    masBuscadas: [
      { que: '110 de calle', detalle: 'Guerrero, Corven y Honda Wave.' },
      { que: 'Enduro', detalle: 'Honda 150, 190 y 300.' },
    ],
    usadas: 'Pocas y seleccionadas: originales, con poco kilometraje. Se toman en parte de pago.',
  },

  pagos: [
    { forma: 'Contado', detalle: 'Efectivo o transferencia.', icono: 'billete' },
    { forma: 'Tarjeta', detalle: '3, 6 o 12 cuotas.', icono: 'tarjeta' },
    { forma: 'Financiera', detalle: 'Hasta 40 meses.', icono: 'calendario' },
  ],

  // Los coeficientes existen y el dueño los tiene, pero cambian seguido: un
  // porcentaje viejo en una página estática es una discusión en el mostrador.
  pagosNota: 'Coeficiente vigente, en el local.',

  bicicletas: {
    tipos: 'Mountain bike y bicicletas de ruta.',
    marcas: ['SLP', 'Nordic'],
    accesorios: 'Fuerte en accesorios; también repuestos.',
    alquiler: 'Alquiler de bicicletas.',
  },

  taller: {
    entrada: 'Taller propio, puerta al lado. Lo que aparece se resuelve ahí.',
    service: ['Aceite', 'Primer service', 'Frenos', 'Filtros'],
    mecanica: ['Campanas de freno', 'Cubiertas', 'Motores', 'Mantenimiento'],
    ajenas: 'También motos compradas en otro lado, y las de gente de paso.',
  },

  repuestos: {
    moto: 'Originales Honda y Yamaha, y alternativos.',
    cubiertas: 'Pirelli, Rinaldi y opciones económicas.',
    cascos: 'Con visores y mecanismos de recambio.',
    encargo: 'Lo que no está, en la semana.',
    envios: 'A otras localidades por comisionista, en el día.',
  },

  tramites: {
    gestoria: 'Patentamiento y papeles, con gestora propia.',
    seguros: 'No se venden: se deriva a aseguradoras conocidas.',
  },
};
