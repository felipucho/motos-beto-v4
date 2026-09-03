import { chromium } from 'playwright';
const nav = await chromium.launch();
const pag = await (await nav.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
await pag.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await pag.evaluate(() => document.fonts.ready);
const r = await pag.evaluate(() => {
  const ver = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return { sel, familia: 'FALTA EL SELECTOR', peso: null, ancho: null };
    const cs = getComputedStyle(el);
    return {
      sel,
      familia: cs.fontFamily.split(',')[0],
      peso: cs.fontWeight,
      ancho: cs.fontStretch,
    };
  };
  return {
    muestras: ['h1', 'h2', 'p', '.rotulo', '.cartel', 'header nav a', 'tbody th'].map(ver),
    variables: [...document.fonts].map((f) => `${f.family} ${f.weight} ${f.status}`),
  };
});
console.log(JSON.stringify(r, null, 2));
await nav.close();
