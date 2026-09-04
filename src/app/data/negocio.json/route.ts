import { especificacionSchema } from '@/lib/horario';
import { direccion, negocio } from '@/lib/negocio';
import { siteUrl } from '@/lib/site';

/**
 * `/data/negocio.json`: el negocio entero como JSON, para el agente que
 * prefiere datos a prosa.
 *
 * Es el tercer registro de la misma información, junto al HTML y a
 * `/llms.txt`, y como los otros dos se genera desde `data/negocio.js`. Ese es
 * el punto: un archivo escrito a mano se desincroniza el día que el dueño
 * corrige un horario, y tres fuentes que se contradicen son peores que una
 * sola. Acá no hay nada que mantener aparte.
 *
 * No agrega ni un dato que no esté en pantalla. Lo que cambia es la forma:
 * campos con nombre y tipos, en vez de párrafos.
 */
export const dynamic = 'force-static';

export function GET() {
  const cuerpo = {
    // Enlaza con el JSON-LD de la página: es la misma entidad, no una copia.
    '@id': `${siteUrl}/#business`,
    nombre: negocio.nombre,
    rubro: negocio.rubro,
    antiguedad: negocio.antiguedad,
    sitio: siteUrl,

    contacto: {
      direccion: {
        texto: negocio.direccion,
        calle: direccion.calle,
        localidad: direccion.localidad,
        provincia: direccion.provincia,
        codigoPostal: direccion.codigoPostal,
        pais: direccion.pais,
      },
      coordenadas: negocio.coordenadas,
      googlePlaceId: negocio.googlePlaceId,
      telefono: negocio.telefonoLink.replace('tel:', ''),
      telefonoTexto: negocio.telefonoTexto,
      whatsapp: negocio.whatsappTexto,
      whatsappLink: negocio.whatsappLink,
      instagram: negocio.instagramLink,
      mapa: negocio.mapaLink,
      comoLlegar: negocio.comoLlegarLink,
    },

    // Dos formas del mismo horario: la legible, tal como la escribió el dueño,
    // y la de máquina en el formato de schema.org, que es la que sirve para
    // calcular si está abierto.
    horarios: {
      texto: negocio.horarios,
      especificacion: especificacionSchema(),
      zonaHoraria: 'America/Argentina/Cordoba',
    },

    motos: negocio.motos,
    bicicletas: negocio.bicicletas,
    taller: negocio.taller,
    repuestos: negocio.repuestos,
    tramites: negocio.tramites,
    pagos: {
      formas: negocio.pagos.map(({ forma, detalle }) => ({ forma, detalle })),
      nota: negocio.pagosNota,
      moneda: 'ARS',
    },

    // Lo que el sitio NO publica, dicho explícito para que nadie lo complete
    // por su cuenta: no hay catálogo por modelo, ni precios, ni stock.
    noPublicado: [
      'Precios y coeficientes de financiación: cambian seguido y se consultan en el local.',
      'Catálogo por modelo, con ficha técnica o disponibilidad: el sitio publica marcas y categorías, no unidades.',
    ],

    recursos: {
      html: `${siteUrl}/`,
      llmsTxt: `${siteUrl}/llms.txt`,
      sitemap: `${siteUrl}/sitemap.xml`,
    },
  };

  return Response.json(cuerpo, {
    headers: {
      // Público y cacheable: es un archivo estático que cambia cuando cambia el
      // dato del negocio, o sea casi nunca.
      'cache-control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
