/**
 * Medición de laboratorio con el estrangulado de PageSpeed móvil: 4G lento
 * (1,6 Mbps, 150 ms de latencia) y CPU cuatro veces más lenta. Sirve para
 * comparar dos versiones del sitio con el mismo apretón, que es lo único que
 * hace comparable un número de rendimiento.
 *
 *   node tools/medir-lab.mjs http://localhost:3100/
 */
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:3100/';

const nav = await chromium.launch();
const ctx = await nav.newContext({
  viewport: { width: 412, height: 823 },
  deviceScaleFactor: 1.75,
  isMobile: true,
  hasTouch: true,
});
const pag = await ctx.newPage();
const cdp = await ctx.newCDPSession(pag);
await cdp.send('Network.enable');
await cdp.send('Network.emulateNetworkConditions', {
  offline: false,
  latency: 150,
  downloadThroughput: Math.round((1.6 * 1024 * 1024) / 8),
  uploadThroughput: Math.round((750 * 1024) / 8),
  connectionType: 'cellular4g',
});
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

const piezas = [];
pag.on('response', async (r) => {
  const u = r.url();
  try {
    const b = await r.body();
    const tipo = /\.js(\?|$)/.test(u)
      ? 'js'
      : /\.css(\?|$)/.test(u)
        ? 'css'
        : /\.woff2/.test(u)
          ? 'fuente'
          : /_next\/image|\.(png|jpe?g|webp|avif|svg)/.test(u)
            ? 'imagen'
            : new URL(u).hostname.includes('google')
              ? 'mapa'
              : 'doc';
    piezas.push({ url: u, bytes: b.length, tipo });
  } catch {
    /* respuestas sin cuerpo */
  }
});

await pag.goto(base, { waitUntil: 'load' });
await pag.waitForTimeout(6000);

const metricas = await pag.evaluate(
  () =>
    new Promise((listo) => {
      let lcp = 0;
      let elemento = '';
      let cls = 0;
      const largas = [];

      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) {
          if (e.startTime > lcp) {
            lcp = e.startTime;
            elemento = `${e.element?.tagName ?? '?'} · ${(e.element?.textContent ?? '').trim().slice(0, 60)}`;
          }
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value;
      }).observe({ type: 'layout-shift', buffered: true });

      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) largas.push(Math.round(e.duration));
      }).observe({ type: 'longtask', buffered: true });

      setTimeout(() => {
        const nav = performance.getEntriesByType('navigation')[0];
        const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? 0;
        listo({
          ttfb: Math.round(nav.responseStart),
          fcp: Math.round(fcp),
          lcp: Math.round(lcp),
          lcpElemento: elemento,
          cls: Number(cls.toFixed(4)),
          tareasLargas: largas,
        });
      }, 500);
    }),
);

const porTipo = {};
for (const p of piezas) {
  porTipo[p.tipo] ??= { kb: 0, archivos: 0 };
  porTipo[p.tipo].kb += p.bytes / 1024;
  porTipo[p.tipo].archivos += 1;
}
for (const k of Object.keys(porTipo)) porTipo[k].kb = Math.round(porTipo[k].kb);

console.log(JSON.stringify({ ...metricas, peticiones: piezas.length, porTipo }, null, 2));

const listar = (tipo, tope = 99) => {
  const grupo = piezas.filter((p) => p.tipo === tipo).sort((a, b) => b.bytes - a.bytes);
  if (grupo.length === 0) return;
  console.log(`\n${tipo}:`);
  for (const p of grupo.slice(0, tope)) {
    console.log(`  ${String(Math.round(p.bytes / 1024)).padStart(4)} kB  ${p.url.replace(/^https?:\/\/[^/]+\//, '/').slice(0, 120)}`);
  }
};

listar('js', 8);
listar('imagen');
listar('fuente');
listar('mapa', 6);

await nav.close();
