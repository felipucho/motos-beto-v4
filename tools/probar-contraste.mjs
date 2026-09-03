/**
 * Contraste de la tabla de horarios con el reloj puesto en un martes, que es
 * cuando la fila del domingo NO recibe el resalte de "hoy". axe sólo mide lo
 * que está en pantalla en ese momento, así que sin fijar el día esta celda se
 * escapa de la auditoría.
 */
import { chromium } from 'playwright';

const lineal = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

const luminancia = ([r, g, b]) => 0.2126 * lineal(r) + 0.7152 * lineal(g) + 0.0722 * lineal(b);

const contraste = (a, b) => {
  const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const rgb = (s) => s.match(/\d+/g).slice(0, 3).map(Number);

const nav = await chromium.launch();
const ctx = await nav.newContext({
  viewport: { width: 1280, height: 900 },
  locale: 'es-AR',
  timezoneId: 'America/Argentina/Cordoba',
});
// Martes 1 de septiembre de 2026, 10:00 en Córdoba.
await ctx.clock.install({ time: new Date('2026-09-01T13:00:00Z') });

const pag = await ctx.newPage();
await pag.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await pag.waitForTimeout(600);

const muestras = await pag.evaluate(() => {
  const fondoReal = (el) => {
    let n = el;
    while (n) {
      const bg = getComputedStyle(n).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg;
      n = n.parentElement;
    }
    return 'rgb(255, 255, 255)';
  };

  const filas = [...document.querySelectorAll('#horarios tbody tr')];
  const salida = filas.map((tr) => {
    const th = tr.querySelector('th');
    const td = tr.querySelector('td');
    return {
      dia: th.textContent.trim(),
      hoy: tr.getAttribute('aria-current') === 'date',
      tamano: getComputedStyle(td).fontSize,
      texto: getComputedStyle(td).color,
      fondo: fondoReal(td),
    };
  });

  const nota = document.querySelector('#horarios p');
  if (nota) {
    salida.push({
      dia: '(nota de la siesta)',
      hoy: false,
      tamano: getComputedStyle(nota).fontSize,
      texto: getComputedStyle(nota).color,
      fondo: fondoReal(nota),
    });
  }
  return salida;
});

const orden = muestras.filter((m) => m.dia !== '(nota de la siesta)').map((m) => m.dia);
const fallas = [];

// La tabla lista grupos ("Lunes a viernes", "Sábados", "Domingos"), así que lo
// que se comprueba es que la semana siga empezando el lunes y terminando el
// domingo, no que haya siete filas.
if (!/^lunes/i.test(orden[0]) || !/^domingo/i.test(orden[orden.length - 1])) {
  fallas.push(`la semana no va de lunes a domingo: ${orden.join(', ')}`);
}

for (const m of muestras) {
  const c = contraste(rgb(m.texto), rgb(m.fondo));
  const minimo = 4.5;
  console.log(`${m.dia.padEnd(22)} ${m.tamano.padStart(6)}  ${c.toFixed(2)}:1${m.hoy ? '  (hoy)' : ''}`);
  if (c < minimo) fallas.push(`${m.dia}: contraste ${c.toFixed(2)}:1, mínimo ${minimo}:1`);
}

console.log(fallas.length ? `\nFALLAS:\n- ${fallas.join('\n- ')}` : '\nCONTRASTE Y ORDEN OK');
await nav.close();
process.exitCode = fallas.length ? 1 : 0;
