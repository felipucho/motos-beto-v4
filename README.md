# Motos Beto

Sitio web de **Motos Beto**: motos, bicicletas, repuestos y taller propio en
B. Mitre 310, Las Varillas, Córdoba.

Una sola página. El objetivo declarado es la búsqueda local: que el sitio
aparezca cuando alguien de la zona busca "motos Las Varillas" o "bicicletas
Las Varillas", y que quien llegue sepa en diez segundos qué se vende, dónde
queda el local, si está abierto y cómo escribir por WhatsApp.

## Arrancar

```bash
npm install
npm run dev        # http://localhost:3000
```

| Comando             | Qué hace                                    |
| ------------------- | ------------------------------------------- |
| `npm run dev`       | Servidor de desarrollo                      |
| `npm run build`     | Build de producción                         |
| `npm start`         | Sirve el build de producción                |
| `npm run serve`     | Buildea y sirve, en un solo paso            |
| `npm run lint`      | ESLint                                      |
| `npm run typecheck` | TypeScript sin emitir                       |

> **No corras `npm run build` con `npm start` levantado.** El build reemplaza
> `.next` debajo del proceso que está sirviendo: el HTML sale con los hashes
> nuevos pero el servidor tiene cargado el manifiesto viejo, y el CSS y el JS
> pasan a devolver `HTTP 500` con `text/plain`. La página se ve como HTML pelado,
> sin un solo error visible que lo explique. Usá `npm run serve`, o parar el
> servidor antes de buildear.

## Cómo se cambian los datos del negocio

**Todo sale de un solo archivo: `data/negocio.js`.** Teléfono, WhatsApp,
dirección, horarios, Instagram, los enlaces al mapa **y todo lo que el sitio
dice que el negocio hace**: marcas, formas de pago, trabajos del taller,
repuestos, trámites y trayectoria. Se edita ese archivo y cambia el sitio
entero, incluido el marcado de Google (`LocalBusiness`), el cartel de "abierto
ahora" y la tabla de horarios. No hay ninguna afirmación sobre el negocio
escrita a mano dentro de un componente.

La segunda mitad del archivo —de `motos` para abajo— la dictó el dueño el 1 de
septiembre de 2026. Cada bloque lleva el comentario de por qué dice lo que dice
y, donde corresponde, por qué **no** dice algo (los coeficientes de
financiación, por ejemplo, que cambian seguido y envejecen mal en una página
estática).

Los horarios se escriben como los diría una persona:

```js
horarios: [
  { dias: 'Lunes a viernes', horas: '8:30 a 12:30 hs y 15:30 a 19:30 hs' },
  { dias: 'Sábados',         horas: '9:30 a 12:30 hs' },
  { dias: 'Domingos',        horas: 'Cerrado' },
],
```

`src/lib/horario.ts` los interpreta: entiende rangos ("Lunes a viernes"), días
sueltos ("Lunes, miércoles y viernes"), varios tramos en un día y la palabra
"Cerrado". Un día que ninguna fila menciona queda cerrado, que es la lectura
segura: el sitio nunca anuncia atención que el dueño no declaró.

Después de tocar los horarios, correr `node tools/probar-horarios.mjs` con el
sitio levantado.

## Fotos

Todavía no hay ninguna. La página está compuesta para verse terminada sin
fotos: donde no hay imagen no se dibuja nada, nunca un panel de relleno.

Para sumarlas, ver **`public/fotos/README.md`**: hay que copiar el archivo a
`public/fotos/` y completar la entrada en `src/lib/fotos.ts`. Las proporciones
están fijadas, así que la foto entra sin mover el resto del layout.

## Antes de publicar

1. **Definir `NEXT_PUBLIC_SITE_URL`** en Vercel, con el dominio real y sin
   barra final (`https://motosbeto.com.ar`). Sin esa variable el sitemap, el
   `robots.txt`, la URL canónica y el marcado `LocalBusiness` apuntan a
   `localhost` y el SEO no sirve para nada.
2. **Reconfirmar el horario de la tarde con el dueño.** `data/negocio.js` dice
   `15:30 a 19:30`; la bio de Instagram dice `16:00 a 20:00`. Se publicó el
   primero por decisión del usuario, pero el dato conviene chequearlo.
3. **Reconfirmar el teléfono fijo.** Se publica `(03533) 68-9287`, que es el que
   coincide con el WhatsApp. Páginas Amarillas publica además
   `(03533) 42-1487`, que quedó descartado.
4. **Corregir la dirección en la ficha de Google.** El perfil del negocio
   existe y está enlazado, pero publica la calle como `RN158, X5940 Las
   Varillas`. El sitio dice `B. Mitre 310`. Son el mismo punto —Bartolomé
   Mitre es la traza urbana de la RN158, y la dirección geocodifica a 15
   metros del pin—, pero el mapa embebido muestra la tarjeta de Google al
   lado de la dirección de la página, así que las dos calles se leen juntas.
   Se corrige desde el Perfil de Empresa de Google, no desde el sitio, y sirve
   más allá de esta página: es lo que ve quien busca el local en el teléfono.
5. **Revisar el resto del Perfil de Empresa de Google** para que nombre,
   dirección y teléfono coincidan exactamente con los del sitio. El marcado
   estructurado ayuda, pero para el mapa de Google el perfil es lo que manda.
   Con el contenido nuevo hay dos categorías que agregar al perfil —tienda de
   bicicletas y taller de motos—, porque son búsquedas distintas.
6. **Que el dueño relea las secciones nuevas.** Motos, Bicicletas y Taller
   salieron de un audio suyo, resumidas y reescritas. Es la primera vez que las
   lee en forma de página, y una frase que en el mostrador suena bien puede no
   querer decirla por escrito. Ver también "Datos a confirmar con el dueño",
   más abajo.

## Datos a confirmar con el dueño

El contenido salió de un audio, y algunos nombres propios no se entendieron con
la certeza suficiente como para publicarlos. **Están afuera del sitio a
propósito**: media marca mal escrita es peor que una marca de menos. Cuando el
dueño los confirme, entran en `data/negocio.js` y aparecen solos.

| Qué se escuchó | Qué falta saber |
| -------------- | --------------- |
| "Cayo moto" | Marca de moto, ¿es Kayo, Keller, otra? |
| "la tac 150" de Corven | Modelo exacto de la enduro Corven |
| "Oxa", "Benzo" (bicicletas) | Grafía real de las dos marcas |
| "bicicleta Stum" | Qué tipo de bicicleta es |
| "W S estándar", "Redcorord", "AVP", "fundas Extreme" | Marcas de repuesto, grafía real |
| "casco H5 de los Hou", "casco Origen" | Marcas de casco, grafía real |
| "crédito cuota", "crédito argentino" | Nombre exacto de las dos financieras |
| Alquiler de bicicletas | ¿Por día, por semana? ¿Hace falta reservar? |

También quedó afuera, y a la espera de una decisión, el nombre de la socia del
local: no se publica el nombre de una persona sin su consentimiento.

Lo que **sí** se publicó y conviene que el dueño relea una vez: las cinco marcas
de moto, las dos de bicicleta, los plazos de financiación y los trabajos del
taller.

## Cómo está armado

```
data/negocio.js          Fuente única de datos del negocio
src/lib/negocio.ts       Tipos y acceso a esos datos
src/lib/horario.ts       Motor de horarios: parseo, estado de apertura, schema
src/lib/texto.ts         Enumerar listas como las escribe una persona
src/lib/fotos.ts         Registro de fotos disponibles
src/lib/site.ts          URL pública del sitio
src/app/layout.tsx       Tipografías, metadatos, contrato de dirección
src/app/globals.css      Sistema de diseño: primitivas, roles, componentes
src/app/page.tsx         Composición de la página
src/components/          Secciones y piezas compartidas
marca/                   El logo original del dueño, intocado
public/marca/            Las piezas de marca que se sirven (generadas)
tools/                   Scripts de prueba (Playwright) y de producción
```

El sistema de color y tipografía está documentado en **`DESIGN.md`**. El
contexto de producto —quién usa esto, qué se puede y qué no se puede afirmar—
está en **`PRODUCT.md`**.

### Estilos

Tailwind v4 con tokens en tres capas dentro de `src/app/globals.css`:
primitivas —las cuatro tintas del afiche, `--color-naranja`, `--color-tinta`,
`--color-gris-plano`, `--color-papel`—, roles semánticos (`--color-plano`,
`--color-accion`, `--color-regla`) y clases de componente (`.cartel`,
`.rotulo`, `.accion`, `.contenedor`). **Ningún componente escribe un color
literal**: todos leen un rol. Para reentintar el sitio entero alcanza con
cambiar la capa de roles.

### Marca

El logo del negocio vive en `marca/origen.png` y **no se toca**. Las piezas que
sirve el sitio se generan:

```bash
node tools/producir-marca.mjs
```

Recorta la banda real del original, separa sus dos tintas y las reimprime en las
tintas del sitio. Ver `public/marca/README.md`.

## Pruebas

Con el sitio levantado (`npm run build && npm start`):

```bash
node tools/probar.mjs <carpeta>          # 5 anchos: overflow, consola, táctil, capturas
node tools/probar-horarios.mjs           # motor de horarios con el reloj congelado
node tools/probar-reactividad.mjs        # navegación activa, revelado, sin JS, marcado
node tools/probar-contraste.mjs          # contraste de la tabla y orden lunes-a-domingo
node tools/probar-a11y.mjs               # axe-core, WCAG 2.2 AA + best practices
node tools/probar-teclado.mjs            # orden de tabulación y anillo de foco
node tools/probar-rendimiento.mjs        # LCP, CLS, peso de la página
node tools/probar-mapa.mjs <archivo.png> # mapa embebido y violaciones de CSP
node tools/probar-404.mjs <carpeta>      # la página de error en dos anchos
node tools/probar-fuentes.mjs            # que ningún peso quede sintetizado
node tools/medir-js.mjs                  # peso comprimido de la primera carga
node tools/capturar-revision.mjs         # capturas de revisión en .impeccable/review/
```

`probar-contraste.mjs` existe por un motivo concreto: axe sólo mide lo que está
en pantalla en ese instante, y la fila del domingo recibe el resalte de "hoy"
justo los domingos, que es cuando su contraste no se puede auditar. El script
congela el reloj en un martes para forzar el peor caso.

Requieren `npx playwright install chromium` una vez.

## Seguridad

`next.config.ts` sirve CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`,
`X-Frame-Options` y `Permissions-Policy`. La CSP permite `'unsafe-inline'` en
scripts porque Next.js inyecta su propio arranque en línea y el marcado
`LocalBusiness` va en un `<script type="application/ld+json">`; como el sitio no
recibe entrada de ningún usuario, no hay superficie de inyección que eso
habilite. Los únicos orígenes externos permitidos son los de Google Maps, por
el mapa embebido.

## Rendimiento medido

Build de producción, Chromium, viewport de 390 px:

| Métrica                | Valor   |
| ---------------------- | ------- |
| LCP                    | 84 ms   |
| CLS                    | 0       |
| JS de primera carga    | 147 KB gzip |
| CSS                    | 6 KB gzip   |
| Tipografías            | 51 KB (dos variables) |

El mapa de Google pesa alrededor de 1,7 MB, pero es `loading="lazy"`: no se
descarga hasta que alguien llega a esa sección.
