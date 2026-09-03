/**
 * El mapa y los tres enlaces de ubicación.
 *
 * Lo primero comprueba que el iframe cargue y que no lo bloquee la política de
 * seguridad. Lo segundo es lo que se rompió en la práctica: los enlaces tienen
 * que caer en la ficha del negocio, no en una búsqueda por texto que puede dar
 * cualquier cosa. Por eso se siguen de verdad y se lee el título de Google.
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:3000/';
const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1280, height: 900 }, locale: 'es-AR' });
const pag = await ctx.newPage();
const fallas = [];

const violaciones = [];
pag.on('console', (m) => {
  if (/Content Security Policy|Refused to/i.test(m.text())) violaciones.push(m.text().slice(0, 200));
});

await pag.goto(BASE, { waitUntil: 'networkidle' });
await pag.locator('#donde').scrollIntoViewIfNeeded();
await pag.waitForTimeout(4500);

const pintado = await pag.evaluate(() => {
  const f = document.querySelector('#donde iframe');
  const r = f.getBoundingClientRect();
  return { alto: Math.round(r.height), ancho: Math.round(r.width), cargado: f.contentWindow !== null };
});
if (!pintado.cargado || pintado.alto < 200) fallas.push(`iframe: ${JSON.stringify(pintado)}`);

// Google dibuja el mapa en un canvas, así que el rótulo no se puede leer como
// texto. Lo que sí se puede comprobar es a dónde navegó el marco: la URL del
// mapa embebido lleva el punto en claro, y tiene que ser el del negocio.
let marco = null;
for (let intento = 0; intento < 12 && !marco; intento += 1) {
  marco = pag.frames().find((f) => f.url().includes('/maps/embed')) ?? null;
  if (!marco) await pag.waitForTimeout(1000);
}
if (!marco) {
  fallas.push('mapa embebido: el iframe nunca navegó a /maps/embed');
} else {
  const url = decodeURIComponent(marco.url());
  if (!url.includes('!2d-62.7188429') || !url.includes('!3d-31.8769593')) {
    fallas.push(`mapa embebido: el punto no es el del negocio (${url.slice(0, 120)})`);
  }
}

if (process.argv[2]) await pag.locator('#donde').screenshot({ path: process.argv[2] });

// Los enlaces, seguidos de verdad hasta Google.
const enlaces = await pag.evaluate(() =>
  [...document.querySelectorAll('a[href*="google.com/maps"], a[href*="maps.google"]')].map((a) => ({
    texto: a.textContent.trim().slice(0, 30),
    href: a.href,
  })),
);
if (enlaces.length === 0) fallas.push('no hay enlaces a Google Maps en la página');

for (const { texto, href } of enlaces) {
  const p = await ctx.newPage();
  try {
    await p.goto(href, { waitUntil: 'domcontentloaded', timeout: 40000 });
    await p.waitForTimeout(6000);
    const titulo = await p.title();
    const ok = /Motos Beto/i.test(titulo);
    console.log(`${ok ? 'ok  ' : 'MAL '} ${texto.padEnd(14)} → ${titulo}`);
    if (!ok) fallas.push(`enlace "${texto}": Google abrió «${titulo}»`);
  } catch (e) {
    fallas.push(`enlace "${texto}": ${String(e).slice(0, 80)}`);
  }
  await p.close();
}

console.log(violaciones.length ? `VIOLACIONES CSP:\n- ${violaciones.join('\n- ')}` : 'sin violaciones de CSP');
if (violaciones.length) fallas.push('hay violaciones de CSP');

await nav.close();
console.log(fallas.length ? `FALLAS:\n- ${fallas.join('\n- ')}` : 'MAPA OK');
process.exitCode = fallas.length ? 1 : 0;
