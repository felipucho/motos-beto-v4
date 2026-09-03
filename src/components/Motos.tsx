import { FilaFicha, ListaFicha } from '@/components/FilaFicha';
import { HuecoFoto } from '@/components/HuecoFoto';
import { TituloSeccion } from '@/components/TituloSeccion';
import { fotos } from '@/lib/fotos';
import { negocio } from '@/lib/negocio';

const { motos, pagos, pagosNota } = negocio;

/**
 * La tira de marcas es la firma de la hoja: en un local del rubro las marcas
 * están pintadas en el frente al tamaño de la pared, no listadas en una tabla.
 * Acá se imprimen igual, entre dos reglas, y ocupan el ancho entero.
 *
 * Los coeficientes de financiación no se publican. Los tiene el dueño, cambian
 * seguido, y un porcentaje viejo en una página estática es una discusión en el
 * mostrador. Se publica el plazo, que es lo que no cambia.
 */
export function Motos() {
  return (
    <section id="motos" className="ancla bg-papel">
      <div className="contenedor pliego">
        <TituloSeccion>Motos</TituloSeccion>
        <p className="text-guia medida text-tinta-media mt-5">{motos.condicion}</p>

        <ul className="border-tinta mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-2 border-y-[3px] py-7">
          {motos.marcas.map((marca) => (
            <li key={marca} translate="no" className="cartel text-t2 text-naranja">
              {marca}
            </li>
          ))}
        </ul>

        <ListaFicha>
          {motos.masBuscadas.map((item) => (
            <FilaFicha key={item.que} rotulo={item.que}>
              {item.detalle}
            </FilaFicha>
          ))}
          <FilaFicha rotulo="Usadas">{motos.usadas}</FilaFicha>
        </ListaFicha>

        <HuecoFoto
          foto={fotos.motos}
          proporcion="21 / 9"
          className="mt-12"
          sizes="(min-width: 78rem) 74rem, 100vw"
        />
      </div>

      {/* Cómo se paga va en su propio plano de gris, entre dos reglas. Los tres
          plazos se leen de una porque están puestos en columna, no repartidos
          en tarjetas iguales con un ícono arriba. */}
      <div className="plano-gris border-tinta border-y-[3px]">
        <div className="contenedor py-12 md:py-16">
          <h3 className="cartel text-t3 text-tinta">Cómo se paga</h3>

          <dl className="mt-8 grid gap-y-8 sm:grid-cols-3 sm:gap-x-10">
            {pagos.map((pago, i) => (
              <div
                key={pago.forma}
                className={i > 0 ? 'border-tinta-media sm:border-l-2 sm:pl-8' : ''}
              >
                <dt className="rotulo text-tinta-media">{pago.forma}</dt>
                <dd className="font-cartel text-t3 text-tinta mt-2 font-bold">{pago.detalle}</dd>
              </div>
            ))}
          </dl>

          <p className="rotulo text-tinta-media mt-9">{pagosNota}</p>
        </div>
      </div>
    </section>
  );
}
