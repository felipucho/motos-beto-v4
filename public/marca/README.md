# Marca

Piezas de marca del negocio. **Ninguna se edita a mano**: todas salen de
`marca/origen.png` con `node tools/producir-marca.mjs`.

## Origen

`marca/origen.png` es el logo tal cual lo entregó el dueño: PNG de 2400×2400,
fondo transparente, dos tintas —la palabra en blanco `#f8f8f8` y la moto en
naranja `#e86818`— con el dibujo ocupando una banda de 2134×339 en el medio del
lienzo. Ese archivo no se toca.

## Qué produce el script

El script recorta la banda real, separa las dos tintas del original y las
vuelve a imprimir en las tintas del sitio, que es lo que hace una imprenta
cuando separa un original para las planchas que tiene.

| Archivo | Tintas | Dónde va |
|---|---|---|
| `motos-beto-tinta.png` | palabra `#191713`, moto `#b84610` | Planos claros: el encabezado |
| `motos-beto-papel.png` | palabra `#f5f3ef`, moto `#e8763a` | Planos de tinta: el pie |
| `motos-beto-compartir.png` | palabra `#191713`, moto `#b84610`, fondo `#f5f3ef` | La miniatura de WhatsApp y redes |
| `../../src/app/icon.png` | palabra `#191713`, moto `#b84610`, fondo `#f5f3ef` | El favicon |

Las dos primeras salen a 1600×254 (relación 6,30:1), que es más del doble del
tamaño más grande al que se muestran.

`motos-beto-compartir.png` sale a 1200×630, que es la caja que piden Open Graph
y Twitter y la que recorta WhatsApp —el canal real de este negocio— sin comerse
los bordes.

El favicon sale a **480×480**. El número no es caprichoso: la guía de favicons
de Google pide un cuadrado de lado múltiplo de 48, porque el buscador lo baja a
48 px para ponerlo al lado del resultado. 480 es 48×10.

El favicon **no** es la moto sola sobre un cuadrado oscuro: lleva el nombre y la
moto en las tintas de los planos claros, sobre papel. Se ve a 16 px sobre
pestañas blancas, y ahí un ícono suelto no dice de quién es la pestaña.

## Si cambia el logo

Reemplazar `marca/origen.png` y volver a correr el script. Si el original nuevo
no viene en dos tintas planas sobre transparencia, hay que revisar el umbral de
croma del script antes de confiar en la separación.
