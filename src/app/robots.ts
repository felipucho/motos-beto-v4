import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

/**
 * Rastreadores de modelos de lenguaje, nombrados uno por uno.
 *
 * La regla `*` de abajo ya los alcanza, pero conviene la línea propia por dos
 * motivos: varios de estos agentes leen el archivo buscando su nombre antes que
 * el comodín, y Google separa el uso en IA (`Google-Extended`) del índice de
 * búsqueda, así que sin esa línea el sitio puede salir en los resultados y
 * quedar afuera de las respuestas generadas.
 *
 * Para un negocio de pueblo esa es justo la vitrina que interesa: la respuesta
 * a "dónde arreglo la moto en Las Varillas" la escribe cada vez más un modelo y
 * no una lista de enlaces. Acá no hay nada que proteger —el sitio publica
 * dirección, teléfono y horarios a propósito—, así que se los admite explícito.
 *
 * Cada rastreador va con su agente de consulta en vivo (`*-User`), que es el
 * que entra cuando una persona pregunta por el negocio en ese momento.
 */
const AGENTES_IA = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: AGENTES_IA, allow: '/' },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
