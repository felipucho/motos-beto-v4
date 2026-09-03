import { especificacionSchema } from '@/lib/horario';
import { direccion, negocio } from '@/lib/negocio';
import { siteUrl } from '@/lib/site';

/**
 * Marcado LocalBusiness para la búsqueda local, que es el objetivo declarado
 * del sitio. Todo sale de `data/negocio.js`, así que no puede desincronizarse
 * de lo que se ve en pantalla.
 *
 * La coordenada sale de la ficha de Google del propio negocio, no de una
 * búsqueda por dirección. No se declaran `priceRange` ni `aggregateRating`:
 * no existen y no se inventan.
 */
export function DatosEstructurados() {
  const datos = {
    '@context': 'https://schema.org',
    // Dos tipos, porque son dos rubros reales bajo el mismo techo: motos
    // desde hace más de 25 años y bicicletas desde hace 10.
    '@type': ['MotorcycleDealer', 'BikeStore'],
    '@id': `${siteUrl}/#negocio`,
    name: negocio.nombre,
    description:
      'Venta de motos y bicicletas, repuestos, accesorios y taller propio en Las Varillas, Córdoba. Subagentes multimarca, con gestoría y financiación en cuotas.',
    url: siteUrl,
    telephone: negocio.telefonoLink.replace('tel:', ''),
    logo: `${siteUrl}/marca/motos-beto-tinta.png`,
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
