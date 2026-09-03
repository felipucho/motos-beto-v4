import { HuecoFoto } from '@/components/HuecoFoto';
import { TituloSeccion } from '@/components/TituloSeccion';
import { fotos } from '@/lib/fotos';
import { negocio } from '@/lib/negocio';

const { bicicletas } = negocio;

/**
 * El rubro que nadie asocia con un local que se llama "Motos Beto". Por eso se
 * lleva la hoja más fuerte del afiche: naranja de borde a borde y el mismo
 * cuerpo de titular que las motos, no una viñeta adentro de otra sección.
 *
 * Sobre el naranja hay dos tintas posibles y ninguna es un gris: el papel para
 * el texto de lectura, la tinta para las líneas grandes. La jerarquía la hace
 * el tamaño, que es como se hace en una imprenta de dos pasadas.
 */
export function Bicicletas() {
  return (
    <section id="bicis" className="ancla plano-naranja">
      <div className="contenedor pliego">
        <TituloSeccion tono="claro">Bicicletas</TituloSeccion>

        <p className="cartel text-t3 text-tinta mt-6">{bicicletas.tipos}</p>

        <ul className="border-papel-alto mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-2 border-y-2 py-7">
          {bicicletas.marcas.map((marca) => (
            <li key={marca} translate="no" className="cartel text-t2 text-papel-alto">
              {marca}
            </li>
          ))}
        </ul>

        {/* Sin rótulos: cada frase ya dice de qué habla, y una etiqueta que
            repite la primera palabra de la frase es ruido impreso. */}
        <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <p className="cartel text-t3 text-tinta">{bicicletas.accesorios}</p>
          </div>

          <div>
            <p className="cartel text-t3 text-tinta">{bicicletas.alquiler}</p>
            <p className="mt-3 text-dato">Disponibilidad y condiciones, en el local.</p>
          </div>
        </div>

        <HuecoFoto
          foto={fotos.bicicletas}
          proporcion="21 / 9"
          className="mt-12"
          sizes="(min-width: 78rem) 74rem, 100vw"
        />
      </div>
    </section>
  );
}
