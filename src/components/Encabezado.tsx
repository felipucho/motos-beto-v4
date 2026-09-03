import Image from 'next/image';
import Link from 'next/link';
import { IconoWhatsapp } from '@/components/Iconos';
import { NavegacionViva } from '@/components/NavegacionViva';
import { negocio } from '@/lib/negocio';

const SECCIONES = [
  { id: 'motos', texto: 'Motos', corto: 'Motos' },
  { id: 'bicis', texto: 'Bicicletas', corto: 'Bicis' },
  { id: 'taller', texto: 'Taller', corto: 'Taller' },
  { id: 'horarios', texto: 'Horarios', corto: 'Horarios' },
  // En la fila angosta entran cuatro rótulos, no seis: medido a 320 px,
  // el quinto se come el colchón lateral del contenedor. Los dos que se caen
  // son los que ya tienen otra puerta a un toque de distancia — la dirección
  // está enlazada en la chapa de la portada, y el WhatsApp es el botón fijo
  // del encabezado. Se cae el enlace, nunca la sección.
  { id: 'donde', texto: 'Dónde estamos', corto: null },
  { id: 'contacto', texto: 'Contacto', corto: null },
];

const EN_TELEFONO = SECCIONES.filter((seccion) => seccion.corto !== null);

// En orden de documento: el observador toma la última visible, no la primera.
const IDS = ['motos', 'bicis', 'taller', 'horarios', 'donde', 'contacto'];

/**
 * El encabezado se imprime entero en el servidor. Lo único que ocurre en el
 * navegador son dos atributos —la regla al desplazarse y el enlace de la
 * sección en pantalla—, y de eso se ocupa `NavegacionViva`, que no dibuja nada.
 */
export function Encabezado() {
  return (
    <header data-encabezado className="encabezado bg-papel-alto sticky top-0 z-40">
      <NavegacionViva ids={IDS} />

      <div className="contenedor flex h-16 items-center justify-between gap-4 lg:h-19">
        {/* La marca del negocio, separada a las dos tintas del plano claro:
            la palabra en tinta y la moto en naranja. La versión sobre papel
            vive en el pie.

            Sin `priority`. La marca no es el elemento más grande de la pantalla
            —eso es el titular— y precargarla con prioridad alta le robaba ancho
            de banda a las tipografías, que sí deciden cuándo se puede leer el
            cartel. Va con `fetchPriority="high"` para que no quede al final de
            la cola, pero sin ocupar la primera ranura. */}
        <Link href="/" className="inline-block py-2 no-underline">
          <Image
            src="/marca/motos-beto-tinta.png"
            alt="Motos Beto"
            width={1600}
            height={254}
            fetchPriority="high"
            // Se muestra a 32 px de alto en el teléfono y a 40 en el escritorio;
            // con la proporción de la pieza eso es 202 y 252 px de ancho. Decirlo
            // por separado evita que el teléfono baje la variante del escritorio.
            sizes="(min-width: 64rem) 252px, 202px"
            className="h-8 w-auto lg:h-10"
          />
        </Link>

        <nav aria-label="Secciones" className="hidden items-center gap-7 lg:flex">
          {SECCIONES.map((seccion) => (
            <a
              key={seccion.id}
              href={`#${seccion.id}`}
              data-seccion={seccion.id}
              className="enlace-seccion rotulo text-menuda no-underline"
            >
              {seccion.texto}
            </a>
          ))}
        </nav>

        {/* Una sola acción persistente. El llamado grande vive en la portada y
            en la hoja de contacto, no encima de todo. */}
        <a
          href={negocio.whatsappLink}
          target="_blank"
          rel="noreferrer noopener"
          className="accion accion-naranja !min-h-11 !px-4 lg:!min-h-12 lg:!px-5"
        >
          <IconoWhatsapp width={18} height={18} />
          <span className="xs:inline hidden">WhatsApp</span>
          <span className="xs:hidden">Escribir</span>
        </a>
      </div>

      {/* En el teléfono la navegación baja a una fila propia: sin menú
          desplegable, sin superposición, todo a un toque. */}
      <nav
        aria-label="Secciones"
        className="border-gris-plano contenedor flex items-center justify-between gap-1 border-t-2 sm:justify-start sm:gap-9 lg:hidden"
      >
        {EN_TELEFONO.map((seccion) => (
          <a
            key={seccion.id}
            href={`#${seccion.id}`}
            data-seccion={seccion.id}
            className="enlace-seccion rotulo inline-flex min-h-11 items-center px-0.5 whitespace-nowrap no-underline"
          >
            {seccion.corto}
          </a>
        ))}
      </nav>
    </header>
  );
}
