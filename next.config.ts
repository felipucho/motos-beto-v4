import type { NextConfig } from 'next';

/**
 * Política de seguridad de contenido.
 *
 * El sitio es estático y no recibe datos de nadie, así que se puede cerrar casi
 * todo. Las dos excepciones son reales y están acotadas:
 *
 * - `'unsafe-inline'` en scripts: Next.js inyecta su propio arranque en línea y
 *   el marcado LocalBusiness va en un `<script type="application/ld+json">`. No
 *   hay entrada de usuario en ninguna página, así que no hay vector de
 *   inyección que esto habilite.
 * - `frame-src` y `img-src` de Google: el mapa embebido.
 *
 * Sacar `'unsafe-inline'` exige un `nonce` por respuesta, y un nonce exige
 * renderizar en cada visita: el sitio dejaría de ser estático y el TTFB pasaría
 * de milisegundos a decenas. Para una página sin formularios, sin sesión y sin
 * un solo dato de usuario, el intercambio no cierra.
 *
 * Por la misma razón no se declara `require-trusted-types-for 'script'`: el
 * arranque de Next.js y el marcado JSON-LD escriben por `innerHTML`, y activarlo
 * rompería el hidratado sin cerrar ningún agujero real acá.
 *
 * `style-src` acepta `'unsafe-inline'` porque el CSS crítico va incrustado en
 * el HTML —ver `inlineCss` más abajo—.
 *
 * Las tipografías las sirve el propio dominio (next/font las descarga en el
 * build), así que no hace falta abrir ningún origen de fuentes.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://maps.gstatic.com https://*.googleapis.com https://*.google.com",
  "font-src 'self'",
  "connect-src 'self'",
  'frame-src https://www.google.com',
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  'upgrade-insecure-requests',
].join('; ');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  experimental: {
    /**
     * El CSS del sitio entero pesa 7 kB comprimido: menos que la cabecera de la
     * petición que hace falta para ir a buscarlo. Como hoja aparte bloquea el
     * primer pintado durante un viaje de ida y vuelta completo —150 ms de
     * latencia en un 4G de pueblo—; incrustado en el HTML llega con el
     * documento y el navegador pinta en cuanto lo termina de leer.
     *
     * Es un intercambio que sólo conviene con una hoja chica, que es el caso.
     */
    inlineCss: true,
  },

  images: {
    // AVIF primero: la marca son dos tintas planas sobre transparencia, que es
    // exactamente lo que ese formato comprime bien. El PNG original de 157 kB
    // termina en unos pocos kB sin perder el filo de los bordes.
    formats: ['image/avif', 'image/webp'],
    // Los anchos que el sitio pide de verdad. Sin el 208 y el 416 el navegador
    // tenía que saltar al 640 para cubrir la marca del encabezado —que se ve a
    // 202 px en el teléfono y a 252 en el escritorio— y bajaba tres veces más
    // píxeles de los que iba a pintar.
    imageSizes: [16, 32, 48, 64, 96, 128, 208, 256, 384, 416, 512],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Corta el vínculo con la ventana que abrió esta: nadie que enlace al
          // sitio queda con un `window.opener` para manipularlo. No afecta al
          // mapa, que es un iframe y no una ventana.
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          // Los recursos propios —fuentes, imágenes, JSON— no se pueden incrustar
          // desde otro dominio. `same-site` y no `same-origin` para no romper un
          // eventual subdominio del propio negocio.
          { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
