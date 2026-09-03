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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
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
