import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const BASE = 'http://localhost:3000';
const vistas = [
  { nombre: 'escritorio', viewport: { width: 1440, height: 900 } },
  { nombre: 'telefono', viewport: { width: 390, height: 844 } },
];

const nav = await chromium.launch();
let total = 0;

for (const vista of vistas) {
  const ctx = await nav.newContext({ viewport: vista.viewport, locale: 'es-AR', timezoneId: 'America/Argentina/Cordoba' });
  const pag = await ctx.newPage();
  await pag.goto(BASE, { waitUntil: 'networkidle' });
  await pag.waitForTimeout(800);

  const r = await new AxeBuilder({ page: pag })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
    // El iframe de Google Maps es de terceros: no se puede corregir desde acá.
    .exclude('iframe')
    .analyze();

  console.log(`\n== ${vista.nombre} ==  violaciones: ${r.violations.length}`);
  for (const v of r.violations) {
    total += 1;
    console.log(`- [${v.impact}] ${v.id}: ${v.help}`);
    for (const n of v.nodes.slice(0, 4)) console.log(`    ${n.target.join(' ')}\n      ${n.failureSummary?.split('\n').join(' | ').slice(0, 180)}`);
  }
  await ctx.close();
}

await nav.close();
process.exitCode = total ? 1 : 0;
