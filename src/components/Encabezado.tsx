'use client';

import Image from 'next/image';
import Link from 'next/link';
import { IconoWhatsapp } from '@/components/Iconos';
import { useDesplazado, useSeccionActiva } from '@/components/Reactividad';
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

export function Encabezado() {
  const activa = useSeccionActiva(IDS);
  const desplazado = useDesplazado(32);

  return (
    <header
      data-desplazado={desplazado ? 'si' : undefined}
      className="encabezado bg-papel-alto sticky top-0 z-40"
    >
      <div className="contenedor flex h-16 items-center justify-between gap-4 lg:h-19">
        {/* La marca del negocio, separada a las dos tintas del plano claro:
            la palabra en tinta y la moto en naranja. La versión sobre papel
            vive en el pie. */}
        <Link href="/" className="inline-block py-2 no-underline">
          <Image
            src="/marca/motos-beto-tinta.png"
            alt="Motos Beto"
            width={1600}
            height={254}
            priority
            // Se muestra a 40 px de alto, o sea 252 de ancho: sin esto el
            // navegador se baja la marca a tamaño de cartel.
            sizes="252px"
            className="h-8 w-auto lg:h-10"
          />
        </Link>

        <nav aria-label="Secciones" className="hidden items-center gap-7 lg:flex">
          {SECCIONES.map((seccion) => (
            <a
              key={seccion.id}
              href={`#${seccion.id}`}
              aria-current={activa === seccion.id ? 'true' : undefined}
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
            aria-current={activa === seccion.id ? 'true' : undefined}
            className="enlace-seccion rotulo inline-flex min-h-11 items-center px-0.5 whitespace-nowrap no-underline"
          >
            {seccion.corto}
          </a>
        ))}
      </nav>
    </header>
  );
}
