import { chromium, devices } from 'playwright';
import fs from 'node:fs';

const BASE = 'http://localhost:3000';
const SHOTS = process.argv[2] ?? '.impeccable/review/anchos';

const perfiles = [
  { nombre: 'escritorio', viewport: { width: 1440, height: 900 }, dsf: 1 },
  { nombre: 'notebook', viewport: { width: 1280, height: 800 }, dsf: 1 },
  { nombre: 'tablet', viewport: { width: 834, height: 1112 }, dsf: 2 },
  { nombre: 'telefono', viewport: { width: 390, height: 844 }, dsf: 3 },
  { nombre: 'telefono-chico', viewport: { width: 320, height: 640 }, dsf: 2 },
];

const navegador = await chromium.launch();
const problemas = [];

for (const perfil of perfiles) {
  const contexto = await navegador.newContext({
    viewport: perfil.viewport,
    deviceScaleFactor: perfil.dsf,
    locale: 'es-AR',
    timezoneId: 'America/Argentina/Cordoba',
    isMobile: perfil.viewport.width < 800,
    hasTouch: perfil.viewport.width < 800,
  });

  const pagina = await contexto.newPage();
  const consola = [];
  pagina.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') consola.push(`[${m.type()}] ${m.text()}`);
  });
  pagina.on('pageerror', (e) => consola.push(`[pageerror] ${e.message}`));
  pagina.on('requestfailed', (r) => {
    const u = r.url();
    if (!u.includes('google.com/maps')) consola.push(`[requestfailed] ${u} :: ${r.failure()?.errorText}`);
  });

  await pagina.goto(BASE, { waitUntil: 'networkidle' });
  await pagina.waitForTimeout(700);

  // Recorrer la página entera para que el mapa diferido cargue antes de la foto.
  await pagina.evaluate(async () => {
    const alto = document.body.scrollHeight;
    for (let y = 0; y < alto; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await pagina.waitForTimeout(2500);

  // Desbordamiento horizontal: el cuerpo nunca puede scrollear de costado.
  const desborde = await pagina.evaluate(() => {
    const de = document.documentElement;
    const culpables = [];
    if (de.scrollWidth > de.clientWidth + 1) {
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect();
        if (r.right > de.clientWidth + 1 || r.left < -1) {
          culpables.push(`${el.tagName.toLowerCase()}.${(el.className || '').toString().slice(0, 60)} → ${Math.round(r.left)}..${Math.round(r.right)}`);
        }
      }
    }
    return { ancho: de.scrollWidth, visible: de.clientWidth, culpables: culpables.slice(0, 6) };
  });

  if (desborde.ancho > desborde.visible + 1) {
    problemas.push(`${perfil.nombre}: scroll horizontal ${desborde.ancho} > ${desborde.visible}\n    ${desborde.culpables.join('\n    ')}`);
  }

  // Objetivos táctiles por debajo del mínimo de WCAG 2.2 AA (24×24).
  if (perfil.viewport.width < 800) {
    const chicos = await pagina.evaluate(() =>
      [...document.querySelectorAll('a, button')]
        .map((el) => ({ t: el.textContent.trim().slice(0, 30), r: el.getBoundingClientRect() }))
        .filter(({ r }) => r.width > 0 && (r.height < 24 || r.width < 24))
        .map(({ t, r }) => `${t || '(sin texto)'} → ${Math.round(r.width)}×${Math.round(r.height)}`),
    );
    if (chicos.length) problemas.push(`${perfil.nombre}: objetivos táctiles chicos:\n    ${chicos.join('\n    ')}`);
  }

  if (consola.length) problemas.push(`${perfil.nombre}: consola:\n    ${[...new Set(consola)].join('\n    ')}`);

  await pagina.screenshot({ path: `${SHOTS}/${perfil.nombre}.png`, fullPage: true });
  await pagina.screenshot({ path: `${SHOTS}/${perfil.nombre}-viewport.png` });

  if (perfil.nombre === 'escritorio') {
    const info = await pagina.evaluate(() => ({
      chip: document.body.innerText.match(/(Abierto ahora[^\n]*|Cerrado[^\n]*)/)?.[0] ?? null,
      h1: document.querySelector('h1')?.textContent?.trim(),
      titulo: document.title,
      encabezados: [...document.querySelectorAll('h1,h2,h3')].map((h) => `${h.tagName} ${h.textContent.trim().slice(0, 48)}`),
      ldjson: document.querySelector('script[type="application/ld+json"]')?.textContent,
      contrato: [...document.body.childNodes].some((n) => n.nodeType === 1 && n.innerHTML?.includes('IMPECCABLE')),
      filaHoy: document.querySelector('tr[aria-current="date"]')?.innerText?.replace(/\n/g, ' | '),
      lang: document.documentElement.lang,
    }));
    fs.writeFileSync(`${SHOTS}/info.json`, JSON.stringify(info, null, 2));
  }

  await contexto.close();
}

await navegador.close();

fs.writeFileSync(`${SHOTS}/problemas.txt`, problemas.length ? problemas.join('\n\n') : 'sin problemas');
console.log(problemas.length ? problemas.join('\n\n') : 'SIN PROBLEMAS');
