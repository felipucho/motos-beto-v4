import { IconoFlecha } from '@/components/Iconos';
import { MapaDiferido } from '@/components/MapaDiferido';
import { TituloSeccion } from '@/components/TituloSeccion';
import { direccion, negocio } from '@/lib/negocio';

export function Ubicacion() {
  return (
    <section id="donde" className="ancla bg-papel">
      <div className="contenedor pliego">
        {/* La columna de texto es angosta a propósito: son dos líneas y un
            botón, y lo que se mira acá es el mapa. */}
        <div className="grid gap-10 lg:grid-cols-[0.58fr_1.42fr] lg:items-start lg:gap-16">
          <div>
            <TituloSeccion>Dónde estamos</TituloSeccion>

            <address className="cartel text-t3 text-tinta mt-7 not-italic">
              {direccion.calle}
              <br />
              {direccion.localidad}, {direccion.provincia}
            </address>

            {/* Acá no vuelve a ir el horario: la hoja de arriba es justamente la
                de horarios, y la franja de tinta ya trae el de hoy. */}

            <a
              href={negocio.comoLlegarLink}
              target="_blank"
              rel="noreferrer noopener"
              className="accion accion-contorno mt-8"
            >
              Cómo llegar
              <IconoFlecha width={18} height={18} />
            </a>
          </div>

          <div className="border-tinta border-[3px]">
            <MapaDiferido />
          </div>
        </div>
      </div>
    </section>
  );
}
