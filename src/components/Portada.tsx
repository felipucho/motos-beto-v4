import { HuecoFoto } from '@/components/HuecoFoto';
import { IconoFlecha, IconoWhatsapp } from '@/components/Iconos';
import { fotos } from '@/lib/fotos';
import { direccion, negocio } from '@/lib/negocio';

/**
 * La hoja de portada.
 *
 * A la izquierda, tres palabras del tamaño de una pared: es lo único que hace
 * falta para que alguien sepa en un segundo si esta puerta le sirve. A la
 * derecha, sangrando al borde de la pantalla, la chapa de dirección con el
 * número puesto como monumento y no como renglón.
 *
 * El hueco de la foto del frente está medido arriba de la chapa: cuando la foto
 * llegue entra ahí, en duotono, como una tinta más del afiche, y la chapa se
 * corre abajo sin que se mueva nada del texto.
 */
export function Portada() {
  return (
    <section className="bg-papel">
      <div className="lg:grid lg:grid-cols-[1.06fr_0.94fr] lg:items-stretch">
        <div className="margen-cartel py-14 md:py-20 lg:py-24">
          <h1 className="cartel text-t1 text-tinta">
            <span className="block">Motos</span>
            <span className="text-naranja block">Bicicletas</span>
            <span className="block">Repuestos</span>
            {/* La localidad no es parte del apilado: va a ancho normal y con
                interletrado abierto, como el sello al pie de un afiche. */}
            <span className="text-t3 mt-5 block [font-stretch:100%] [word-spacing:normal] tracking-[0.05em]">
              en Las&nbsp;Varillas
            </span>
          </h1>

          <div className="regla mt-9 pt-5">
            <p className="rotulo text-menuda text-tinta-media">{negocio.antiguedad}</p>
            <p className="text-guia medida mt-4">
              Taller propio al lado, gestoría para los papeles y financiación en cuotas.
            </p>
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            {/* El glifo alcanza para decir por dónde se escribe; repetir la
                palabra en cada botón de la página es ruido. */}
            <a
              href={negocio.whatsappLink}
              target="_blank"
              rel="noreferrer noopener"
              className="accion accion-naranja max-xs:w-full"
            >
              <IconoWhatsapp width={20} height={20} />
              Escribinos
            </a>
            <a
              href={negocio.comoLlegarLink}
              target="_blank"
              rel="noreferrer noopener"
              className="accion accion-contorno max-xs:w-full"
            >
              Cómo llegar
              <IconoFlecha width={18} height={18} />
            </a>
          </div>
        </div>

        <div className="pasada flex flex-col">
          <HuecoFoto
            foto={fotos.frente}
            proporcion="4 / 3"
            prioridad
            tinte
            className="w-full"
            sizes="(min-width: 64rem) 47vw, 100vw"
          />
          <ChapaDireccion />
        </div>
      </div>
    </section>
  );
}

/**
 * La chapa: el 310 impreso al tamaño que tiene en la vereda. Toda la chapa es
 * el enlace al mapa, así que no hace falta un botón adentro.
 */
function ChapaDireccion() {
  return (
    <a
      href={negocio.mapaLink}
      target="_blank"
      rel="noreferrer noopener"
      className="plano-naranja hover:bg-naranja-hondo group flex flex-1 flex-col justify-end px-6 py-10 no-underline transition-colors duration-200 sm:px-10 md:py-14 lg:px-12"
    >
      {/* Calle y número son un solo bloque apoyado abajo: el número suelto en
          el medio de un campo grande se lee como un dato flotando, no como el
          número que está pintado en la vereda. */}
      <span className="rotulo text-menuda block">B. Mitre</span>

      <span className="cartel text-placa mt-1 block" translate="no">
        310
      </span>

      <span className="border-papel-alto rotulo text-menuda mt-6 flex items-center justify-between gap-4 border-t-2 pt-4">
        {direccion.localidad} · {direccion.provincia}
        <IconoFlecha
          width={18}
          height={18}
          className="shrink-0 transition-transform duration-200 group-hover:translate-x-1.5"
        />
      </span>
    </a>
  );
}
