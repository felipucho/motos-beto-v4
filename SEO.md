# SEO

Auditoría del 3 de septiembre de 2026, sobre el build de producción
(`npm run build`) servido localmente. El sitio todavía no está publicado en
`motosbeto.com`, así que las métricas de campo —las que Google mide sobre
visitas reales— no existen aún; lo que sigue se midió en laboratorio.

## Qué se busca acá

Motos Beto no compite por "motos" a secas: compite por **"motos Las
Varillas"** y las variantes del pueblo (bicicletas, repuestos, taller,
gestoría). Es SEO local. Eso cambia dónde está la palanca, y conviene decirlo
antes que nada:

**El sitio es un factor secundario.** Cuando alguien busca "motos las
varillas", Google muestra primero el mapa con tres fichas, y recién debajo los
resultados web. Entrar en esas tres fichas depende del **perfil de Google
Business**, no del HTML. Lo que la web aporta es coherencia: confirmarle a
Google que el negocio que dice la ficha y el que dice el sitio son el mismo.

Por eso esta auditoría termina en una lista de cosas que no se arreglan
tocando código.

## Estado técnico

Todo lo verificable en el build está en orden.

| Qué | Estado |
| --- | --- |
| Canónica | `https://motosbeto.com`, un solo host, autorreferencial |
| Sitemap | `/sitemap.xml`, una URL, la canónica, sin `lastmod` inventado |
| Robots | `/robots.txt` abierto, con sitemap declarado |
| Bots de IA | GPTBot, ClaudeBot, PerplexityBot y Google-Extended permitidos |
| `llms.txt` | Presente, con el negocio descrito en prosa |
| Idioma | `lang="es-AR"` |
| Viewport | Configurado, sin scroll horizontal a 375 px |
| Tap targets | Los 21 enlaces miden 44 px o más |
| CLS | 0 |
| Imágenes sin `alt` | Ninguna |
| Encabezados | Un solo `h1`, jerarquía sin saltos |
| Open Graph | Completo, con imagen propia de 1200×630 |
| Landmarks | `header`, `nav` rotulado, `main`, seis `section` con `id`, `address`, `footer` |
| Accesibilidad | 0 violaciones de axe en escritorio y teléfono |

El `h1` es el activo más fuerte de la página: dice **Motos / Bicicletas /
Repuestos / en Las Varillas**. Rubro y pueblo, en el elemento que más pesa, sin
sonar a relleno de keywords porque es literalmente el cartel del negocio.

Hasta la auditoría del 4 de septiembre no decía eso. Las cuatro líneas son
`<span>` de bloque, y entre elementos JSX no queda ni un espacio: el texto que
lee un extractor era `MotosBicicletasRepuestosen Las Varillas`, cuatro palabras
pegadas que no forman ninguna palabra. Se veía perfecto y se leía mal, que es la
peor combinación porque nadie lo nota mirando. Ahora hay un `{' '}` entre línea
y línea —invisible, porque entre cajas de bloque el espacio colapsa— y el texto
extraído es el que la tabla de arriba promete.

### Datos estructurados

El JSON-LD es un `@graph` con cuatro entidades enlazadas por `@id`, en un solo
bloque:

| `@id` | Tipo | Qué dice |
| --- | --- | --- |
| `#business` | `MotorcycleDealer` + `BikeStore` | El comercio |
| `#website` | `WebSite` | El sitio, publicado por `#business` |
| `#webpage` | `WebPage` | La portada, que trata sobre `#business` |
| `#imagen` | `ImageObject` | La imagen de la marca, usada por las otras dos |

Separar el negocio del sitio importa para las respuestas generadas: deja decir
"el comercio abre a las 8:30" sin confundirlo con "la página". Las referencias
se validaron: cinco enlaces internos, ninguno roto.

`#business` declara dirección, coordenadas, teléfono, horarios día por día
(mañana y tarde separadas), `areaServed`, `sameAs` a Instagram y a la ficha,
`hasMap`, `priceRange`, `currenciesAccepted`, `paymentAccepted`, dos
`contactPoint` —el fijo como *customer service*, el WhatsApp como *sales*— y un
catálogo con las cinco marcas de moto, las dos de bicicleta y los servicios del
taller.

**Sobre `AutoDealer`:** no se usa a propósito. `MotorcycleDealer` desciende de
`AutoDealer` en el vocabulario, así que declarar el hijo ya dice el padre.
Poner los dos sería ruido, y quedarse sólo con `AutoDealer` sería perder
precisión: acá no se venden autos.

El `priceRange` es `'$'`, la banda que eligió el dueño en la escala de uno a
cuatro símbolos de Google. Es una franja, no un precio.

**No se declara `aggregateRating` ni `review`, y no se va a declarar.** Las
reseñas propias autopublicadas en el marcado están explícitamente prohibidas por
Google para negocios locales, y desde 2019 no generan estrellas en el resultado.
Las reseñas que cuentan son las de la ficha de Google, escritas por clientes.

### Para agentes y modelos de lenguaje

Tres registros de la misma información, los tres generados desde
`data/negocio.js`, así que no pueden contradecirse:

| Recurso | Para quién |
| --- | --- |
| El HTML, con su `@graph` | Buscadores y personas |
| `/llms.txt` | Modelos que leen texto plano y citan |
| `/data/negocio.json` | Agentes que prefieren campos con nombre |

`/robots.txt` nombra uno por uno a GPTBot, ChatGPT-User, OAI-SearchBot,
ClaudeBot, Claude-User, Claude-SearchBot, PerplexityBot, Perplexity-User y
Google-Extended. La regla `*` ya los alcanzaba, pero varios buscan su nombre
antes que el comodín, y `Google-Extended` es la que separa el uso en respuestas
generadas del índice de búsqueda: sin esa línea el sitio puede salir en los
resultados y quedar afuera de las respuestas.

Los dos recursos de texto declaran además **lo que el sitio no publica**
—precios, coeficientes, catálogo por modelo, stock—. Decirlo explícito es una
defensa: un hueco sin nombrar es una invitación a que un modelo lo complete por
su cuenta.

### Rendimiento

Medido con `node tools/medir-lab.mjs`, que reproduce el apretón de PageSpeed
móvil —4G lento a 1,6 Mbps con 150 ms de latencia, CPU cuatro veces más lenta—
sobre el build de producción. Comparado contra el mismo build antes de esta
ronda:

| | Antes | Ahora |
| --- | --- | --- |
| FCP | 804 ms | **524 ms** |
| LCP | 804 ms | **524 ms** |
| CLS | 0,049 | **0,0009** |
| Tarea larga más larga | 84 ms | 74 ms |
| Peticiones | 16 | 13 |
| Marca del encabezado | 19 kB (PNG a 640 px) | **6 kB** (AVIF a 384 px) |
| Google Maps en la visita | 12 peticiones, 223 kB | **ninguna** |
| Fuentes | 121 kB | 121 kB |
| JavaScript | 482 kB | 482 kB |

Lo que movió cada cosa:

**El CSS iba como hoja aparte y bloqueaba el primer pintado.** Pesa 7 kB
comprimido —menos que la ida y vuelta que hacía falta para ir a buscarlo—. Con
`inlineCss` viaja dentro del HTML: el documento engorda de 17 a 39 kB
comprimidos y el primer pintado baja 260 ms. Se midió apagándolo y volviéndolo
a encender, tres corridas de cada lado.

**El CLS era la fuente.** Mientras Archivo viaja, el texto se compone con
Arial, y en la portada los dos botones entraban en un renglón con el respaldo y
en dos con la fuente buena: 64 px de salto, por dos píxeles de diferencia
—374 contra 372 de caja—. El respaldo que calcula next/font venía 3,3% angosto,
y no puede ser de otra manera: calcula un ajuste solo y esta familia se usa a
dos anchos, 76% en el cartel y 100% en rótulos y botones. Ahora los respaldos
se declaran a mano en `globals.css`, uno por ancho, con el `size-adjust` medido
contra la fuente real. `tools/probar-fuentes.mjs` los mantiene calibrados y
falla si alguno se corre.

**La marca del encabezado se precargaba con prioridad alta** y le sacaba ancho
de banda a las tipografías, que son las que deciden cuándo se puede leer el
cartel. Ya no: va con `fetchPriority="high"`, que la pone temprano en la cola
sin ocupar la primera ranura. Y se servía a 640 px de ancho para verse a 202:
con AVIF y los anchos que el sitio pide de verdad quedó en 6 kB.

A eso le faltaba una mitad, y la auditoría del 4 de septiembre la encontró:
`next/image` le pone `loading="lazy"` a todo lo que no sea `priority`, así que
la marca quedaba diferida. Una imagen diferida no la ve el escáner de precarga
—espera al layout para decidir si está cerca de la pantalla—, o sea que el
`fetchPriority="high"` no llegaba a hacer nada: no se puede priorizar un pedido
que todavía no existe. Ahora lleva además `loading="eager"`, que es el punto
medio real: se pide con el documento y sigue sin emitir el `<link rel=preload>`
que le robaba la ranura a las tipografías.

**El mapa se bajaba siempre.** Más de 200 kB de scripts, tipografías y azulejos
de Google, para una sección que está a un scroll de distancia. Ahora hay una
tapa impresa con la misma tinta que el resto, del tamaño exacto del mapa —así
no se mueve una línea al cambiar—, y el mapa entra al tocarla. La tapa es un
enlace de verdad a la ficha de Google: sin JavaScript el toque abre el mapa
allá, que es la respuesta correcta a "quiero ver dónde queda".

**La pasada se animaba con `clip-path`,** que obliga a repintar en cada cuadro
sobre el hilo principal, justo mientras la página arranca. Ahora es una hoja de
papel que se retira con `transform`, que resuelve el compositor en su propio
hilo. El gesto es el mismo.

**El encabezado hidrataba entero** por dos atributos que cambian al hacer
scroll. Ahora se imprime en el servidor y `NavegacionViva` toca esos dos
atributos sobre el DOM, sin volver a renderizar en cada píxel de scroll.

### Lo que no se pudo bajar

**El JavaScript sigue en 482 kB, y es casi todo React.** Los dos chunks
grandes —224 y 162 kB— son `react` y `react-dom`; lo que agrega este sitio son
unas decenas de kB. Bajarlo de verdad significa sacar React, y con él el estado
de apertura en vivo, el reloj de la semana, la aparición del reloj y el mapa a
demanda. Es una reescritura, no una optimización, y no entra en el encargo.

**Los polyfills que reporta Lighthouse viven en el bundle `nomodule`,** que
ningún navegador moderno descarga ni ejecuta —se verificó: no aparece en la
cronología de recursos de Chrome—. Lighthouse los cuenta igual porque analiza
el bundle sin mirar el atributo. Next.js emite ese chunk siempre y no lo
expone a configuración. Lo que sí se puede acotar es lo que SWC transpila del
código propio, y para eso `package.json` declara ahora un `browserslist`
moderno.

**El `'unsafe-inline'` de la CSP se queda.** Sacarlo exige un `nonce` por
respuesta, y un nonce exige renderizar en cada visita: el sitio dejaría de ser
estático y el TTFB pasaría de milisegundos a decenas. Para una página sin
formularios, sin sesión y sin un solo dato de usuario, el intercambio no cierra.
Por la misma razón no se declara `require-trusted-types-for 'script'`: el
arranque de Next.js y el marcado JSON-LD escriben por `innerHTML`, y activarlo
rompería el hidratado sin cerrar ningún agujero real. Sí se sumaron
`Cross-Origin-Opener-Policy: same-origin` y
`Cross-Origin-Resource-Policy: same-site`.

**Las fuentes siguen en 121 kB.** 88 son de Archivo variable con eje de ancho,
que es lo que hace posible el cartel a ancho 76 y los rótulos a 100 con un solo
archivo. Fijar pesos concretos ahorraría, pero cambia el diseño.

Todo lo estático se sirve con `immutable` a un año; el HTML, comprimido.

Las cifras que van a decidir el ranking son las de campo, y sólo se pueden
medir con el sitio publicado, en
[PageSpeed Insights](https://pagespeed.web.dev/).

### Por qué no hay catálogo por modelo

Una estructura `/motos/honda/xr190l/` con ficha técnica, precio y
disponibilidad sería lo correcto para un concesionario. **Acá no se puede
construir sin inventar.** `data/negocio.js` tiene las cinco marcas y dos
categorías —"110 de calle", "enduro"—, y nada más: no hay modelos, ni
cilindradas, ni precios, ni stock. El dueño decidió no publicar los
coeficientes porque cambian seguido, y un porcentaje viejo en una página
estática es una discusión en el mostrador.

Crear esas rutas hoy daría páginas casi vacías. Google llama *thin content* a
eso y lo trata como un problema de calidad del sitio entero, no de esas páginas
sueltas: sería peor que no tenerlas.

Cuando existan los datos —modelos con foto, ficha y precio— la estructura entra
sin rehacer nada: `data/negocio.js` ya es la fuente única, el sitemap se genera
por código y el `@graph` acepta nodos `Product` colgando de `#business`.

## Lo que se corrigió

**El `<title>` era `Motos Beto` a secas.** Once caracteres, sin rubro ni
pueblo. El `<title>` es la línea azul del resultado de Google, no sólo el rótulo
de la pestaña: para alguien que busca "motos las varillas", un título que no
nombra ninguna de las dos cosas no compite.

Pasó a `Motos Beto — Motos, bicicletas y repuestos en Las Varillas` (60
caracteres contando el guion largo, dentro de lo que la SERP muestra sin
cortar). El nombre sigue adelante, así que la pestaña —que corta cerca del
carácter 30— se lee igual. La versión con `Córdoba` quedó para Open Graph y
Twitter, donde hay lugar.

**La meta description medía 164 caracteres.** Google corta cerca de los 160,
así que `y envíos.` se perdía en puntos suspensivos: se truncaba justo la
frase que menciona un servicio que no todos los competidores dan. Quedó en 147
cambiando `Financiación en cuotas` por `Cuotas`, que dice lo mismo y entra
entera.

Los dos `alt="Motos Beto"` del encabezado y el pie se revisaron y **se dejaron
como estaban**: son el logo del negocio, y para un logo el nombre de la marca
es la descripción correcta. En el encabezado además hace de texto del enlace al
inicio, donde "Motos Beto" es exactamente lo que corresponde leer.

**No había imagen para compartir.** El enlace mandado por WhatsApp —que es el
canal real de este negocio— salía como una línea de texto sin miniatura.
`tools/producir-marca.mjs` produce ahora una pieza de 1200×630 desde el mismo
original que el resto de la marca, y la tarjeta de Twitter pasó de `summary` a
`summary_large_image`.

**El JSON-LD era un nodo suelto.** Pasó a ser un `@graph` de cuatro entidades
enlazadas, con `contactPoint` para el fijo y el WhatsApp.

**Se agregó `/data/negocio.json`,** que es el tercer registro de los mismos
datos, generado desde la misma fuente y enlazado desde `llms.txt`.

## Segunda ronda, 4 de septiembre de 2026

Auditoría contra la [guía de Google][guia], dimensión por dimensión, con cada
hallazgo verificado por dos revisores independientes antes de tocar nada. De 29
hallazgos propuestos sobrevivieron 12; los otros 17 se descartaron por escrito.
Lo que se descartó importa tanto como lo que se hizo, así que está más abajo.

[guia]: https://developers.google.com/search/docs/fundamentals/seo-starter-guide

**El `h1` no decía lo que parecía decir.** Está arriba, en Estado técnico: se
leía `MotosBicicletasRepuestosen Las Varillas`.

**La marca del encabezado estaba diferida.** Está arriba, en Rendimiento.

**El escape del JSON-LD no escapaba nada.** La línea decía
`.replace(/</g, '<')`, y en el fuente esa secuencia ya *es* el carácter
`<`: reemplazaba `<` por `<`. Un no-op con forma de medida de seguridad, que es
peor que no tener ninguna, porque se lee como resuelto. Hoy emite la secuencia
literal de seis caracteres, que el parser de JSON vuelve a leer como `<` y el de
HTML no reconoce como apertura de etiqueta. No había —ni hay— entrada de usuario
en el sitio, así que nunca fue explotable; lo que se arregló es la maquinaria,
para el día que un dato del negocio contenga un `</`.

**El `<lastmod>` del sitemap era la hora del build.** Cualquier redespliegue lo
reescribía como si hubiera cambiado un horario. Google usa `lastmod` mientras le
cierra con la modificación real, y cuando no le cierra deja de mirarlo en todo
el sitio: una fecha siempre falsa quema la señal justo para el día que sirva. Se
sacó, junto con `changefreq` y `priority`, que Google declara que ignora. No se
puso una fecha a mano porque se pudre sola y miente igual.

**La página nunca decía que se venden motos.** La única vez que aparecía el
verbo era la negación de los seguros —"No se venden"—. El dato estaba en el
marcado (`MotorcycleDealer`, la `description` del `@graph`) y no en pantalla.
`motos.condicion` abre ahora con "Venta de motos", que además saca de la primera
línea la jerga de mostrador; como sale de `data/negocio.js`, corrige de una vez
el HTML, `/llms.txt` y `/data/negocio.json`.

**La dirección estaba escrita cinco veces en fuentes independientes:** la línea
de texto y las tres URLs de Google en `data/negocio.js`, más las partes sueltas
en `src/lib/negocio.ts`. Todas coincidían hoy, pero alcanzaba con corregir una
para que el sitio publicara dos direcciones distintas —y la coherencia entre lo
que dice el sitio y lo que dice la ficha es de lo poco que el código puede
aportar a la búsqueda local—. Ahora hay un solo bloque `DIRECCION` del que sale
todo. Se verificó que las tres URLs de Google salgan byte por byte iguales a las
anteriores, y `tools/probar-mapa.mjs` confirma que siguen abriendo la ficha.

**El `PostalAddress` no declaraba `postalCode`.** Se agregó `X5940`, que no es
un dato nuevo: es el que publica la ficha de Google del propio negocio.

**El favicon medía 256×256.** La guía de favicons de Google pide un cuadrado de
lado múltiplo de 48, porque baja el archivo a 48 px para el resultado. Pasó a
480 (48×10), que además es casi el doble del anterior: cumplir no costó
resolución. Se comprobó que regenerar la marca deje las otras tres piezas
idénticas.

**El logo del encabezado prefetcheaba la página en la que ya estás.** El
`<Link href="/">` hacía que el router bajara la carga RSC de la portada en cada
visita. Con `prefetch={false}` la página pasó de 13 peticiones a 12.

**La franja decía "Horario" los siete días.** Antes de hidratar no se sabe qué
día es, así que el rótulo era genérico encima del horario de lunes a viernes
—sábado incluido, cuando el sábado cierra al mediodía—. Ahora rotula el grupo
que muestra: "Lunes a viernes" hasta que hidrata, "Hoy sábado" después.

**`/llms.txt` salía con markdown roto.** Un `filter(Boolean)` se comía la línea
en blanco puesta a propósito, y el párrafo final quedaba absorbido como
continuación del último ítem de lista.

**Los dos README de la marca y de las fotos documentaban cosas que el código no
hace:** proporciones que no eran, una sección del sitio que no existe, la
entrada `bicicletas` sin documentar, el favicon descrito con las tintas
equivocadas y con un tamaño que el script nunca produjo.

### Lo que se evaluó y se decidió no hacer

Cada uno se descartó con evidencia, no por pereza:

- **Sacar `<meta name="keywords">`.** Google documenta que no la usa. Justamente
  por eso borrarla no mueve ninguna señal: no hay mejora que reclamar. Se deja.
- **`noindex` en `/llms.txt` y `/data/negocio.json`.** Google no penaliza el
  duplicado y elige el mejor resultado por consulta; contra una portada con
  título, descripción, `@graph` y la única URL del sitemap, un `.txt` sin título
  no compite. Bloquearlos sólo agregaría reglas que mantener.
- **La canónica y el `robots` que hereda la 404.** La ruta responde 404 de
  verdad, y Google descarta el cuerpo de una 404: no canonicaliza desde ahí ni
  la indexa. Es ruido en el HTML, no una señal.
- **Rutas por marca o por modelo** (`/motos/honda/…`). Sigue sin poder hacerse
  sin inventar. Ver "Por qué no hay catálogo por modelo", más arriba.
- **`sameAs` con la URL de la ficha de Google** y **`primaryImageOfPage`
  apuntando a la imagen para compartir.** Los dos se revisaron a fondo y los dos
  quedan: no contradicen nada de lo visible ni rompen ninguna regla del
  vocabulario.
- **Escribir la calle completa** ("Bartolomé Mitre") además de la abreviada. La
  ficha de Google publica esa calle como `RN158`, así que el que hay que
  corregir es el perfil, no el sitio.

## Lo que falta, y no es código

Por orden de impacto:

1. **Corregir la dirección en la ficha de Google.** La ficha publica `RN158,
   X5940 Las Varillas`; el sitio dice `B. Mitre 310`. Es el mismo punto
   —Bartolomé Mitre es la traza urbana de la RN158— pero Google los lee como
   dos datos distintos, y la coherencia entre ficha y web es uno de los pocos
   factores de las tres fichas del mapa sobre los que se puede actuar.

2. **Reseñas.** Es el factor con más peso después de la proximidad. No se
   compran ni se falsifican: se piden. Un cartel en el mostrador con el QR de
   la ficha, y pedirla en el momento de entregar una moto o terminar un
   arreglo, es todo el método. Importa el flujo sostenido más que el total.

3. **Alinear el horario en Instagram y en la ficha.** El de la tarde quedó
   confirmado en `15:30 a 19:30`, que es lo que publican el sitio y el marcado
   `LocalBusiness`. La bio de Instagram dice `16:00 a 20:00` y es la que está
   mal. Un horario mal declarado manda gente a un local cerrado, y Google
   compara lo que dicen las distintas fuentes del negocio.

4. **Fotos en la ficha.** Las fichas con fotos reciben bastante más contacto
   que las que no tienen. Frente del local, mostrador, taller.

5. **Publicar el sitio y verificarlo en Search Console.** Sin eso no hay datos
   de qué busca la gente que llega, y el sitemap no está entregado.

## Cómo repetir esta auditoría

```bash
npm run build
```

El HTML de producción queda en `.next/server/app/index.html`, y el sitemap y el
robots en `sitemap.xml.body` y `robots.txt.body` de esa misma carpeta. Ahí se
verifican título, canónica, encabezados y JSON-LD sin necesidad de publicar.

Para el rendimiento, con el sitio servido en `next start`:

```bash
node tools/medir-lab.mjs http://localhost:3100/
```

Estrangula la red y la CPU como PageSpeed móvil e informa FCP, LCP, CLS, tareas
largas y el peso por tipo de recurso. Es lo único que hace comparables dos
versiones: sin el mismo apretón, los números no dicen nada.

Con el sitio ya publicado, los dos controles que faltan son
[PageSpeed Insights](https://pagespeed.web.dev/) para las métricas de campo y
la [prueba de resultados enriquecidos](https://search.google.com/test/rich-results)
para el marcado.
