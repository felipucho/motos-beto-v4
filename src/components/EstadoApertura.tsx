'use client';

import { useEffect, useState } from 'react';
import {
  DIA_LARGO,
  ahoraEnElNegocio,
  duracionEnPalabras,
  estadoActual,
  type Estado,
  type IndiceDia,
} from '@/lib/horario';

/**
 * El estado de apertura se resuelve en el navegador, no en el servidor: una
 * página estática cacheada por Vercel serviría un "abierto" congelado en el
 * momento del build. Hasta que hidrata no se muestra ningún estado, así que
 * nunca se afirma algo falso.
 *
 * Se refresca cada treinta segundos: el minuto en que el local cierra tiene que
 * verse en la pantalla de alguien que dejó la página abierta.
 */
export function useEstadoApertura(): {
  estado: Estado | null;
  hoy: IndiceDia | null;
  /** Minutos desde la medianoche en el negocio. Null hasta hidratar. */
  minutos: number | null;
} {
  const [estado, setEstado] = useState<Estado | null>(null);
  const [hoy, setHoy] = useState<IndiceDia | null>(null);
  const [minutos, setMinutos] = useState<number | null>(null);

  useEffect(() => {
    const refrescar = () => {
      const ahora = ahoraEnElNegocio();
      setEstado(estadoActual());
      setHoy(ahora.dia);
      setMinutos(ahora.minutos);
    };

    refrescar();
    const id = window.setInterval(refrescar, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return { estado, hoy, minutos };
}

/** A partir de acá el cierre deja de ser un horario y pasa a ser una cuenta. */
const AVISO_DE_CIERRE = 90;

export function textoEstado(estado: Estado): string {
  if (estado.abierto) {
    return estado.minutosParaCerrar <= AVISO_DE_CIERRE
      ? `Abierto · cierra en ${duracionEnPalabras(estado.minutosParaCerrar)}`
      : `Abierto ahora · cierra ${estado.cierraA}`;
  }

  if (!estado.proximaApertura) return 'Cerrado';

  const { esHoy, dia, hora } = estado.proximaApertura;
  return esHoy ? `Cerrado · abre a las ${hora}` : `Cerrado · abre el ${DIA_LARGO[dia]} a las ${hora}`;
}

type Tono = 'claro' | 'oscuro';

/**
 * El estado, impreso como marca y no como color: abierto es un cuadrado lleno,
 * cerrado es un cuadrado vacío cruzado. Se entiende sin distinguir el naranja
 * del gris, que es lo que pasa bajo el sol y lo que pasa con daltonismo.
 *
 * El texto cambia solo mientras la página está abierta, y a noventa minutos del
 * cierre pasa de decir la hora a decir cuánto falta.
 */
export function ChipEstado({
  tono = 'claro',
  className = '',
}: {
  tono?: Tono;
  /** Permite que la franja imprima el estado al cuerpo de sus otras celdas. */
  className?: string;
}) {
  const { estado } = useEstadoApertura();

  if (!estado) {
    // Reserva de espacio para que la línea no salte al aparecer.
    return <span aria-hidden="true" className={`inline-block h-[1.35em] w-[15ch] ${className}`} />;
  }

  const abierto = estado.abierto;
  const claro = tono === 'claro';

  const color = abierto
    ? claro
      ? 'text-naranja-vivo'
      : 'text-naranja'
    : claro
      ? 'text-papel-suave'
      : 'text-tinta-gris';

  return (
    <span
      // El estado cambia solo: quien usa lector de pantalla tiene que enterarse
      // sin volver a leer la página entera.
      aria-live="polite"
      className={`rotulo inline-flex items-center gap-2.5 ${claro ? 'text-papel-alto' : 'text-tinta'} ${className}`}
    >
      <span aria-hidden="true" className={`marca-estado ${color}`} data-abierto={abierto ? 'si' : 'no'} />
      {textoEstado(estado)}
    </span>
  );
}
