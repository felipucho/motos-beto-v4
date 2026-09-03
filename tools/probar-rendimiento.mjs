import { chromium } from 'playwright';

const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true });
const pag = await ctx.newPage();

let bytes = 0;
const porTipo = {};
pag.on('response', async (r) => {
  try {
    const b = (await r.body()).length;
    const t = new URL(r.url()).hostname === 'localhost' ? (r.url().match(/\.(\w+)(\?|$)/)?.[1] ?? 'doc') : 'externo';
    bytes += b;
    porTipo[t] = (porTipo[t] ?? 0) + b;
  } catch { /* respuestas sin cuerpo */ }
});

await pag.goto('http://localhost:3000/', { waitUntil: 'load' });
await pag.waitForTimeout(2500);

const metricas = await pag.evaluate(
  () =>
    new Promise((resolve) => {
      let lcp = 0;
      let cls = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries()) lcp = Math.max(lcp, e.startTime); })
        .observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; })
        .observe({ type: 'layout-shift', buffered: true });
      setTimeout(() => {
        const nav = performance.getEntriesByType('navigation')[0];
        const fcp = performance.getEntriesByName('first-contentful-paint')[0];
        resolve({
          lcp: Math.round(lcp),
          cls: Number(cls.toFixed(4)),
          fcp: Math.round(fcp?.startTime ?? 0),
          domInteractivo: Math.round(nav.domInteractive),
          nodos: document.querySelectorAll('*').length,
        });
      }, 1200);
    }),
);

console.log(JSON.stringify({ ...metricas, kbTotal: Math.round(bytes / 1024), porTipoKb: Object.fromEntries(Object.entries(porTipo).map(([k, v]) => [k, Math.round(v / 1024)])) }, null, 2));

const fallas = [];
if (metricas.lcp > 2500) fallas.push(`LCP ${metricas.lcp} ms (umbral 2500)`);
if (metricas.cls > 0.1) fallas.push(`CLS ${metricas.cls} (umbral 0.1)`);
console.log(fallas.length ? `FALLAS:\n- ${fallas.join('\n- ')}` : 'RENDIMIENTO OK');
await nav.close();
process.exitCode = fallas.length ? 1 : 0;
