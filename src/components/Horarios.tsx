'use client';

import { ChipEstado, useEstadoApertura } from '@/components/EstadoApertura';
import { Revelar } from '@/components/Reactividad';
import { RelojSemana } from '@/components/RelojSemana';
import { TituloSeccion } from '@/components/TituloSeccion';
import { parsearDias } from '@/lib/horario';
import { negocio } from '@/lib/negocio';

/**
 * Los grupos tal como los escribió el dueño en `data/negocio.js`: "Lunes a
 * viernes", "Sábados", "Domingos". Cada uno sabe qué días cubre, para poder
 * marcar el que contiene hoy.
 */
const GRUPOS = negocio.horarios.map((fila) => ({
  ...fila,
  indices: parsearDias(fila.dias),
}));

/**
 * El dato que la gente vino a buscar, dos veces y a propósito: como reloj —para
 * el vistazo, con el hueco del mediodía a la vista y la aguja en la hora que
 * es— y como tabla —para el dato exacto y para el lector de pantalla, que no ve
 * el reloj.
 *
 * La tabla lista grupos, no días. Listar los siete implicaba escribir cinco
 * veces seguidas el mismo horario; el detalle día por día ya lo da el reloj.
 */
export function Horarios() {
  const { hoy } = useEstadoApertura();

  return (
    <section id="horarios" className="ancla plano-tinta">
      <div className="contenedor pliego">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-14">
          {/* El estado se apoya en el pie de su columna, a la altura de la
              última regla de la tabla: si queda pegado al título, la columna
              izquierda termina a media altura y deja el plano de tinta vacío. */}
          <div className="lg:flex lg:h-full lg:flex-col lg:justify-between">
            <TituloSeccion tono="claro">Horarios</TituloSeccion>

            <div className="border-papel-suave mt-7 border-t-2 pt-6 lg:mt-10">
              <ChipEstado className="!text-base !tracking-[0.09em]" />
            </div>
          </div>

          {/* En pantalla ancha el reloj baja a una banda de ancho completo bajo
              el título y la tabla; en teléfono queda donde tiene que estar, justo
              debajo del estado. La única aparición de la página vive acá: las
              franjas se imprimen de izquierda a derecha al entrar, el mismo gesto
              que la chapa de la portada al cargar. */}
          <Revelar className="lg:order-3 lg:col-span-2">
            <RelojSemana />
          </Revelar>

          <table className="w-full border-collapse text-left lg:order-2">
            <caption className="sr-only">
              Horario de atención de Motos Beto, semana completa
            </caption>
            <thead>
              <tr className="border-papel-suave border-b-2">
                <th scope="col" className="rotulo text-papel-suave pb-3">
                  Día
                </th>
                <th scope="col" className="rotulo text-papel-suave pb-3">
                  Atención
                </th>
              </tr>
            </thead>
            <tbody>
              {GRUPOS.map((grupo) => {
                const esHoy = hoy !== null && grupo.indices.includes(hoy);

                return (
                  <tr
                    key={grupo.dias}
                    aria-current={esHoy ? 'date' : undefined}
                    className={`border-papel-suave border-b-2 ${esHoy ? 'bg-tinta-media' : ''}`}
                  >
                    <th
                      scope="row"
                      className="text-papel-alto w-44 py-7 pl-3 align-top text-dato font-bold"
                    >
                      <span className="inline-flex items-center gap-2.5">
                        {esHoy ? (
                          <span
                            aria-hidden="true"
                            className="bg-naranja-vivo inline-block size-2.5 shrink-0"
                          />
                        ) : null}
                        {grupo.dias}
                        {esHoy ? <span className="sr-only"> (hoy)</span> : null}
                      </span>
                    </th>
                    <td
                      className={`cifras py-7 pr-3 align-top text-dato ${
                        esHoy ? 'text-papel-alto font-bold' : 'text-papel-suave'
                      }`}
                    >
                      {grupo.horas}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
