/**
 * Comprueba el comportamiento: el subrayado que sigue a la sección que se está
 * mirando, la regla del encabezado que se afirma al desplazarse, y la pasada de
 * tinta del reloj de la semana.
 *
 * También comprueba lo contrario, que importa más: con `prefers-reduced-motion`
 * y sin JavaScript, todo el contenido tiene que estar visible igual. En este
 * mundo la pasada no puede tapar nada: lo único que crece son las barras de
 * tinta del reloj, que son la parte redundante —la tabla dice lo mismo con
 * palabras—, así que ninguna sección se esconde jamás esperando el scroll.
 */
import { chromium } from 'playwright';
import { leerNegocio } from './leer-marcado.mjs';

const BASE = 'http://localhost:3000';
const nav = await chromium.launch();
const fallas = [];

async function nueva(opciones = {}) {
  const ctx = await nav.newContext({
    viewport: { width: 1280, height: 800 },
    locale: 'es-AR',
    timezoneId: 'America/Argentina/Cordoba',
    ...opciones,
  });
  const pag = await ctx.newPage();
  await pag.goto(BASE, { waitUntil: 'networkidle' });
  return { ctx, pag };
}

// --- 1. El subrayado sigue a la sección visible ----------------------------
{
  const { ctx, pag } = await nueva();
  const marcada = async () =>
    pag.evaluate(
      () =>
        document.querySelector('header nav a[aria-current="true"]')?.getAttribute('href') ?? null,
    );

  const ESPERADO = {
    motos: '#motos',
    bicis: '#bicis',
    taller: '#taller',
    horarios: '#horarios',
    donde: '#donde',
    contacto: '#contacto',
  };

  for (const [id, esperado] of Object.entries(ESPERADO)) {
    await pag.evaluate((s) => document.getElementById(s).scrollIntoView(), id);
    await pag.waitForTimeout(700);
    const actual = await marcada();
    if (actual !== esperado) fallas.push(`navegación: mirando #${id}, marcado ${actual}`);
  }

  await pag.evaluate(() => window.scrollTo(0, 0));
  await pag.waitForTimeout(600);
  const arriba = await marcada();
  if (arriba !== null) fallas.push(`navegación: arriba de todo no debería marcar nada, marca ${arriba}`);

  await ctx.close();
}

// --- 2. La regla del encabezado se afirma al desplazarse -------------------
{
  const { ctx, pag } = await nueva();
  const borde = () =>
    pag.evaluate(() => getComputedStyle(document.querySelector('header')).borderBottomColor);

  const quieto = await borde();
  await pag.evaluate(() => window.scrollTo(0, 600));
  await pag.waitForTimeout(500);
  const movido = await borde();

  if (quieto === movido) fallas.push(`encabezado: la regla no cambia al desplazarse (${quieto})`);
  await ctx.close();
}

// --- 3. La pasada del reloj: entra creciendo y termina entera -------------
{
  const { ctx, pag } = await nueva();

  // Ancho total de las barras de tinta del reloj, en píxeles reales.
  const anchoTramos = () =>
    pag.evaluate(() =>
      [...document.querySelectorAll('#horarios .reloj-tramo')].reduce(
        (suma, el) => suma + el.getBoundingClientRect().width,
        0,
      ),
    );

  const cuantosTramos = await pag.evaluate(
    () => document.querySelectorAll('#horarios .reloj-tramo').length,
  );
  if (cuantosTramos === 0) fallas.push('reloj: no se dibujó ninguna barra de tinta');

  const antes = await anchoTramos();
  if (antes > 1) fallas.push(`reloj: las barras ya estaban puestas sin haber llegado (${antes}px)`);

  // Ninguna sección se esconde entera: el envoltorio de la pasada sólo puede
  // estar adentro del reloj.
  const envueltas = await pag.evaluate(() =>
    ['#motos', '#bicis', '#taller', '#donde', '#contacto'].filter((sel) =>
      document.querySelector(sel)?.closest('.revelar'),
    ),
  );
  if (envueltas.length) fallas.push(`revelado: ${envueltas.join(', ')} no deberían estar envueltos`);

  // Y las filas del reloj, la escala y los días nacen visibles: son el dato.
  const pistas = await pag.evaluate(() =>
    [...document.querySelectorAll('#horarios .reloj-pista')].filter(
      (el) => el.getBoundingClientRect().width < 20,
    ).length,
  );
  if (pistas > 0) fallas.push(`reloj: ${pistas} pistas escondidas, deberían ser 0`);

  await pag.evaluate(async () => {
    const alto = document.body.scrollHeight;
    for (let y = 0; y < alto; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
  });
  await pag.waitForTimeout(1400);

  const despues = await anchoTramos();
  if (despues <= antes) fallas.push(`reloj: las barras no crecieron (${antes} -> ${despues})`);

  await ctx.close();
}

// --- 4. Menos movimiento: nada se esconde nunca ----------------------------
{
  const { ctx, pag } = await nueva({ reducedMotion: 'reduce' });
  const r = await pag.evaluate(() => ({
    tramos: [...document.querySelectorAll('.reloj-tramo')].length,
    puestos: [...document.querySelectorAll('.reloj-tramo')].filter(
      (el) => el.getBoundingClientRect().width > 1,
    ).length,
    chapa: document.querySelector('.pasada')?.getBoundingClientRect().width ?? 0,
  }));
  if (r.tramos !== r.puestos) {
    fallas.push(`menos movimiento: ${r.tramos - r.puestos} barras escondidas, deberían ser 0`);
  }
  if (r.chapa < 20) fallas.push(`menos movimiento: la chapa quedó tapada (${r.chapa}px)`);
  await ctx.close();
}

// --- 5. Sin JavaScript: la página entera se lee -----------------------------
{
  const ctx = await nav.newContext({ viewport: { width: 1280, height: 800 }, javaScriptEnabled: false });
  const pag = await ctx.newPage();
  await pag.goto(BASE, { waitUntil: 'domcontentloaded' });
  await pag.waitForTimeout(500);

  const r = await pag.evaluate(() => ({
    bandera: document.documentElement.dataset.js ?? null,
    escondidas: [...document.querySelectorAll('.reloj-tramo')].filter(
      (el) => el.getBoundingClientRect().width < 1,
    ).length,
    // Un centinela por sección, para que el día que una deje de renderizarse
    // en el servidor la prueba diga cuál, y no sólo que "falta contenido".
    // El texto se compara en minúsculas: los titulares se imprimen en caja
    // alta con `text-transform`, así que innerText los devuelve en mayúsculas
    // aunque en el marcado estén escritos normal.
    faltantes: ['Subagente multimarca', 'Bicicletas', 'Taller y repuestos', 'gestora propia']
      .filter((frase) => !document.body.innerText.toLowerCase().includes(frase.toLowerCase())),
    filas: document.querySelectorAll('#horarios tbody tr').length,
  }));

  if (r.bandera !== null) fallas.push(`sin JS: la bandera data-js quedó puesta (${r.bandera})`);
  if (r.escondidas > 0) fallas.push(`sin JS: ${r.escondidas} barras del reloj escondidas`);
  if (r.faltantes.length) fallas.push(`sin JS: no se renderizó ${r.faltantes.join(', ')}`);
  if (r.filas !== 3) fallas.push(`sin JS: la tabla tiene ${r.filas} filas, deberían ser 3`);

  await ctx.close();
}

// --- 6. El marcado declara la ubicación real -------------------------------
{
  const { ctx, pag } = await nueva();
  const { negocio: ld } = await leerNegocio(pag);
  if (!ld.geo || ld.geo['@type'] !== 'GeoCoordinates') fallas.push('marcado: falta geo');
  else if (ld.geo.latitude !== -31.8769593 || ld.geo.longitude !== -62.7188429) {
    fallas.push(`marcado: coordenadas ${ld.geo.latitude}, ${ld.geo.longitude}`);
  }
  await ctx.close();
}

// --- 7. WhatsApp no satura --------------------------------------------------
{
  const { ctx, pag } = await nueva();
  const cuenta = await pag.evaluate(() => ({
    enlaces: document.querySelectorAll('a[href*="wa.me"]').length,
    palabra: (document.body.innerText.match(/whatsapp/gi) ?? []).length,
  }));
  console.log(`enlaces a WhatsApp: ${cuenta.enlaces} · veces que aparece la palabra: ${cuenta.palabra}`);
  if (cuenta.enlaces > 3) fallas.push(`WhatsApp: ${cuenta.enlaces} enlaces, máximo 3`);
  await ctx.close();
}

await nav.close();
console.log(fallas.length ? `FALLAS:\n- ${fallas.join('\n- ')}` : 'REACTIVIDAD OK');
process.exitCode = fallas.length ? 1 : 0;
