/**
 * URL pública del sitio. Necesaria para el sitemap, robots.txt, las URLs
 * canónicas y el marcado LocalBusiness, que exigen rutas absolutas.
 *
 * Se resuelve en cascada, de lo más específico a lo más genérico:
 *
 * 1. `NEXT_PUBLIC_SITE_URL`: el dominio propio, cuando exista. Es la única que
 *    hay que definir a mano, y manda sobre todo lo demás.
 * 2. `VERCEL_PROJECT_PRODUCTION_URL`: la Vercel la inyecta sola en el build y
 *    siempre apunta al dominio de producción del proyecto, nunca al de una
 *    vista previa. Viene sin protocolo, así que se le antepone https.
 * 3. `PRODUCCION`: la dirección publicada hoy, como último recurso. Está acá
 *    para que un build de producción no pueda emitir `localhost` aunque falte
 *    toda la configuración: una canónica a localhost desindexa el sitio.
 *
 * En desarrollo la cascada termina en localhost, que es lo correcto ahí.
 */
const PRODUCCION = 'https://motosbeto.vercel.app';

const dominioVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;

const crudo =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (dominioVercel ? `https://${dominioVercel}` : '') ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : PRODUCCION);

export const siteUrl = crudo.replace(/\/$/, '');

/** Verdadero cuando la URL resuelta es pública y no el servidor de desarrollo. */
export const esProduccion = !siteUrl.startsWith('http://localhost');
