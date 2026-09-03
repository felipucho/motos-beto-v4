# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4. Elegido por el usuario en la ronda de stack. Destino de deploy: Vercel.

## Users

Vecinos de Las Varillas (Córdoba) y de la zona rural que la rodea, buscando una moto o un repuesto. Dos situaciones distintas:

- **El que compra una moto.** Compra poco frecuente, monto alto para su bolsillo. Necesita saber que el negocio existe, dónde queda, y poder preguntar por WhatsApp sin ir hasta el local.
- **El que necesita un repuesto o un accesorio.** Recurrente y urgente: la moto es herramienta de trabajo o el único transporte. Su pregunta real es "¿está abierto ahora y lo tienen?".

Ambos llegan mayoritariamente desde el teléfono, muchas veces desde una búsqueda en Google del tipo "motos Las Varillas" o desde el enlace en la bio de Instagram.

## Product Purpose

Dar a Motos Beto una presencia propia en la web que hoy no tiene. Éxito = aparecer en las búsquedas locales de motos y repuestos en Las Varillas, y que quien llegue pueda en menos de diez segundos saber dónde queda el local, si está abierto y cómo escribir por WhatsApp.

No es un e-commerce ni un catálogo con precios. Es la ficha del negocio, bien hecha.

## Positioning

Comercio físico establecido en el centro de Las Varillas (B. Mitre 310), con más de 25 años abierto. **Subagente multimarca, no concesionario oficial**, y esa distinción se publica tal cual porque es verdad y porque el dueño la dijo así.

Cuatro patas bajo el mismo techo, y sólo la primera es obvia desde el nombre del negocio:

1. **Motos** — Honda, Yamaha, Guerrero, Corven y CF Moto. Usadas seleccionadas y toma de usados en parte de pago.
2. **Bicicletas** — diez años en el rubro. Mountain bike y ruta, accesorios y repuestos, y alquiler.
3. **Taller propio**, en el local de al lado: service, mecánica mayor y motos de clientes que no compraron ahí.
4. **Repuestos y trámites** — repuestos de moto y bici, envíos a otras localidades por comisionista, y gestoría propia para patentamiento y papeles.

El diferencial declarado por el dueño no es el precio ni el catálogo: es que explican. Se dice cómo va colocado un repuesto, o se lo colocan; se explica cómo se usa una moto o una bici antes de que el cliente salga.

**Nada de esto se publica hoy.** El sitio tuvo una sección con la trayectoria (más de 25 años el negocio, 32 el dueño en el rubro, 10 con bicicletas) y con esa forma de atender; el usuario la sacó porque no le gustó cómo sonaba escrita. La información queda acá porque es cierta y es el activo más fuerte del negocio, no porque esté en la página.

## Operating Context

- Local a la calle en B. Mitre 310, Las Varillas, Córdoba.
- Horario partido, con siesta: lunes a viernes 8:30–12:30 y 15:30–19:30; sábados 9:30–12:30; domingos cerrado.
- El canal de contacto real es WhatsApp (+54 9 3533 68-9287), más el teléfono fijo (03533) 68-9287.
- Instagram @motosbetolv es la presencia digital actual y seguirá siendo el canal de novedades.
- Las consultas típicas ocurren fuera del horario de atención, de noche o durante la siesta.

## Capabilities and Constraints

- La única fuente de datos del sitio es `data/negocio.js`. Todo dato de contacto, horario o dirección sale de ahí; nada se duplica a mano en los componentes.
- Sitio estático, sin backend, sin base de datos, sin login. No hay formulario con envío de correo: el contacto es WhatsApp, teléfono y mapa.
- **Sin catálogo y sin precios.** Hay marcas y tipos de producto confirmados, pero no lista de modelos, stock ni precios. El sitio no es una tienda.
- **Los coeficientes de financiación no se publican.** Existen (3 meses, 6 meses, 12 meses) y el dueño los tiene, pero cambian seguido: un porcentaje viejo en una página estática es una discusión en el mostrador. Se publica el plazo, que es lo que no cambia.
- **Nombres propios dudosos, afuera.** El contenido salió de un audio. Las marcas que no se entendieron con certeza —una marca de moto, dos de bicicleta, cuatro de repuesto, dos de casco, dos financieras— no se publican hasta que el dueño confirme la grafía. La lista está en el README.
- **Sin datos personales de terceros.** El local tiene dos dueños; se publica sólo el nombre de Beto, que él mismo dio para el sitio. El nombre de la socia no se publica sin su consentimiento, y nada del ámbito privado de ninguno de los dos entra al sitio.
- Teléfono confirmado por el usuario: (03533) 68-9287. Páginas Amarillas publica además (03533) 42-1487; se descarta por ahora.
- Horario de tarde confirmado por el usuario: 15:30–19:30. La bio de Instagram dice 16:00–20:00; se descarta por ahora. **Vale reconfirmar con el dueño antes de publicar.**

## Brand Commitments

- Nombre: **Motos Beto**. Usuario de Instagram: @motosbetolv.
- No existe logo, isotipo ni paleta previa entregada. La identidad visual se define desde cero.
- Voz: rioplatense, de pueblo, directa. Voseo. Sin marketing inflado ni superlativos.
- **Preferencia permanente del usuario: el canon del rubro, jugado derecho.** En la ronda de dirección el usuario descartó tres direcciones a medida y eligió la puerta de salida: la estructura convencional de ficha de negocio (encabezado, apertura con foto, servicios, horarios, mapa, contacto), ejecutada a nivel agencia, sin ironía y sin rarezas metidas de contrabando. Vale para este sitio y para todo trabajo futuro salvo que el usuario diga lo contrario.
- **Vara de oficio: el comercio local resuelto por estudio.** Pocos datos, mucho aire, jerarquía impecable, horarios y mapa como protagonistas. La calidad se mide en precisión, no en despliegue visual. Elegida por el usuario por sobre las marcas de moto argentinas y el retail internacional de autor, por ser la más honesta con los materiales realmente disponibles.

## Evidence on Hand

- `data/negocio.js` — dirección, teléfonos, WhatsApp con mensaje prellenado, Instagram, horarios, enlaces de mapa. Fuente única y confirmada.
- Rubros publicados en Páginas Amarillas: "Motocicletas y Ciclomotores" y "Repuestos y Accesorios".
- Bio de Instagram: horario y dirección (con la discrepancia horaria ya anotada).
- **Fotografía: pendiente.** El usuario tiene fotos del local y de las motos pero todavía no las entregó. El sitio se construye con huecos de proporción fija y documentados en `public/fotos/README.md`, listos para recibirlas.
- **Audio del dueño, 1 de septiembre de 2026** — marcas de moto y de bicicleta, modelos más vendidos, política de usados, formas de pago y plazos, trabajos del taller, repuestos, envíos, gestoría, antigüedad del negocio y del dueño, y el diferencial de atención. Es la fuente de toda la mitad nueva de `data/negocio.js`.
- **No hay** testimonios, reseñas publicadas en el sitio, premios ni métricas de venta. Nada de esto puede inventarse. Las 62 reseñas de Google con 4,6 estrellas existen, pero el sitio no las cita: no se declara `aggregateRating` que el sitio no pueda sostener por sí mismo.

## Product Principles

1. **Solo lo verificado.** Ningún dato entra al sitio sin fuente. Ante la duda, se omite; nunca se rellena.
2. **La pregunta real es "¿está abierto?".** El estado de apertura y el camino al WhatsApp mandan sobre cualquier otra cosa en la jerarquía.
3. **Un solo origen de datos.** `data/negocio.js` manda; el dueño cambia un teléfono ahí y cambia en todo el sitio, incluido el marcado de SEO.
4. **Existir en la búsqueda local.** El objetivo declarado es aparecer en Google para búsquedas de la zona: contenido indexable, no texto dentro de imágenes, marcado `LocalBusiness` fiel a los datos reales.
5. **El teléfono primero.** Se diseña para una mano, en la calle, con sol. El escritorio es el caso secundario.

## Accessibility & Inclusion

Público amplio en edad, con manejo dispar de tecnología y conexiones móviles de pueblo. Objetivo WCAG 2.2 AA: contraste real, objetivos táctiles cómodos, foco visible, navegable por teclado, y funcional sin JavaScript en todo lo que sea información de contacto.
