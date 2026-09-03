import { chromium } from 'playwright';
import { gzipSync } from 'node:zlib';

const nav = await chromium.launch();
const pag = await (await nav.newContext({ viewport: { width: 390, height: 844 } })).newPage();
const piezas = [];
pag.on('response', async (r) => {
  if (!r.url().startsWith('http://localhost:3000/')) return;
  const tipo = r.url().endsWith('.js') ? 'js' : r.url().endsWith('.css') ? 'css' : r.url().includes('.woff2') ? 'fuente' : 'doc';
  try {
    const b = await r.body();
    piezas.push({ tipo, crudo: b.length, comprimido: gzipSync(b).length });
  } catch { /* sin cuerpo */ }
});
await pag.goto('http://localhost:3000/', { waitUntil: 'load' });
await pag.waitForTimeout(1500);
const resumen = {};
for (const p of piezas) {
  resumen[p.tipo] ??= { crudoKb: 0, gzipKb: 0, archivos: 0 };
  resumen[p.tipo].crudoKb += p.crudo / 1024;
  resumen[p.tipo].gzipKb += p.comprimido / 1024;
  resumen[p.tipo].archivos += 1;
}
for (const k of Object.keys(resumen)) {
  resumen[k].crudoKb = Math.round(resumen[k].crudoKb);
  resumen[k].gzipKb = Math.round(resumen[k].gzipKb);
}
console.log(JSON.stringify(resumen, null, 2));
await nav.close();
