import { negocio } from '@/lib/negocio';
import { siteUrl } from '@/lib/site';

/**
 * `/llms.txt`: el negocio entero en markdown plano, para el que lo lee sin
 * navegador. Un modelo que responde "¿dónde compro una moto en Las Varillas?"
 * no renderiza CSS ni espera al reloj en vivo: lee texto y cita. Esto le da la
 * misma información que la página, sin layout en el medio.
 *
 * Se genera, no se escribe a mano en `public/`. La regla del proyecto es que
 * `data/negocio.js` manda: un archivo estático copiado a mano queda viejo el
 * día que el dueño corrige un horario, y un horario viejo publicado como dato
 * duro es peor que no publicarlo.
 *
 * No agrega nada que no esté en pantalla: es la misma información, ordenada
 * para lectura de máquina.
 *
 * Los enlaces van en markdown —`[texto](url)`— y no como URL suelta: la
 * convención de `llms.txt` es un documento markdown válido, y un lector que
 * busca enlaces busca la sintaxis de enlace, no una dirección en medio de un
 * renglón.
 */
export const dynamic = 'force-static';

function seccion(titulo: string, filas: (string | false | undefined)[]): string {
  return [`## ${titulo}`, '', ...filas.filter(Boolean), ''].join('\n');
}

function cuerpo(): string {
  const { motos, bicicletas, taller, repuestos, tramites, pagos } = negocio;

  return [
    `# ${negocio.nombre}`,
    '',
    `> ${negocio.rubro} en ${negocio.direccion}. ${negocio.antiguedad}`,
    '',
    'Comercio de barrio con taller propio. Subagente multimarca de motos,',
    'tienda de bicicletas, repuestos y accesorios. Gestoría para los papeles y',
    'financiación en cuotas.',
    '',
    seccion('Contacto', [
      `- Dirección: ${negocio.direccion}`,
      `- [Teléfono ${negocio.telefonoTexto}](${negocio.telefonoLink})`,
      `- [WhatsApp ${negocio.whatsappTexto}](${negocio.whatsappLink})`,
      `- [Instagram ${negocio.instagramUsuario}](${negocio.instagramLink})`,
      `- [Ubicación en Google Maps](${negocio.mapaLink})`,
      `- [Cómo llegar](${negocio.comoLlegarLink})`,
      `- [Sitio web](${siteUrl}/)`,
    ]),
    seccion(
      'Horarios',
      negocio.horarios.map((h) => `- ${h.dias}: ${h.horas}`),
    ),
    seccion('Motos', [
      `- Condición: ${motos.condicion}`,
      `- Marcas: ${motos.marcas.join(', ')}.`,
      ...motos.masBuscadas.map((m) => `- ${m.que}: ${m.detalle}`),
      `- Usadas: ${motos.usadas}`,
    ]),
    seccion('Formas de pago', [
      ...pagos.map((p) => `- ${p.forma}: ${p.detalle}`),
      `- ${negocio.pagosNota}`,
    ]),
    seccion('Bicicletas', [
      `- Tipos: ${bicicletas.tipos}`,
      `- Marcas: ${bicicletas.marcas.join(', ')}.`,
      `- Accesorios: ${bicicletas.accesorios}`,
      `- ${bicicletas.alquiler}`,
    ]),
    seccion('Taller', [
      `- ${taller.entrada}`,
      `- Service: ${taller.service.join(', ')}.`,
      `- Mecánica: ${taller.mecanica.join(', ')}.`,
      `- ${taller.ajenas}`,
    ]),
    seccion('Repuestos', [
      `- De moto: ${repuestos.moto}`,
      `- Cubiertas: ${repuestos.cubiertas}`,
      `- Cascos: ${repuestos.cascos}`,
      `- Por encargo: ${repuestos.encargo}`,
      `- Envíos: ${repuestos.envios}`,
    ]),
    seccion('Trámites', [
      `- Gestoría: ${tramites.gestoria}`,
      `- Seguros: ${tramites.seguros}`,
    ]),
    // Las secciones de la página, para poder citar el ancla exacta en vez de
    // la portada entera.
    seccion('Secciones del sitio', [
      `- [Motos](${siteUrl}/#motos): marcas, condición y las categorías más buscadas.`,
      `- [Bicicletas](${siteUrl}/#bicis): tipos, marcas, accesorios y alquiler.`,
      `- [Taller y repuestos](${siteUrl}/#taller): service, mecánica, cubiertas y cascos.`,
      `- [Horarios](${siteUrl}/#horarios): la semana completa, día por día.`,
      `- [Dónde estamos](${siteUrl}/#donde): dirección y mapa.`,
      `- [Contacto](${siteUrl}/#contacto): teléfono, WhatsApp e Instagram.`,
    ]),
    seccion('Estos mismos datos en JSON', [
      `- [Ficha del negocio en JSON](${siteUrl}/data/negocio.json)`,
      `- [Mapa del sitio](${siteUrl}/sitemap.xml)`,
      '',
      'Mismo origen que esta página y que el marcado JSON-LD: los tres se',
      'generan desde el archivo de datos del negocio, así que no pueden',
      'contradecirse.',
    ]),
    // Decirlo explícito evita que un modelo complete el hueco por su cuenta.
    seccion('Lo que este sitio no publica', [
      '- Precios y coeficientes de financiación: cambian seguido y se',
      '  consultan en el local.',
      '- Catálogo por modelo, con ficha técnica, stock o disponibilidad: se',
      '  publican las marcas y las categorías más buscadas, no unidades.',
    ]),
  ].join('\n');
}

export function GET(): Response {
  return new Response(cuerpo(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      // Mismo criterio que `/data/negocio.json`: el contenido cambia cuando el
      // dueño corrige un dato, o sea casi nunca. Revalidar en cada lectura
      // hacía trabajar al servidor de más sin ganar frescura.
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
