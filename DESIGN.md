---
name: Motos Beto
description: Un afiche serigrafiado de mostrador: cada sección es una hoja de una sola tinta, cuatro tintas en total -naranja quemado, tinta cálida, gris y papel-, sin un degradado, sin una sombra y sin una esquina redondeada.
colors:
  naranja: "#b84610"
  naranja-vivo: "#e8763a"
  naranja-hondo: "#8e3409"
  tinta: "#191713"
  tinta-media: "#4a473f"
  tinta-gris: "#65615a"
  gris-plano: "#c7c1b6"
  gris-claro: "#dad5cb"
  papel: "#eae7e1"
  papel-alto: "#f5f3ef"
  papel-suave: "#b9b3a8"
typography:
  placa:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "clamp(4.5rem, 2rem + 9vw, 8rem)"
    fontWeight: 900
    fontStretch: "76%"
    lineHeight: 0.78
    letterSpacing: "-0.012em"
  t1:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "clamp(3rem, 1.4rem + 7.2vw, 6rem)"
    fontWeight: 900
    fontStretch: "76%"
    lineHeight: 0.86
    letterSpacing: "-0.012em"
  t2:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 1.5rem + 4.4vw, 4.5rem)"
    fontWeight: 900
    fontStretch: "76%"
    lineHeight: 0.9
    letterSpacing: "-0.012em"
  t3:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 1.2rem + 0.85vw, 1.875rem)"
    fontWeight: 900
    fontStretch: "76%"
    lineHeight: 1.08
    letterSpacing: "-0.012em"
  rotulo:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    fontStretch: "100%"
    lineHeight: 1.2
    letterSpacing: "0.14em"
  guia:
    fontFamily: "Bitter, Georgia, serif"
    fontSize: "clamp(1.125rem, 1.02rem + 0.5vw, 1.375rem)"
    fontWeight: 400
    lineHeight: 1.5
  cuerpo:
    fontFamily: "Bitter, Georgia, serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.62
  base:
    fontFamily: "Bitter, Georgia, serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  dato:
    fontFamily: "Bitter, Georgia, serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  menuda:
    fontFamily: "Bitter, Georgia, serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.45
  nota:
    fontFamily: "Bitter, Georgia, serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.3
rounded:
  todo: "0"
spacing:
  pliego: "4.5rem"
  pliego-md: "6.5rem"
  columna: "2.5rem"
  columna-lg: "4rem"
  borde-pantalla: "1.25rem"
  borde-pantalla-md: "2rem"
  ancho-contenedor: "78rem"
  medida: "66ch"
borders:
  regla: "3px"
  regla-fina: "2px"
components:
  accion-naranja:
    backgroundColor: "{colors.naranja}"
    textColor: "{colors.papel-alto}"
    typography: "{typography.rotulo}"
    fontSize: "0.8125rem"
    letterSpacing: "0.1em"
    rounded: "{rounded.todo}"
    padding: "0.75rem 1.5rem"
    height: "3.25rem"
  accion-naranja-hover:
    backgroundColor: "{colors.naranja-hondo}"
    textColor: "{colors.papel-alto}"
  accion-tinta:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.papel-alto}"
    rounded: "{rounded.todo}"
    padding: "0.75rem 1.5rem"
    height: "3.25rem"
  accion-contorno:
    border: "2px solid {colors.tinta}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.todo}"
    padding: "0.75rem 1.5rem"
    height: "3.25rem"
  accion-contorno-hover:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.papel-alto}"
  marbete:
    border: "2px solid {colors.tinta}"
    textColor: "{colors.tinta}"
    typography: "{typography.rotulo}"
    rounded: "{rounded.todo}"
    padding: "0.5rem 0.75rem"
  marca-estado:
    border: "2px solid currentColor"
    width: "0.78em"
    height: "0.78em"
    rounded: "{rounded.todo}"
  plano:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    padding: "4.5rem 0"
  plano-alto:
    backgroundColor: "{colors.papel-alto}"
    textColor: "{colors.tinta}"
    padding: "4.5rem 0"
  plano-gris:
    backgroundColor: "{colors.gris-plano}"
    textColor: "{colors.tinta}"
    padding: "3rem 0"
  plano-naranja:
    backgroundColor: "{colors.naranja}"
    textColor: "{colors.papel-alto}"
    padding: "4.5rem 0"
  plano-tinta:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.papel-alto}"
    padding: "4.5rem 0"
---

# Design System: Motos Beto

## Overview

El sitio es un afiche serigrafiado, no una ficha de comercio. La página se lee
como un pliego de hojas apiladas: cada sección es un plano entero de **una sola
tinta**, y el corte entre un plano y el siguiente es todo el separador que hace
falta. No hay tarjetas, no hay sombras, no hay degradados y no hay una sola
esquina redondeada en todo el sitio.

La paleta son cuatro pasadas de imprenta —naranja, tinta, gris y el papel, que
también cuenta como tinta porque es lo que queda sin imprimir—. Los valores no
son decorativos: cada uno está elegido para que el texto que lo pisa llegue al
contraste que le toca. El naranja de campo (`#b84610`) es más hondo que el de
acento (`#e8763a`) porque tiene que sostener texto claro a cuerpo de lectura.

La voz de cartel es **Archivo** (Omnibus-Type, Buenos Aires), variable en peso y
en ancho: un solo archivo cubre el titular de pared a peso 900 y ancho 76 y el
rótulo del pie a peso 700 y ancho normal, que es como trabajaba una imprenta con
un solo juego de tipos de madera. El texto es **Bitter** (Huerta Tipográfica,
Buenos Aires), una egipcia de remates rectos y mecánicos: es lo que separa este
mundo del afiche turístico de parque, que fue el punto de partida y el riesgo
más grande.

## Colors

Cuatro tintas y once valores. Toda la página sale de acá; ningún componente
escribe un color literal.

### Naranja

| Token | Valor | Uso |
|---|---|---|
| `naranja` | `#b84610` | El plano. Campos enteros: chapa de portada, hoja de bicicletas, hoja de contacto, botón primario. Sostiene texto en `papel-alto` a 4.83:1. |
| `naranja-vivo` | `#e8763a` | Sólo sobre plano de tinta: barras del reloj, marca de estado abierto, anillo de foco, hover de cifras. Sobre papel no llega al contraste. |
| `naranja-hondo` | `#8e3409` | Estado presionado del plano naranja y del botón primario. |

### Tinta

| Token | Valor | Uso |
|---|---|---|
| `tinta` | `#191713` | El plano oscuro, todo el texto sobre papel, y las reglas de 3px. Negro cálido, nunca negro puro. |
| `tinta-media` | `#4a473f` | Texto secundario sobre papel y sobre gris; pistas del reloj; divisiones dentro del plano de tinta; fila de hoy en la tabla. |
| `tinta-gris` | `#65615a` | Rótulos secundarios sobre papel. 4.86:1 sobre `papel`. |

### Gris

| Token | Valor | Uso |
|---|---|---|
| `gris-plano` | `#c7c1b6` | El plano intermedio (cómo se paga) y las reglas finas de 2px sobre papel. |
| `gris-claro` | `#dad5cb` | Pista de la barra de desplazamiento. |

### Papel

| Token | Valor | Uso |
|---|---|---|
| `papel` | `#eae7e1` | El fondo del sitio. Gris cálido, no crema: el crema con verde era el defecto prohibido del mundo de origen. |
| `papel-alto` | `#f5f3ef` | El plano claro (encabezado, hoja de taller) y todo el texto sobre naranja y sobre tinta. |
| `papel-suave` | `#b9b3a8` | Texto y reglas secundarias **sólo** sobre el plano de tinta. Sobre naranja no llega. |

### Named Rules

- **Cuatro tintas, ninguna quinta.** Un color nuevo entra sólo si reemplaza a uno.
  Incluye al logo: el naranja original de la marca (`#e86818`) se separa a las
  tintas del sitio, que están a menos del 3 % de distancia.
- **Sobre el plano naranja hay exactamente dos tintas:** `papel-alto` para el
  texto de lectura y `tinta` para las líneas grandes, de `t3` para arriba. No hay
  un gris intermedio, y la jerarquía la hace el tamaño.
- **El naranja no lleva texto chico sobre papel.** 4.34:1 alcanza para titulares
  y para reglas, no para cuerpo.
- **`papel-suave` es exclusivo del plano de tinta.** Sobre naranja da 2.29:1.
- **El estado no se dice con color.** El color acompaña; lo que informa es la
  forma de la marca.

## Typography

Dos familias, dos oficios. Nada más entra.

- **`--font-cartel`** — `Archivo`, variable en `wght` (100–900) y `wdth`
  (62–125), servida desde el propio dominio por `next/font`.
- **`--font-texto`** — `Bitter`, variable en peso.

### Hierarchy

| Escalón | Tamaño | Familia | Uso |
|---|---|---|---|
| `placa` | `clamp(4.5rem, 2rem + 9vw, 8rem)` | cartel | La cifra de la chapa de dirección. El único uso. |
| `t1` | `clamp(3rem, 1.4rem + 7.2vw, 6rem)` | cartel | El apilado de la portada. Interlínea 0.86. |
| `t2` | `clamp(2.5rem, 1.5rem + 4.4vw, 4.5rem)` | cartel | Titular de hoja y tira de marcas. |
| `t3` | `clamp(1.375rem, 1.2rem + 0.85vw, 1.875rem)` | cartel | Subtitular, cifras de la franja, valores de contacto. |
| `guia` | `clamp(1.125rem, 1.02rem + 0.5vw, 1.375rem)` | texto | La frase de entrada de cada hoja. |
| `cuerpo` | `1.0625rem` | texto | Cuerpo general. |
| `dato` | `0.9375rem` | texto | Filas de tabla y notas al pie de bloque. |
| `rotulo` | `0.75rem` | cartel | Etiquetas de dato, navegación, botones. |

Entre `t3` y `guia` hay un salto brusco y es a propósito: en un afiche no hay
escalones intermedios, hay un titular y una letra chica.

### Named Rules

- **`.cartel`** — peso 900, ancho 76%, caja alta, interletrado `-0.012em`,
  **espacio de palabra `0.08em`**. A ancho 76 los blancos entre palabras se
  cierran hasta pegarlas; se abren a mano, que es lo que hacía el cajista.
- **`.rotulo`** — peso 700, ancho 100%, `0.14em` de interletrado, caja alta. Es
  la letra chica del pie del afiche.
- **`.cifras`** — toda cifra que se compare en columna va en la grotesca con
  numerales tabulares y ancho 100%. La egipcia no alinea columnas de horario.
- **Ningún rótulo va encima de un titular.** Los rótulos etiquetan datos —una
  celda, un `dt`, una columna—, nunca anuncian un `h2`. El titular se sostiene
  solo.
- **El texto de lectura es Bitter y sólo Bitter.** El cartel no baja a cuerpo.

## Layout

| Token | Valor |
|---|---|
| `contenedor` | `78rem`, centrado, con colchón de `1.25rem` (`2rem` desde 48rem) que respeta `env(safe-area-inset-*)` |
| `pliego` | `4.5rem` arriba y abajo; `6.5rem` desde 48rem |
| `medida` | `66ch` |
| `ancla` | `scroll-margin-top: 7.25rem`; `6rem` desde 64rem |
| `xs` | Punto de quiebre propio a `24rem`, para teléfonos angostos |

**`.margen-cartel`** resuelve la portada a sangre: la chapa naranja llega al
borde derecho de la pantalla, así que la columna de texto no puede vivir dentro
de `.contenedor` y se alinea sola con el margen que tendría si estuviera adentro
—`max(1.25rem, calc((100vw - 78rem) / 2 + 2rem))`—.

### Named Rules

- **Cada sección es un plano a sangre completa.** El contenido va en
  `.contenedor`; el color va en la sección.
- **El cambio de plano es el separador.** No hay reglas entre secciones.
- **La navegación de escritorio entra recién a 64rem.** Entre 48 y 64 los seis
  rótulos más la marca y el botón se pasaban del ancho: en ese rango manda la
  fila de cuatro rótulos.

## Elevation & Depth

**No hay.** Cero sombras, cero desenfoques, cero elevaciones. Un afiche
serigrafiado es absolutamente plano y esa planitud es la disciplina que el mundo
elegido donó.

### Named Rules

- **La profundidad se declara una sola vez y es un borde.** Nunca borde más
  sombra.
- **El encabezado no se despega con una sombra.** Al desplazarse, su regla
  inferior pasa de `gris-plano` a `tinta` y con eso alcanza.

## Shapes

**Radio cero en todo el sitio.** Botones, marbetes, marcos de foto, marco del
mapa, marca de estado, anillo de foco: todo a escuadra. Las reglas son de **3px**
(estructura) y **2px** (dentro de un bloque), nunca de un pelo: una línea de
imprenta tiene cuerpo.

## Components

### Acciones

Cuadradas, de `3.25rem` de alto, rótulo en caja alta con `0.1em` de interletrado.

- **`.accion-naranja`** — plano de naranja con texto en papel. La acción primaria.
- **`.accion-tinta`** — plano de tinta con texto en papel. Primaria sobre naranja.
- **`.accion-contorno`** — caja de 2px de tinta sobre plano claro; al pasar por
  encima se rellena de tinta.
- **`.accion-contorno-clara`** — caja de 2px de `currentColor` sobre plano oscuro
  o naranja; al pasar por encima se rellena de papel.

### Marbete

La etiqueta del estante: marco de 2px, esquina viva porque no es accionable. Se
compone con `.rotulo`, que pone la voz. Se usa para los trabajos del taller, que
son cosas sueltas y se escanean mejor sueltas.

### Marca de estado

Un cuadrado de `0.78em` que hereda `currentColor`: **lleno** cuando el local está
abierto, **vacío y cruzado en diagonal** cuando está cerrado. Se entiende sin
distinguir el naranja del gris, que es lo que pasa bajo el sol y lo que pasa con
daltonismo.

### Chapa de dirección

El bloque naranja de la portada: calle en rótulo, número en `placa`, localidad
sobre una regla de 2px, todo apoyado en el pie del plano. Toda la chapa es el
enlace al mapa. El número suelto en el medio de un campo grande se lee como un
dato flotando; apoyado abajo con su calle se lee como el número que está pintado
en la vereda.

### Franja

La banda de tinta del pie del cartel, con tres celdas divididas por reglas de
2px: estado en vivo, horario de hoy, teléfono. Las tres celdas **no** son
iguales —`0.85fr 1.3fr 0.85fr`—: la del medio lleva el horario entero. Por debajo
de 48rem se apila.

### Tira de marcas

Las marcas al cuerpo del titular, entre dos reglas de 3px, ocupando el ancho
entero. En un local del rubro las marcas están pintadas en el frente al tamaño de
la pared, no listadas en una tabla.

### Fila de ficha

`dl` con rótulo angosto a la izquierda y frase a la derecha, separadas por una
regla de 2px. Es el cuerpo de las hojas densas y reemplaza a la grilla de
tarjetas iguales.

### Reloj de la semana

Siete filas de franjas sobre plano de tinta: pista en `tinta-media`, tramos
abiertos en `naranja-vivo`, escala horaria arriba. La fila de hoy sube su pista a
`tinta-gris` y lleva la aguja de la hora —una línea de 2px en papel coronada por
un triángulo, «usted está aquí»—, sólo después de hidratar. Va con `aria-hidden`
a propósito: es la misma información que la tabla en otra forma, y la forma
accesible ya existe a un lector de pantalla de distancia.

En pantalla ancha baja a una banda de ancho completo debajo del título y la
tabla; en teléfono queda justo debajo del estado.

### Tabla de horarios

Sobre plano de tinta. Encabezados en rótulo, filas separadas por reglas de 2px en
`papel-suave`, fila de hoy sobre un plano `tinta-media` con un cuadrado de
`naranja-vivo` al lado del día. Lista **grupos**, no días: listar los siete
implicaba escribir cinco veces el mismo horario.

### Hueco de fotografía

Proporción fija y marco de 3px. **Cuando no hay foto no dibuja nada**: un panel
de relleno con un ícono adentro es un esqueleto de carga que nunca termina de
cargar. En la chapa de la portada el hueco va con `tinte`: la foto se imprime en
duotono —gris + naranja en multiplicar + papel en trama— porque ahí ocupa el
lugar de un plano de tinta y tiene que ser ese plano. En las bandas de adentro la
foto va como es.

### Iconografía

24×24, trazo 2.25, remates a escuadra, sin relleno. Las dos marcas —WhatsApp,
Instagram— van sólidas porque son logos, no íconos del sistema. Ningún glifo
Unicode ni emoji hace de ícono.

### Marca

El logo real del negocio: la palabra «Motos Beto» en una grotesca inclinada
pesada, con una moto abstracta en naranja que hace de las dos «o» de «Motos».
Viene en dos tintas planas sobre transparencia, así que se separa y se vuelve a
imprimir en las tintas del sitio —igual que hace una imprenta cuando separa un
original para las planchas que tiene—:

| Pieza | Tintas | Dónde |
|---|---|---|
| `motos-beto-tinta.png` | palabra `tinta`, moto `naranja` | Encabezado, sobre plano claro |
| `motos-beto-papel.png` | palabra `papel-alto`, moto `naranja-vivo` | Pie, sobre plano de tinta |
| `icon.png` | moto `naranja-vivo` sobre cuadrado de `tinta` | Favicon |

Relación 6,30:1. Se muestra a 32–40 px de alto en el encabezado y a 48–64 px en
el pie, siempre con `sizes` declarado: sin eso el navegador se baja el archivo a
tamaño de cartel. **Las tres piezas se regeneran, no se editan**: salen de
`marca/origen.png` con `node tools/producir-marca.mjs`.

La marca no aparece en ningún otro lado. Un segundo logotipo tipográfico
compitiendo con el real sería dos marcas para el mismo negocio.

## Do's and Don'ts

### Do:

- Usar campos enteros de tinta. El naranja ocupa aproximadamente un cuarto de la
  página y siempre en planos grandes, nunca en bordecitos.
- Dejar que el tamaño haga la jerarquía. El salto de `t2` a `dato` es la
  herramienta principal.
- Poner cada dato en un solo lugar. La dirección vive en la chapa, en la hoja de
  ubicación y en el pie, con tres oficios distintos; el horario vive en la franja
  (hoy) y en la hoja de horarios (la semana).
- Encabezar cada hoja con un titular que se sostenga solo y una sola frase
  debajo.
- Escribir toda cifra con su medida pegada.

### Don't:

- No usar tarjetas. Ni una grilla de ícono + título + texto, que es como el rubro
  disimula que tiene poco que mostrar.
- No poner un rótulo encima de un titular.
- No agregar radios, sombras, desenfoques ni degradados. Ninguno, en ningún
  estado.
- No usar reglas de 1px.
- No poner texto chico en naranja sobre papel, ni `papel-suave` sobre naranja.
- No usar un punto de color para el estado.
- No cubrir un plano con una trama de puntos ni con grano. Se probó un medio tono
  en el bloque de pagos y se sacó: a tamaño de pantalla se leía como ruido de
  render, no como una pasada de imprenta.
- No esconder contenido esperando el scroll.

## Motion

Un solo gesto en toda la página: **la pasada**. La tinta se asienta de izquierda
a derecha, como la manguera de serigrafía contra el marco. Ocurre dos veces y las
dos quieren decir lo mismo, «esto se acaba de imprimir».

| Token | Valor |
|---|---|
| `--ease-pasada` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `.pasada` | `clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)`, 780 ms, al cargar. La chapa de la portada. |
| Reloj | `.reloj-tramo` de `scaleX(0)` a `scaleX(1)`, 820 ms, al entrar en pantalla. |
| Transiciones | 180–260 ms con la misma curva: color de fondo, color de texto, regla del encabezado, subrayado de sección, desplazamiento de la flecha. |

**La pasada no puede tapar nada.** En el reloj crecen sólo las barras de tinta,
que son la parte redundante —la tabla dice lo mismo con palabras—; los días, la
escala y las pistas nacen puestos. El estado escondido existe únicamente cuando
`data-js` está puesto, cosa que el script de arranque hace sólo si el navegador
tiene `IntersectionObserver`.

Con `prefers-reduced-motion: reduce` no queda nada: ni la pasada, ni las barras,
ni el desplazamiento suave.

## Accessibility

- **Contraste medido, no estimado.** Cuerpo ≥ 4.5:1 y titulares ≥ 3:1 en los
  cinco planos. Los pares críticos: `tinta` sobre `papel` 14.5:1, `tinta-gris`
  sobre `papel` 4.86:1, `papel-alto` sobre `naranja` 4.83:1, `papel-suave` sobre
  `tinta` 8.6:1, `tinta` sobre `gris-plano` 10:1.
- **El anillo de foco lo elige el plano.** `--anillo` vale `tinta` por defecto,
  `naranja-vivo` sobre plano de tinta y `papel-alto` sobre plano naranja. Siempre
  3px, siempre con 3px de separación, siempre sin transición: un indicador que
  aparece de a poco es un indicador que llega tarde.
- **El estado se lee sin color** (marca llena o cruzada) y se anuncia con
  `aria-live="polite"`, porque cambia solo mientras la página está abierta.
- **Objetivos táctiles de 44px** en toda la navegación y en los datos enlazados.
- **Sin JavaScript la página entera se lee**, incluidas las tres filas de la
  tabla de horarios.
- Los cromos del navegador están entintados: selección, cursor de texto,
  `accent-color`, barra de desplazamiento, grosor y separación del subrayado.

## Decisiones abiertas

- **Las fotos.** Los cuatro huecos están medidos —frente 4/3 en la chapa, y tres
  bandas 21/9— y hoy no dibujan nada. Cuando lleguen, entran sin mover una línea
  de lo que está alrededor; la del frente se imprime en duotono.
- **`typography.placa` pasa el techo de 6rem** que fija el piso de calidad para
  tipografía de despliegue. Es una excepción consciente y única: no es un
  titular, es la cifra de una chapa de dirección en un mundo de imprenta
  comprometido. Ningún otro escalón la pasa.
- **El sobreimpreso está sin usar.** Dos tintas cruzándose para dar una tercera
  es el recurso nativo de una imprenta de dos pasadas y la página no lo usa en
  ninguna parte. Se dejó afuera porque todos los lugares posibles eran decorado y
  no significado; si aparece un lugar donde diga algo, ahí entra.
- **Los datos pendientes** del dueño siguen anotados en el README, en «Datos a
  confirmar».
