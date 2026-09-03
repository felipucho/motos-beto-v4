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
      `- Teléfono: ${negocio.telefonoTexto} (${negocio.telefonoLink.replace('tel:', '')})`,
      `- WhatsApp: ${negocio.whatsappTexto}`,
      `- Instagram: ${negocio.instagramUsuario} — ${negocio.instagramLink}`,
      `- Mapa: ${negocio.mapaLink}`,
      `- Sitio: ${siteUrl}`,
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
  ].join('\n');
}

export function GET(): Response {
  return new Response(cuerpo(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
