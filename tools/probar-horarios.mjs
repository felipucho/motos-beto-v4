/**
 * Prueba el motor de horarios contra la página real, con el reloj congelado.
 * Argentina está en UTC-3 todo el año, así que la hora local del negocio es la
 * hora UTC menos tres.
 */
import { chromium } from 'playwright';
import { negocio } from '../data/negocio.js';

const BASE = 'http://localhost:3000';

// A noventa minutos del cierre el chip deja de decir la hora y pasa a decir
// cuánto falta, así que los casos cubren los dos lados de ese límite y los tres
// formatos de duración: minutos sueltos, una hora justa y horas con resto.
const casos = [
  { cuando: '2026-09-01T13:00:00Z', dia: 'martes 10:00', espera: 'Abierto ahora · cierra 12:30' },
  { cuando: '2026-09-01T16:00:00Z', dia: 'martes 13:00', espera: 'Cerrado · abre a las 15:30' },
  { cuando: '2026-09-01T20:59:00Z', dia: 'martes 17:59', espera: 'Abierto ahora · cierra 19:30' },
  { cuando: '2026-09-01T21:00:00Z', dia: 'martes 18:00', espera: 'Abierto · cierra en 1 h 30' },
  { cuando: '2026-09-01T21:30:00Z', dia: 'martes 18:30', espera: 'Abierto · cierra en 1 hora' },
  { cuando: '2026-09-01T22:00:00Z', dia: 'martes 19:00', espera: 'Abierto · cierra en 30 minutos' },
  { cuando: '2026-09-01T23:00:00Z', dia: 'martes 20:00', espera: 'Cerrado · abre el miércoles a las 8:30' },
  { cuando: '2026-09-05T14:00:00Z', dia: 'sábado 11:00', espera: 'Abierto · cierra en 1 h 30' },
  { cuando: '2026-09-05T16:00:00Z', dia: 'sábado 13:00', espera: 'Cerrado · abre el lunes a las 8:30' },
  { cuando: '2026-09-06T14:00:00Z', dia: 'domingo 11:00', espera: 'Cerrado · abre el lunes a las 8:30' },
];

const navegador = await chromium.launch();
const fallas = [];

for (const caso of casos) {
  const contexto = await navegador.newContext({
    locale: 'es-AR',
    timezoneId: 'America/Argentina/Cordoba',
    viewport: { width: 1280, height: 800 },
  });
  await contexto.clock.install({ time: new Date(caso.cuando) });

  const pagina = await contexto.newPage();
  await pagina.goto(BASE, { waitUntil: 'networkidle' });
  await pagina.waitForTimeout(400);

  const texto = await pagina
    .locator('header + div, body')
    .first()
    .evaluate(() => {
      const nodo = [...document.querySelectorAll('span')].find((s) =>
        /^(Abierto|Cerrado)/.test(s.textContent.trim()),
      );
      return nodo ? nodo.textContent.trim().replace(/\s+/g, ' ') : null;
    });

  const filaHoy = await pagina.evaluate(
    () => document.querySelector('tr[aria-current="date"] th')?.textContent?.trim() ?? null,
  );

  if (texto !== caso.espera) fallas.push(`${caso.dia}: chip dice "${texto}", se esperaba "${caso.espera}"`);
  if (!filaHoy) fallas.push(`${caso.dia}: la tabla no marca ninguna fila como hoy`);

  await contexto.close();
}

// El marcado estructurado tiene que declarar los once tramos de la semana.
const contexto = await navegador.newContext();
const pagina = await contexto.newPage();
await pagina.goto(BASE, { waitUntil: 'domcontentloaded' });
const ld = JSON.parse(
  await pagina.evaluate(() => document.querySelector('script[type="application/ld+json"]').textContent),
);
const spec = ld.openingHoursSpecification;
const esperados = [
  ['Monday', '08:30', '12:30'], ['Monday', '15:30', '19:30'],
  ['Tuesday', '08:30', '12:30'], ['Tuesday', '15:30', '19:30'],
  ['Wednesday', '08:30', '12:30'], ['Wednesday', '15:30', '19:30'],
  ['Thursday', '08:30', '12:30'], ['Thursday', '15:30', '19:30'],
  ['Friday', '08:30', '12:30'], ['Friday', '15:30', '19:30'],
  ['Saturday', '09:30', '12:30'],
];
const real = spec.map((s) => [s.dayOfWeek, s.opens, s.closes]);
if (JSON.stringify(real.sort()) !== JSON.stringify(esperados.sort())) {
  fallas.push(`openingHoursSpecification incorrecto:\n  esperado ${JSON.stringify(esperados)}\n  real     ${JSON.stringify(real)}`);
}

// La tabla lista los grupos que escribió el dueño ("Lunes a viernes"), no los
// siete días: el detalle por día lo da el reloj. Así que la cuenta correcta es
// la de filas de `data/negocio.js`, sea cual sea.
const filas = await pagina.evaluate(() => document.querySelectorAll('tbody tr').length);
const grupos = negocio.horarios.length;
if (filas !== grupos) fallas.push(`la tabla tiene ${filas} filas, deberían ser ${grupos}`);

await contexto.close();
await navegador.close();

console.log(fallas.length ? `FALLAS:\n- ${fallas.join('\n- ')}` : `HORARIOS OK (${casos.length} casos + marcado + tabla)`);
process.exitCode = fallas.length ? 1 : 0;
