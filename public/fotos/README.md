# Fotos del negocio

Acá van las fotos reales del local, de las motos, de las bicicletas y del
taller. Hoy no hay ninguna, y el sitio está diseñado para verse terminado igual:
cuando una entrada está en `null`, el hueco **no dibuja nada**. No hay panel de
relleno ni ícono de espera, porque un panel que nunca carga se lee como una
página rota.

Los huecos tienen la proporción fija de antemano, así que la foto entra sin
mover una línea de lo que ya está alrededor.

## Cómo sumar una foto

1. Copiá el archivo a esta carpeta, con un nombre en minúsculas y sin espacios:
   `frente.jpg`, `motos.jpg`, `bicicletas.jpg`, `repuestos.jpg`.
2. Abrí `src/lib/fotos.ts` y completá la entrada correspondiente:

   ```ts
   frente: {
     src: '/fotos/frente.jpg',
     alt: 'Frente del local de Motos Beto sobre calle Mitre, con las motos en la vereda',
     ancho: 1600,
     alto: 1200,
   },
   ```

3. Listo. La foto entra en el hueco sin mover el resto del layout.

## Proporciones y tamaños

Salen de las llamadas a `HuecoFoto` en los componentes; si cambian allá, esta
tabla queda vieja.

| Entrada      | Dónde aparece                        | Proporción       | Ancho mínimo |
| ------------ | ------------------------------------ | ---------------- | ------------ |
| `frente`     | Portada, columna derecha             | 4:3 (apaisada)   | 1200 px      |
| `motos`      | Sección **Motos**, al pie            | 21:9 (panorámica)| 1600 px      |
| `bicicletas` | Sección **Bicicletas**, al pie       | 21:9 (panorámica)| 1600 px      |
| `repuestos`  | Sección **Taller**, bajo *Repuestos* | 21:9 (panorámica)| 1600 px      |

Recortá la foto a la proporción antes de subirla: Next.js la ajusta con
`object-fit: cover`, así que si la proporción no coincide se recorta sola y
podés perder algo importante del encuadre.

**`frente` se imprime en duotono**, no a color: se separa a las dos tintas del
afiche porque ocupa el lugar de la chapa naranja de la portada y tiene que ser
ese plano. Conviene una foto con contraste claro entre el frente y el cielo; una
foto plana o muy gris se empasta al separarla. Las otras tres van como son, con
su marco de imprenta.

## El texto alternativo

El `alt` describe lo que se ve, para quien no puede ver la foto y para Google.
"Foto del local" no sirve. "Frente del local sobre calle Mitre con dos motos en
la vereda" sí.
