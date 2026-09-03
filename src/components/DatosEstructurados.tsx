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
