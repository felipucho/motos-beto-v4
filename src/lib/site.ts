/**
 * URL pública del sitio. Necesaria para el sitemap, robots.txt, las URLs
 * canónicas y el marcado LocalBusiness, que exigen rutas absolutas.
 *
 * Definir NEXT_PUBLIC_SITE_URL en Vercel antes de publicar. Sin esa variable
 * el sitio funciona igual en desarrollo, pero las URLs absolutas apuntan a
 * localhost y el SEO no sirve.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
).replace(/\/$/, '');

export const esProduccion = Boolean(process.env.NEXT_PUBLIC_SITE_URL);
