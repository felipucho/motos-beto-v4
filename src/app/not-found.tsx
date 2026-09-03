import Link from 'next/link';
import { IconoFlecha } from '@/components/Iconos';
import { negocio } from '@/lib/negocio';

export const metadata = { title: 'Página no encontrada' };

export default function NoEncontrada() {
  return (
    <main className="plano-naranja grid min-h-dvh place-items-center">
      <div className="contenedor py-20">
        <h1 className="cartel text-t1 text-papel-alto">
          Esta página
          <br />
          no existe
        </h1>

        <p className="medida border-papel-alto mt-9 border-t-2 pt-5">
          Puede que el enlace esté viejo. Todo lo de {negocio.nombre} está en la página principal.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/" className="accion accion-tinta">
            Ir al inicio
            <IconoFlecha width={18} height={18} />
          </Link>
          <a
            href={negocio.whatsappLink}
            target="_blank"
            rel="noreferrer noopener"
            className="accion accion-contorno-clara"
          >
            Escribir por WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
