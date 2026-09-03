import { chromium } from 'playwright';

const vistas = [
  { archivo: 'desktop.png', viewport: { width: 1440, height: 900 }, dsf: 1 },
  { archivo: 'mobile.png', viewport: { width: 390, height: 844 }, dsf: 2 },
];

const nav = await chromium.launch();
for (const v of vistas) {
  const ctx = await nav.newContext({
    viewport: v.viewport,
    deviceScaleFactor: v.dsf,
    locale: 'es-AR',
    timezoneId: 'America/Argentina/Cordoba',
    isMobile: v.viewport.width < 800,
    // La animación de entrada tiene que estar resuelta antes de capturar.
    reducedMotion: 'reduce',
  });
  const pag = await ctx.newPage();
  await pag.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await pag.evaluate(() => document.fonts.ready);
  await pag.evaluate(async () => {
    const alto = document.body.scrollHeight;
    for (let y = 0; y < alto; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 70)); }
    window.scrollTo(0, 0);
  });
  // El mapa es un iframe de terceros. Dos cuidados: hay que darle tiempo a
  // pintar, y no se puede capturar con `fullPage`, que redimensiona el viewport
  // y deja el marco en blanco. En su lugar el viewport se estira hasta la
  // altura del documento y se captura una pantalla común.
  await pag.locator('#donde').scrollIntoViewIfNeeded();
  for (let intento = 0; intento < 20; intento += 1) {
    if (pag.frames().some((f) => f.url().includes('/maps/embed'))) break;
    await pag.waitForTimeout(500);
  }
  await pag.waitForTimeout(6000);

  const alto = await pag.evaluate(() => document.body.scrollHeight);
  await pag.setViewportSize({ width: v.viewport.width, height: alto });
  await pag.evaluate(() => window.scrollTo(0, 0));
  await pag.waitForTimeout(4000);
  await pag.screenshot({ path: `.impeccable/review/${v.archivo}` });
  console.log(`${v.archivo} listo`);
  await ctx.close();
}
await nav.close();
