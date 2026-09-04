'use client';

import { ChipEstado, useEstadoApertura } from '@/components/EstadoApertura';
import { DIA_LARGO, semana } from '@/lib/horario';
import { negocio } from '@/lib/negocio';

const DIAS = semana();

/**
 * La franja del pie del afiche: la banda de tinta donde va la letra chica que
 * el cartel no puede decir a gritos.
 *
 * Lleva tres datos y ninguno se repite en otra parte de la página: si está
 * abierto ahora, qué horario tiene hoy, y el teléfono. La dirección no está
 * acá porque ya es la chapa de la portada.
 */
export function Franja() {
  const { hoy } = useEstadoApertura();

  const filaHoy = hoy === null ? null : DIAS[hoy];
  // Antes de hidratar no se sabe qué día es —el estado se calcula en el
  // navegador, con la zona del negocio—, así que se rotula el grupo que se está
  // mostrando en vez de un genérico. El HTML que se sirve (y el que rastrea
  // Google) traía "Horario" encima del horario de lunes a viernes los siete
  // días de la semana: sábado incluido, cuando el sábado cierra al mediodía.
  // Con el rótulo del grupo, el par rótulo/horas dice la verdad en los dos
  // estados. `dias` sale de `data/negocio.js` y es el mismo texto que imprime
  // la tabla de Horarios: no se inventa nada.
  const rotuloHorario = filaHoy ? `Hoy ${DIA_LARGO[filaHoy.indice]}` : negocio.horarios[0].dias;
  const textoHorario = filaHoy
    ? filaHoy.tramos.length > 0
      ? filaHoy.fila.horas
      : 'Cerrado'
    : negocio.horarios[0].horas;

  return (
    <section className="plano-tinta" aria-label="Estado y contacto del local">
      {/* Las tres celdas no son iguales: la del medio lleva el horario
          entero y necesita más ancho, o parte en dos líneas y desalinea la
          fila. */}
      <ul className="contenedor grid md:grid-cols-[0.85fr_1.3fr_0.85fr]">
        <Celda rotulo="Estado">
          <ChipEstado className="!text-base !tracking-[0.09em]" />
        </Celda>

        <Celda rotulo={rotuloHorario} separada>
          {/* El horario entero no entra en una línea en toda pantalla: que
              parta equilibrado, por la "y" que separa mañana de tarde, y no
              con una palabra colgando. */}
          <span className="cifras text-t3 block text-balance font-bold">{textoHorario}</span>
        </Celda>

        <Celda rotulo="Teléfono" separada>
          <a
            href={negocio.telefonoLink}
            className="cifras text-t3 hover:text-naranja-vivo inline-flex min-h-11 items-center font-bold no-underline transition-colors duration-200"
          >
            {negocio.telefonoTexto}
          </a>
        </Celda>
      </ul>
    </section>
  );
}

function Celda({
  rotulo,
  separada = false,
  children,
}: {
  rotulo: string;
  separada?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li
      className={[
        'border-tinta-media py-6 md:py-7',
        separada ? 'border-t-2 md:border-t-0 md:border-l-2 md:pl-8' : '',
        'md:pr-8',
      ].join(' ')}
    >
      <span className="rotulo text-papel-suave block">{rotulo}</span>
      <span className="mt-2.5 block">{children}</span>
    </li>
  );
}
