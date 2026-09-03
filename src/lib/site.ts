/**
 * URL pública del sitio. Necesaria para el sitemap, robots.txt, las URLs
 * canónicas y el marcado LocalBusiness, que exigen rutas absolutas.
 *
 * Se resuelve en dos pasos, en este orden:
 *
 * 1. `NEXT_PUBLIC_SITE_URL`, si está definida. Es la salida de emergencia: si
 *    el dominio cambia, se corrige desde Vercel sin tocar el código.
 * 2. `CANONICO`, la constante de acá abajo, en cualquier build que no sea de
 *    desarrollo. Es lo que se publica.
 *
 * En desarrollo la cascada termina en localhost, que es lo correcto ahí.
 *
 * A propósito NO se consulta `VERCEL_PROJECT_PRODUCTION_URL`, que Vercel
 * inyecta sola en el build. Parece la opción obvia y es una trampa: devuelve el
 * dominio más corto del proyecto, así que hoy devolvería `motosbeto.vercel.app`
 * y mañana lo que el proyecto tenga conectado, sin garantía de que sea el host
 * que elegimos. La canónica tiene que nombrar un host y siempre el mismo: dos
 * hosts sirviendo la misma página con canónicas distintas parten las señales en
 * dos y es peor que no declarar ninguna. Acá el host se elige, no se adivina.
 *
 * El host elegido es el ápex, sin `www`. `www.motosbeto.com` tiene que
 * redirigir acá, no servir la página.
 */
const CANONICO = 'https://motosbeto.com';

const crudo =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : CANONICO);

export const siteUrl = crudo.replace(/\/$/, '');

/** Verdadero cuando la URL resuelta es pública y no el servidor de desarrollo. */
export const esProduccion = !siteUrl.startsWith('http://localhost');
