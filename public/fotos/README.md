# Fotos del negocio

Acá van las fotos reales del local y de las motos. Hoy no hay ninguna, y el
sitio está diseñado para verse terminado igual: cada hueco muestra un plano de
color liso con la marca de rueda.

## Cómo sumar una foto

1. Copiá el archivo a esta carpeta, con un nombre en minúsculas y sin espacios:
   `frente.jpg`, `motos.jpg`, `repuestos.jpg`.
2. Abrí `src/lib/fotos.ts` y completá la entrada correspondiente:

   ```ts
   frente: {
     src: '/fotos/frente.jpg',
     alt: 'Frente del local de Motos Beto sobre calle Mitre, con las motos en la vereda',
     ancho: 1600,
     alto: 2000,
   },
   ```

3. Listo. La foto entra en el hueco sin mover el resto del layout.

## Proporciones y tamaños

| Entrada     | Dónde aparece           | Proporción | Ancho mínimo recomendado |
| ----------- | ----------------------- | ---------- | ------------------------ |
| `frente`    | Portada, a la derecha   | 4:5 (vertical) | 1200 px               |
| `motos`     | "Qué vendemos", arriba  | 16:11 (apaisada) | 1600 px             |
| `repuestos` | "Qué vendemos", abajo   | 4:3 (apaisada) | 1000 px               |

Recortá la foto a la proporción antes de subirla: Next.js la ajusta con
`object-fit: cover`, así que si la proporción no coincide se recorta sola y
podés perder algo importante del encuadre.

## El texto alternativo

El `alt` describe lo que se ve, para quien no puede ver la foto y para Google.
"Foto del local" no sirve. "Frente del local sobre calle Mitre con dos motos en
la vereda" sí.
