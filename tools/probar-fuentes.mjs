/**
 * Las tipografías: qué familia toca cada cosa, y —lo que de verdad importa—
 * que el respaldo mida lo mismo que la fuente buena.
 *
 * El respaldo es Arial con `size-adjust`, y se usa durante el segundo largo que
 * tarda Archivo en llegar por una red de pueblo. Si mide distinto, al llegar la
 * fuente el texto se re-mide y la página salta: así se iban 0,065 de CLS en la
 * portada, donde los dos botones entraban en una fila con el respaldo y en dos
 * con Archivo, por dos píxeles.
 *
 * `next/font` calcula un solo ajuste y esta familia se usa a dos anchos, así
 * que los respaldos se declaran a mano en `globals.css`. Esta prueba es la que
 * los mantiene calibrados: mide los dos anchos contra la fuente real y falla si
 * alguno se corre de lo que su caso tolera.
 *
 * La tolerancia no es la misma para los dos, porque no deciden lo mismo:
 *
 * - Rótulos y botones: 2%. Acá el ancho decide si la fila de botones de la
 *   portada entra en un renglón o en dos, y eso son 64 px de salto. Se afinó
 *   contra las cadenas reales.
 * - Cartel: 8%. Cada línea del titular es un bloque de una palabra que nunca
 *   envuelve, así que el ancho no cambia el alto de nada; el ajuste es de
 *   fidelidad visual. Y no puede ser mejor: `size-adjust` es un factor único y
 *   la relación de anchos entre Archivo y Arial cambia según qué letras tenga
 *   la palabra —"BICICLETAS" da 1,00 y "REPUESTOS" 0,95 con el mismo número—.
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:3000/';

const nav = await chromium.launch();
const pag = await (await nav.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
await pag.goto(BASE, { waitUntil: 'networkidle' });
await pag.evaluate(() => document.fonts.ready);

const fallas = [];

const r = await pag.evaluate(() => {
  const ver = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return { sel, familia: 'FALTA EL SELECTOR', peso: null, ancho: null };
    const cs = getComputedStyle(el);
    return {
      sel,
      familia: cs.fontFamily.split(',')[0].replace(/^"|"$/g, ''),
      peso: cs.fontWeight,
      ancho: cs.fontStretch,
    };
  };

  // Ancho de una cadena compuesta con una familia concreta, fuera de pantalla.
  const medir = (texto, familia, peso, estiramiento, tamano, interletra) => {
    const s = document.createElement('span');
    s.textContent = texto;
    s.style.cssText = [
      'position:absolute',
      'visibility:hidden',
      'white-space:nowrap',
      `font-family:${familia}`,
      `font-weight:${peso}`,
      `font-stretch:${estiramiento}`,
      `font-size:${tamano}`,
      `letter-spacing:${interletra}`,
      'text-transform:uppercase',
    ].join(';');
    document.body.appendChild(s);
    const ancho = s.getBoundingClientRect().width;
    s.remove();
    return ancho;
  };

  // Las dos combinaciones que existen en la página, con su respaldo.
  const casos = [
    {
      nombre: 'rótulos y botones (ancho 100%)',
      respaldo: "'Cartel respaldo'",
      tolerancia: 0.02,
      peso: 700,
      estiramiento: '100%',
      tamano: '13px',
      interletra: '0.1em',
      textos: ['ESCRIBINOS', 'CÓMO LLEGAR', 'MÁS DE 25 AÑOS EN LAS VARILLAS'],
    },
    {
      nombre: 'cartel (ancho 76%)',
      respaldo: "'Cartel respaldo angosto'",
      tolerancia: 0.08,
      peso: 900,
      estiramiento: '76%',
      tamano: '52px',
      interletra: '-0.012em',
      textos: ['BICICLETAS', 'REPUESTOS', '310'],
    },
  ];

  const calibrado = casos.map((c) => ({
    nombre: c.nombre,
    respaldo: c.respaldo,
    tolerancia: c.tolerancia,
    medidas: c.textos.map((t) => ({
      texto: t,
      buena: medir(t, "'Archivo'", c.peso, c.estiramiento, c.tamano, c.interletra),
      respaldo: medir(t, c.respaldo, c.peso, c.estiramiento, c.tamano, c.interletra),
    })),
  }));

  return {
    muestras: ['h1', 'h2', 'p', '.rotulo', '.cartel', 'header nav a', 'tbody th'].map(ver),
    familias: [...document.fonts].map((f) => `${f.family} ${f.weight} ${f.status}`),
    calibrado,
  };
});

// La familia se nombra literalmente en `globals.css` para saltear el respaldo
// automático de next/font. Si el nombre cambiara, las pilas quedarían apuntando
// a una familia inexistente y todo caería a Arial sin avisar.
if (!r.familias.some((f) => f.startsWith('Archivo '))) {
  fallas.push('no existe ninguna cara llamada «Archivo»: revisar la pila de `--font-cartel`');
}
for (const nombre of ['Cartel respaldo', 'Cartel respaldo angosto']) {
  if (!r.familias.some((f) => f.startsWith(`${nombre} `))) {
    fallas.push(`falta la cara de respaldo «${nombre}»`);
  }
}
for (const m of r.muestras) {
  if (m.familia === 'FALTA EL SELECTOR') fallas.push(`selector inexistente: ${m.sel}`);
}

console.log('Calibrado del respaldo (ancho de la fuente buena / ancho del respaldo):');
for (const caso of r.calibrado) {
  console.log(`\n  ${caso.nombre} — ${caso.respaldo}`);
  for (const m of caso.medidas) {
    const razon = m.buena / m.respaldo;
    const desvio = Math.abs(razon - 1);
    const marca = desvio <= caso.tolerancia ? 'ok  ' : 'MAL ';
    console.log(
      `    ${marca}${m.texto.padEnd(32)} ${m.buena.toFixed(1).padStart(7)} / ${m.respaldo.toFixed(1).padStart(7)} = ${razon.toFixed(4)}`,
    );
    if (desvio > caso.tolerancia) {
      fallas.push(
        `«${m.texto}» en ${caso.nombre}: el respaldo se corre ${(desvio * 100).toFixed(1)}% ` +
          `(máximo ${(caso.tolerancia * 100).toFixed(0)}%). Ajustar el \`size-adjust\` de ${caso.respaldo} en globals.css.`,
      );
    }
  }
}

console.log('\nQué familia toca cada cosa:');
for (const m of r.muestras) console.log(`  ${m.sel.padEnd(14)} ${m.familia} ${m.peso} ${m.ancho}`);

await nav.close();
console.log(fallas.length ? `\nFALLAS:\n- ${fallas.join('\n- ')}` : '\nFUENTES OK');
process.exitCode = fallas.length ? 1 : 0;
