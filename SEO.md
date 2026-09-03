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
| Sitemap | `/sitemap.xml`, una URL, la canónica |
| Robots | `/robots.txt` abierto, con sitemap declarado |
| Bots de IA | GPTBot, ClaudeBot, PerplexityBot y Google-Extended permitidos |
| `llms.txt` | Presente, con el negocio descrito en prosa |
| Idioma | `lang="es-AR"` |
| Viewport | Configurado, sin scroll horizontal a 375 px |
| Tap targets | Los 21 enlaces miden 44 px o más |
| CLS | 0 |
| Imágenes sin `alt` | Ninguna |
| Encabezados | Un solo `h1`, jerarquía sin saltos |

El `h1` es el activo más fuerte de la página: dice **Motos / Bicicletas /
Repuestos / en Las Varillas**. Rubro y pueblo, en el elemento que más pesa, sin
sonar a relleno de keywords porque es literalmente el cartel del negocio.

### Datos estructurados

El marcado JSON-LD declara `MotorcycleDealer` + `BikeStore` con dirección,
coordenadas, teléfono, horarios día por día (mañana y tarde separadas),
`areaServed`, `sameAs` a Instagram, `hasMap` y un catálogo con las cinco marcas
—Honda, Yamaha, Guerrero, Corven, CF Moto— y los servicios del taller.

Es más completo que el de la mayoría de los comercios del rubro. Declara además
`priceRange: '$'` y `currenciesAccepted: 'ARS'`. El rango lo eligió el dueño: es
una banda en la escala de uno a cuatro símbolos que usa Google, no un precio, así
que ubica al negocio frente al resto del rubro sin comprometer ningún número.

**No se declara `aggregateRating` ni `review`, y no se va a declarar.** Las
reseñas propias autopublicadas en el marcado están explícitamente prohibidas por
Google para negocios locales, y desde 2019 no generan estrellas en el resultado.
Las reseñas que cuentan son las de la ficha de Google, escritas por clientes.

### Rendimiento

Medido en el servidor de desarrollo, que es más lento que producción por el
recompilado en caliente:

- LCP 1,94 s · FCP 1,88 s · CLS 0 · TTFB 5 ms
- 16 peticiones, 2 fuentes, 1 imagen

En producción baja bastante. Las cifras que van a importar son las de campo, y
sólo se pueden medir con el sitio publicado, en
[PageSpeed Insights](https://pagespeed.web.dev/).

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

Con el sitio ya publicado, los dos controles que faltan son
[PageSpeed Insights](https://pagespeed.web.dev/) para las métricas de campo y
la [prueba de resultados enriquecidos](https://search.google.com/test/rich-results)
para el marcado.
