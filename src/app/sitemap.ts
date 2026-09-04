import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

/**
 * El mapa del sitio: una sola URL, porque el sitio es una sola página.
 *
 * No lleva `lastmod`, y es a propósito. Antes decía `new Date()`, o sea la hora
 * del build: cualquier redespliegue —una clase de Tailwind, una dependencia al
 * día, un rebuild vacío— reescribía la fecha como si el negocio hubiera
 * cambiado un dato. Google usa `lastmod` sólo mientras le cierra con la
 * modificación real de la página, y cuando no le cierra deja de mirarlo en todo
 * el sitio: una fecha siempre falsa quema la única señal de frescura que un
 * sitemap puede dar, justo para el día en que sí cambie un horario.
 *
 * Tampoco se pone una fecha a mano, que es la otra salida posible: se pudre
 * sola —nadie se acuerda de tocarla al editar `data/negocio.js`— y una fecha
 * vieja miente igual que una nueva. El campo es opcional; ausente es honesto.
 *
 * `changefreq` y `priority` tampoco están: Google declara que los ignora, y son
 * bytes que no dicen nada. Sacarlos es prolijidad, no una mejora de posición.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${siteUrl}/` }];
}
