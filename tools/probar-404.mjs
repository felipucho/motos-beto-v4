import { chromium } from 'playwright';
const nav = await chromium.launch();
for (const [nombre, v] of [['404-escritorio', { width: 1280, height: 800 }], ['404-telefono', { width: 390, height: 844 }]]) {
  const ctx = await nav.newContext({ viewport: v, locale: 'es-AR' });
  const pag = await ctx.newPage();
  const errores = [];
  pag.on('pageerror', (e) => errores.push(e.message));
  const resp = await pag.goto('http://localhost:3000/no-existe', { waitUntil: 'networkidle' });
  await pag.evaluate(() => document.fonts.ready);
  await pag.screenshot({ path: `${process.argv[2]}/${nombre}.png` });
  const desborde = await pag.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  console.log(`${nombre}: HTTP ${resp.status()} · desborde ${desborde} · errores ${errores.length}`);
  await ctx.close();
}
await nav.close();
