'use client';

import { useEstadoApertura } from '@/components/EstadoApertura';
import { DIA_LARGO, semanaDesdeLunes, type DiaResuelto } from '@/lib/horario';

const DIAS = semanaDesdeLunes();

/**
 * La semana entera vista como franjas de tinta.
 *
 * La tabla de al lado dice el horario con exactitud; esto lo dice de un vistazo,
 * que es otra pregunta. Dos cosas que en una tabla hay que deducir acá se ven
 * solas: el hueco del mediodía, y que el sábado cierra antes. La aguja de la hora corona
 * la fila de hoy con un triángulo: usted está acá.
 *
 * Va con `aria-hidden` a propósito. No es información nueva, es la misma
 * información en otra forma, y la forma accesible ya existe a un lector de
 * pantalla de distancia. Duplicarla sólo obligaría a escucharla dos veces.
 */

/** Rango horizontal del gráfico, en minutos, redondeado a horas enteras. */
const RANGO = (() => {
  const tramos = DIAS.flatMap((dia) => dia.tramos);
  if (tramos.length === 0) return { desde: 8 * 60, hasta: 20 * 60 };
  const desde = Math.min(...tramos.map((t) => t.desde));
  const hasta = Math.max(...tramos.map((t) => t.hasta));
  return {
    desde: Math.floor(desde / 60) * 60,
    hasta: Math.ceil(hasta / 60) * 60,
  };
})();

const ANCHO = RANGO.hasta - RANGO.desde;

/** Marcas de hora cada dos o cuatro horas, según lo ancho que sea el rango. */
const MARCAS = (() => {
  const paso = ANCHO > 8 * 60 ? 4 * 60 : 2 * 60;
  const salida: number[] = [];
  for (let m = RANGO.desde; m <= RANGO.hasta; m += paso) salida.push(m);
  return salida;
})();

const pct = (minutos: number) => `${((minutos - RANGO.desde) / ANCHO) * 100}%`;
const ancho = (minutos: number) => `${(minutos / ANCHO) * 100}%`;

function Fila({
  dia,
  esHoy,
  minutos,
}: {
  dia: DiaResuelto;
  esHoy: boolean;
  minutos: number | null;
}) {
  const enRango = minutos !== null && minutos >= RANGO.desde && minutos <= RANGO.hasta;

  return (
    <div className="reloj-fila" data-hoy={esHoy ? 'si' : undefined}>
      <span className="rotulo reloj-dia">{DIA_LARGO[dia.indice].slice(0, 3)}</span>
      <span className="reloj-pista">
        {dia.tramos.map((tramo) => (
          <span
            key={tramo.desde}
            className="reloj-tramo"
            style={{ left: pct(tramo.desde), width: ancho(tramo.hasta - tramo.desde) }}
          />
        ))}
        {esHoy && enRango ? (
          <span className="reloj-ahora" style={{ left: pct(minutos) }} />
        ) : null}
      </span>
    </div>
  );
}

export function RelojSemana() {
  const { hoy, minutos } = useEstadoApertura();

  return (
    <div className="reloj" aria-hidden="true">
      <div className="reloj-fila">
        <span className="reloj-dia" />
        <span className="reloj-escala">
          {MARCAS.map((marca, i) => (
            <span
              key={marca}
              className="rotulo reloj-hora"
              data-inicio={i === 0 ? 'si' : undefined}
              data-fin={i === MARCAS.length - 1 ? 'si' : undefined}
              style={{ left: pct(marca) }}
            >
              {marca / 60}
            </span>
          ))}
        </span>
      </div>

      {DIAS.map((dia) => (
        <Fila key={dia.indice} dia={dia} esHoy={hoy === dia.indice} minutos={minutos} />
      ))}
    </div>
  );
}
