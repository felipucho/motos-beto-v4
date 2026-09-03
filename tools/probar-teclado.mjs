import { chromium } from 'playwright';

const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1280, height: 800 }, locale: 'es-AR' });
const pag = await ctx.newPage();
await pag.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await pag.waitForTimeout(500);

const fallas = [];
const orden = [];

for (let i = 0; i < 22; i += 1) {
  await pag.keyboard.press('Tab');
  // Las transiciones de color duran 200 ms: medir antes lee un valor intermedio.
  await pag.waitForTimeout(320);
  const info = await pag.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const e = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      etiqueta: (el.textContent || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 38),
      contorno: `${e.outlineStyle} ${e.outlineWidth} ${e.outlineColor}`,
      visible: r.width > 0 && r.height > 0 && r.top > -80,
      tag: el.tagName.toLowerCase(),
    };
  });
  if (!info) break;
  orden.push(`${i + 1}. ${info.tag} · ${info.etiqueta} · ${info.contorno}`);
  // El iframe del mapa es de Google: Chromium no aplica el contorno de autor
  // sobre el elemento, y el mismo destino está a un enlace propio con foco
  // visible ("Abrir en Google Maps"). No se cuenta como falla.
  // El anillo es siempre de 3px y siempre de una de las tintas del afiche: la
  // tinta sobre papel, el naranja vivo sobre plano oscuro, el papel sobre
  // naranja. Cada plano elige la suya, porque el contraste depende de sobre
  // qué se imprime.
  const ANILLOS = [/25, 23, 19/, /232, 118, 58/, /245, 243, 239/];
  if (
    info.tag !== 'iframe' &&
    (info.contorno.startsWith('none') ||
      !/3px/.test(info.contorno) ||
      !ANILLOS.some((tinta) => tinta.test(info.contorno)))
  ) {
    fallas.push(`sin anillo de foco visible: ${info.etiqueta} · ${info.contorno}`);
  }
  if (!info.visible) fallas.push(`foco en elemento fuera de vista: ${info.etiqueta}`);
}

// El primer Tab tiene que dar el salto al contenido.
if (!orden[0]?.includes('Saltar al contenido')) {
  fallas.push(`el primer foco no es el salto al contenido, es: ${orden[0]}`);
}

console.log(orden.join('\n'));
console.log(fallas.length ? `\nFALLAS:\n- ${fallas.join('\n- ')}` : '\nTECLADO OK');
await nav.close();
process.exitCode = fallas.length ? 1 : 0;
