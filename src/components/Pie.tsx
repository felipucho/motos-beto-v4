import Image from 'next/image';
import { direccion, negocio } from '@/lib/negocio';

/**
 * El colofón: la marca impresa grande abajo de todo, como firma el taller que
 * imprimió el afiche, y debajo la letra chica. Acá va la separación sobre
 * plano de tinta —palabra en papel, moto en naranja vivo—.
 */
export function Pie() {
  return (
    <footer className="plano-tinta">
      <div className="contenedor py-14 md:py-16">
        <Image
          src="/marca/motos-beto-papel.png"
          alt="Motos Beto"
          width={1600}
          height={254}
          sizes="404px"
          className="h-12 w-auto md:h-16"
        />

        <div className="border-papel-suave mt-8 flex flex-col gap-6 border-t-2 pt-6 md:flex-row md:items-baseline md:justify-between">
          <p className="text-papel-suave text-dato">
            {negocio.rubro} en {direccion.localidad}, {direccion.provincia}.
            <br />
            {direccion.calle} · <span className="cifras">{negocio.telefonoTexto}</span>
          </p>

          <p className="rotulo text-papel-suave">© {negocio.nombre}</p>
        </div>
      </div>
    </footer>
  );
}
