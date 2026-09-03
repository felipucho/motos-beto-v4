import { especificacionSchema } from '@/lib/horario';
import { direccion, negocio } from '@/lib/negocio';
import { siteUrl } from '@/lib/site';

/**
 * Marcado LocalBusiness para la búsqueda local, que es el objetivo declarado
 * del sitio. Todo sale de `data/negocio.js`, así que no puede desincronizarse
 * de lo que se ve en pantalla.
 *
 * La coordenada sale de la ficha de Google del propio negocio, no de una
 * búsqueda por dirección.
 *
 * No se declara `aggregateRating` ni `review`: las reseñas propias publicadas
 * en el marcado están prohibidas por Google para negocios locales, y desde
 * 2019 no producen estrellas en el resultado. Las que cuentan son las de la
 * ficha, escritas por clientes.
 */
/** Identidades estables de las entidades del grafo. Se referencian entre sí. */
const ID = {
  negocio: `${siteUrl}/#business`,
  sitio: `${siteUrl}/#website`,
  pagina: `${siteUrl}/#webpage`,
  imagen: `${siteUrl}/#imagen`,
};

export function DatosEstructurados() {
  const local = {
    // Dos tipos, porque son dos rubros reales bajo el mismo techo: motos
    // desde hace más de 25 años y bicicletas desde hace 10.
    //
    // `MotorcycleDealer` es descendiente de `AutoDealer` en el vocabulario, así
    // que decir el hijo dice también al padre: declarar los dos sería ruido, y
    // quedarse con `AutoDealer` sería perder precisión —acá no se venden autos.
    '@type': ['MotorcycleDealer', 'BikeStore'],
    '@id': ID.negocio,
    name: negocio.nombre,
    description:
      'Venta de motos y bicicletas, repuestos, accesorios y taller propio en Las Varillas, Córdoba. Subagentes multimarca, con gestoría y financiación en cuotas.',
    url: siteUrl,
    telephone: negocio.telefonoLink.replace('tel:', ''),
    logo: `${siteUrl}/marca/motos-beto-tinta.png`,
    image: { '@id': ID.imagen },
    address: {
      '@type': 'PostalAddress',
      streetAddress: direccion.calle,
      addressLocality: direccion.localidad,
      addressRegion: direccion.provincia,
      addressCountry: direccion.pais,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: negocio.coordenadas.lat,
      longitude: negocio.coordenadas.lng,
    },
    areaServed: {
      '@type': 'City',
      name: direccion.localidad,
    },
    openingHoursSpecification: especificacionSchema(),
    // Rango de precios, en la escala de uno a cuatro símbolos que usa Google.
    // Es una banda, no un precio: dice dónde se ubica el negocio frente a los
    // del rubro, y lo eligió el dueño. No compromete ningún número concreto.
    priceRange: '$',
    currenciesAccepted: 'ARS',
    paymentAccepted: negocio.pagos.map((pago) => pago.forma).join(', '),
    // Las marcas son la pregunta que más se hace en el mostrador —"¿tenés
    // Honda?"— y la que un modelo necesita poder responder sin leer la página
    // entera. Van como catálogo y no como `brand`, que en un comercio nombra la
    // marca del comercio y no la de lo que vende.
    hasOfferCatalog: [
      catalogo('Motos', negocio.motos.marcas, 'Motorcycle'),
      catalogo('Bicicletas', negocio.bicicletas.marcas, 'Product'),
    ],
    makesOffer: [
      servicio('Taller de motos', negocio.taller.entrada),
      servicio('Repuestos y accesorios', negocio.repuestos.moto),
      servicio('Gestoría y patentamiento', negocio.tramites.gestoria),
      servicio('Alquiler de bicicletas', negocio.bicicletas.alquiler),
      servicio('Envíos a otras localidades', negocio.repuestos.envios),
    ],
    hasMap: negocio.mapaLink,
    sameAs: [negocio.instagramLink, negocio.mapaLink],
    // Las dos vías por las que el negocio atiende de verdad. El WhatsApp lleva
    // el mismo número que el teléfono; `contactType` dice para qué sirve cada
    // una en el vocabulario que Google lee.
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: negocio.telefonoLink.replace('tel:', ''),
        availableLanguage: 'Spanish',
        areaServed: 'AR',
      },
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: negocio.whatsappTexto.replace(/[^\d+]/g, ''),
        url: negocio.whatsappLink,
        availableLanguage: 'Spanish',
        areaServed: 'AR',
      },
    ],
  };

  /**
   * El sitio como obra, separado del negocio que lo publica. Es lo que permite
   * que una respuesta generada distinga "la página" del "comercio".
   */
  const sitio = {
    '@type': 'WebSite',
    '@id': ID.sitio,
    url: siteUrl,
    name: negocio.nombre,
    inLanguage: 'es-AR',
    publisher: { '@id': ID.negocio },
  };

  /** La portada, que es la única página que hoy tiene el sitio. */
  const pagina = {
    '@type': 'WebPage',
    '@id': ID.pagina,
    url: `${siteUrl}/`,
    name: negocio.nombre,
    isPartOf: { '@id': ID.sitio },
    about: { '@id': ID.negocio },
    primaryImageOfPage: { '@id': ID.imagen },
    inLanguage: 'es-AR',
  };

  const imagen = {
    '@type': 'ImageObject',
    '@id': ID.imagen,
    url: `${siteUrl}/marca/motos-beto-compartir.png`,
    width: 1200,
    height: 630,
    caption: negocio.nombre,
  };

  // Un solo bloque con las cuatro entidades enlazadas por `@id`, en vez de
  // cuatro scripts sueltos: así el grafo se lee de una sola vez y no hay que
  // deducir qué se refiere a qué.
  const datos = {
    '@context': 'https://schema.org',
    '@graph': [local, sitio, pagina, imagen],
  };

  return (
    <script
      type="application/ld+json"
      // El JSON se construye acá, no llega de afuera: no hay entrada de usuario
      // que pueda romper el script.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(datos).replace(/</g, '\u003c') }}
    />
  );
}

/** Las marcas de un rubro, como catálogo de oferta. */
function catalogo(nombre: string, marcas: readonly string[], tipo: string) {
  return {
    '@type': 'OfferCatalog',
    name: nombre,
    itemListElement: marcas.map((marca) => ({
      '@type': 'Offer',
      itemOffered: { '@type': tipo, name: marca, brand: { '@type': 'Brand', name: marca } },
    })),
  };
}

/**
 * Un servicio que el local presta, con la descripción que ya está en pantalla.
 * Cuando la descripción repite el nombre —el dato dice "Alquiler de bicicletas"
 * y el servicio se llama igual— se publica sólo el nombre: un campo que repite
 * al de al lado no agrega información y ensucia la ficha.
 */
function servicio(nombre: string, descripcion: string) {
  const repetida = descripcion.replace(/\.$/, '').toLowerCase() === nombre.toLowerCase();
  return {
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name: nombre,
      ...(repetida ? {} : { description: descripcion }),
    },
  };
}
