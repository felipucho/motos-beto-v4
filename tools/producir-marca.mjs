/**
 * Produce las piezas de marca a partir del logo original del negocio.
 *
 * ORIGEN: `marca/origen.png`, el logo que entregó el dueño. PNG de 2400×2400
 * con fondo transparente, dos tintas —la palabra en blanco y la moto en
 * naranja— y el dibujo ocupando una banda de 2134×339 en el medio del lienzo.
 * No se toca nunca: todo lo que se sirve sale de acá.
 *
 * QUÉ HACE: recorta la banda real, separa las dos tintas y las vuelve a
 * imprimir en las tintas del sitio. Es lo mismo que hace una imprenta cuando
 * separa un original para las planchas que tiene: el mundo del sitio son cuatro
 * tintas, y el logo se imprime con ésas, no con las suyas. La diferencia con el
 * naranja original es de menos del 3 % y, a cambio, la marca deja de discutir
 * con el resto de la página.
 *
 *   public/marca/motos-beto-tinta.png    palabra en tinta, moto en naranja
 *                                        -> para planos claros (encabezado)
 *   public/marca/motos-beto-papel.png    palabra en papel, moto en naranja vivo
 *                                        -> para planos de tinta (pie)
 *   src/app/icon.png                     nombre y moto sobre un cuadrado de papel
 *                                        -> el favicon
 *
 * USO: node tools/producir-marca.mjs
 * Necesita el sitio nada: dibuja con el canvas de Chromium, que ya está por
 * Playwright.
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const ORIGEN = 'marca/origen.png';

// Las tintas del sitio, tomadas de src/app/globals.css.
const TINTAS = {
  tinta: '#191713',
  papelAlto: '#f5f3ef',
  naranja: '#b84610',
  naranjaVivo: '#e8763a',
};

const PIEZAS = [
  {
    salida: 'public/marca/motos-beto-tinta.png',
    recorte: 'todo',
    ancho: 1600,
    palabra: TINTAS.tinta,
    moto: TINTAS.naranja,
  },
  {
    salida: 'public/marca/motos-beto-papel.png',
    recorte: 'todo',
    ancho: 1600,
    palabra: TINTAS.papelAlto,
    moto: TINTAS.naranjaVivo,
  },
  {
    salida: 'src/app/icon.png',
    recorte: 'todo',
    cuadrado: 256,
    fondo: TINTAS.papelAlto,
    // El favicon se ve a 16 px sobre pestañas blancas: nombre y moto van en
    // las mismas tintas que el encabezado (planos claros), para que la pestaña
    // lea el nombre del negocio en vez de sólo un ícono suelto.
    palabra: TINTAS.tinta,
    moto: TINTAS.naranja,
    ocupacion: 0.86,
  },
];

const b64 = fs.readFileSync(ORIGEN).toString('base64');
const nav = await chromium.launch();
const pag = await (await nav.newContext()).newPage();
await pag.goto('about:blank');

const resultados = await pag.evaluate(
  async ({ b64, piezas }) => {
    const img = new Image();
    await new Promise((listo) => {
      img.onload = listo;
      img.src = 'data:image/png;base64,' + b64;
    });

    const fuente = document.createElement('canvas');
    fuente.width = img.width;
    fuente.height = img.height;
    const gf = fuente.getContext('2d', { willReadFrequently: true });
    gf.drawImage(img, 0, 0);
    const datos = gf.getImageData(0, 0, fuente.width, fuente.height);
    const d = datos.data;

    // El original trae una neblina de alfa muy bajo repartida por todo el
    // lienzo, de la exportación: 19.350 píxeles sueltos con alfa entre 1 y 24
    // que, si se cuentan, hacen que el recorte «ajustado» sea el lienzo entero.
    // Debajo de 24 es ruido y no dibujo.
    const RUIDO = 24;
    // Un píxel con más de 45 de croma es tinta naranja; el resto, con los tres
    // canales parejos, es la palabra.
    const CROMA = 45;

    const esNaranja = (i) => {
      const r = d[i], g = d[i + 1], b = d[i + 2];
      return Math.max(r, g, b) - Math.min(r, g, b) > CROMA;
    };

    const caja = (filtro) => {
      let minX = 1e9, minY = 1e9, maxX = -1, maxY = -1;
      for (let y = 0; y < fuente.height; y += 1) {
        for (let x = 0; x < fuente.width; x += 1) {
          const i = (y * fuente.width + x) * 4;
          if (d[i + 3] <= RUIDO) continue;
          if (!filtro(i)) continue;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
      return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
    };

    const cajas = {
      todo: caja(() => true),
      moto: caja(esNaranja),
    };

    const aRgb = (hex) => [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
    ];

    /** Reimprime el recorte con las dos tintas pedidas, a la escala pedida. */
    const separar = (rec, palabra, moto, soloMoto) => {
      const lienzo = document.createElement('canvas');
      lienzo.width = rec.w;
      lienzo.height = rec.h;
      const g = lienzo.getContext('2d');
      const salida = g.createImageData(rec.w, rec.h);
      const s = salida.data;
      const [pr, pg, pb] = palabra ? aRgb(palabra) : [0, 0, 0];
      const [mr, mg, mb] = aRgb(moto);

      for (let y = 0; y < rec.h; y += 1) {
        for (let x = 0; x < rec.w; x += 1) {
          const i = ((rec.y + y) * fuente.width + (rec.x + x)) * 4;
          const o = (y * rec.w + x) * 4;
          const a = d[i + 3];
          if (a <= RUIDO) continue;
          const naranja = esNaranja(i);
          if (soloMoto && !naranja) continue;
          const [r, g2, b] = naranja ? [mr, mg, mb] : [pr, pg, pb];
          s[o] = r;
          s[o + 1] = g2;
          s[o + 2] = b;
          s[o + 3] = a;
        }
      }
      g.putImageData(salida, 0, 0);
      return lienzo;
    };

    const escalar = (lienzo, ancho) => {
      const alto = Math.round((lienzo.height * ancho) / lienzo.width);
      const fin = document.createElement('canvas');
      fin.width = ancho;
      fin.height = alto;
      const g = fin.getContext('2d');
      g.imageSmoothingEnabled = true;
      g.imageSmoothingQuality = 'high';
      g.drawImage(lienzo, 0, 0, ancho, alto);
      return fin;
    };

    const salidas = [];
    for (const p of piezas) {
      const rec = cajas[p.recorte];
      const separado = separar(rec, p.palabra, p.moto, p.recorte === 'moto');

      let fin;
      if (p.cuadrado) {
        fin = document.createElement('canvas');
        fin.width = p.cuadrado;
        fin.height = p.cuadrado;
        const g = fin.getContext('2d');
        g.fillStyle = p.fondo;
        g.fillRect(0, 0, p.cuadrado, p.cuadrado);
        const anchoMoto = Math.round(p.cuadrado * p.ocupacion);
        const altoMoto = Math.round((separado.height * anchoMoto) / separado.width);
        g.imageSmoothingEnabled = true;
        g.imageSmoothingQuality = 'high';
        g.drawImage(
          separado,
          Math.round((p.cuadrado - anchoMoto) / 2),
          Math.round((p.cuadrado - altoMoto) / 2),
          anchoMoto,
          altoMoto,
        );
      } else {
        fin = escalar(separado, p.ancho);
      }

      salidas.push({
        salida: p.salida,
        w: fin.width,
        h: fin.height,
        recorte: rec,
        datos: fin.toDataURL('image/png'),
      });
    }
    return { cajas, salidas };
  },
  { b64, piezas: PIEZAS },
);

for (const s of resultados.salidas) {
  fs.mkdirSync(path.dirname(s.salida), { recursive: true });
  const bin = Buffer.from(s.datos.split(',')[1], 'base64');
  fs.writeFileSync(s.salida, bin);
  console.log(
    `${s.salida.padEnd(38)} ${String(s.w).padStart(4)}×${String(s.h).padStart(3)}  ${(bin.length / 1024).toFixed(1)} kB`,
  );
}
console.log('recortes del original:', JSON.stringify(resultados.cajas));

await nav.close();
