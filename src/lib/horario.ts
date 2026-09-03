import { negocio, type Horario } from './negocio';

/** Zona horaria del negocio. Argentina no aplica horario de verano. */
export const ZONA = 'America/Argentina/Cordoba';

/** Índice de día según Date#getDay: 0 domingo … 6 sábado. */
export type IndiceDia = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Un tramo de atención, en minutos desde la medianoche. */
export type Tramo = { desde: number; hasta: number };

/** El horario de un día concreto, ya resuelto. */
export type DiaResuelto = {
  indice: IndiceDia;
  /** Fila de `negocio.horarios` de la que salió este día. */
  fila: Horario;
  tramos: Tramo[];
};

const NOMBRES_DIA: Record<string, IndiceDia> = {
  domingo: 0,
  lunes: 1,
  martes: 2,
  miercoles: 3,
  jueves: 4,
  viernes: 5,
  sabado: 6,
};

export const DIA_LARGO: Record<IndiceDia, string> = {
  0: 'domingo',
  1: 'lunes',
  2: 'martes',
  3: 'miércoles',
  4: 'jueves',
  5: 'viernes',
  6: 'sábado',
};

/** Nombres que espera schema.org en `openingHoursSpecification`. */
const DIA_SCHEMA: Record<IndiceDia, string> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

/** Minúsculas, sin tildes y sin plural, para poder comparar nombres de día. */
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function nombreADia(nombre: string): IndiceDia | null {
  const limpio = normalizar(nombre);
  if (limpio in NOMBRES_DIA) return NOMBRES_DIA[limpio];

  // Sólo se quita el plural cuando el nombre no existe tal cual: "lunes",
  // "martes", "miércoles", "jueves" y "viernes" ya terminan en s.
  const singular = limpio.replace(/e?s$/, '');
  return singular in NOMBRES_DIA ? NOMBRES_DIA[singular] : null;
}

/**
 * "Lunes a viernes" -> [1,2,3,4,5]. "Sábados" -> [6].
 * "Lunes, miércoles y viernes" -> [1,3,5].
 */
export function parsearDias(etiqueta: string): IndiceDia[] {
  const texto = normalizar(etiqueta);

  const rango = texto.match(/^(\p{L}+)\s+a\s+(\p{L}+)$/u);
  if (rango) {
    const desde = nombreADia(rango[1]);
    const hasta = nombreADia(rango[2]);
    if (desde !== null && hasta !== null) {
      const dias: IndiceDia[] = [];
      // Se avanza en círculo para admitir rangos que cruzan el domingo.
      for (let i = 0; i < 7; i += 1) {
        const dia = (((desde + i) % 7) + 7) % 7;
        dias.push(dia as IndiceDia);
        if (dia === hasta) break;
      }
      return dias;
    }
  }

  const sueltos = texto
    .split(/,|\sy\s/)
    .map(nombreADia)
    .filter((dia): dia is IndiceDia => dia !== null);

  return Array.from(new Set(sueltos));
}

/**
 * "8:30 a 12:30 hs y 15:30 a 19:30 hs" -> dos tramos en minutos.
 * "Cerrado" -> [].
 */
export function parsearTramos(texto: string): Tramo[] {
  const tramos: Tramo[] = [];
  const patron = /(\d{1,2})[:.](\d{2})\s*(?:a|-|—|hasta)\s*(\d{1,2})[:.](\d{2})/g;

  for (const m of texto.matchAll(patron)) {
    const desde = Number(m[1]) * 60 + Number(m[2]);
    const hasta = Number(m[3]) * 60 + Number(m[4]);
    if (Number.isFinite(desde) && Number.isFinite(hasta) && hasta > desde) {
      tramos.push({ desde, hasta });
    }
  }

  return tramos.sort((a, b) => a.desde - b.desde);
}

/**
 * Expande `negocio.horarios` a los siete días de la semana. Un día que ninguna
 * fila menciona queda cerrado, que es la lectura segura: nunca se anuncia
 * atención que el dueño no declaró.
 */
export function semana(): DiaResuelto[] {
  const filaVacia: Horario = { dias: '', horas: 'Cerrado' };
  const resuelta = new Map<IndiceDia, DiaResuelto>();

  for (const fila of negocio.horarios) {
    const tramos = parsearTramos(fila.horas);
    for (const indice of parsearDias(fila.dias)) {
      resuelta.set(indice, { indice, fila, tramos });
    }
  }

  return ([0, 1, 2, 3, 4, 5, 6] as IndiceDia[]).map(
    (indice) => resuelta.get(indice) ?? { indice, fila: filaVacia, tramos: [] },
  );
}

/**
 * La misma semana, pero en el orden en que se lee un horario acá: de lunes a
 * domingo. semana() queda ordenada por índice de Date porque se la consulta
 * por día; esta es la que se muestra.
 */
export function semanaDesdeLunes(): DiaResuelto[] {
  const dias = semana();
  return ([1, 2, 3, 4, 5, 6, 0] as IndiceDia[]).map((indice) => dias[indice]);
}

/** Momento actual del negocio, sin importar dónde esté parado el visitante. */
export function ahoraEnElNegocio(referencia: Date = new Date()): {
  dia: IndiceDia;
  minutos: number;
} {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: ZONA,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(referencia);

  const valor = (tipo: Intl.DateTimeFormatPartTypes) =>
    partes.find((p) => p.type === tipo)?.value ?? '';

  const mapaDia: Record<string, IndiceDia> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  // Intl devuelve "24" para la medianoche en algunos motores; se normaliza a 0.
  const hora = Number(valor('hour')) % 24;
  const minuto = Number(valor('minute'));

  return {
    dia: mapaDia[valor('weekday')] ?? 0,
    minutos: hora * 60 + minuto,
  };
}

export function minutosATexto(minutos: number): string {
  const hora = Math.floor(minutos / 60) % 24;
  const minuto = minutos % 60;
  return `${hora}:${String(minuto).padStart(2, '0')}`;
}

export type Estado =
  | { abierto: true; cierraA: string; minutosParaCerrar: number }
  | { abierto: false; proximaApertura: { dia: IndiceDia; hora: string; esHoy: boolean } | null };

/**
 * Estado de apertura en este instante y, si está cerrado, cuándo vuelve a abrir.
 * Es el dato que la gente realmente viene a buscar, así que se calcula de
 * verdad en lugar de mostrarse como texto fijo.
 */
export function estadoActual(referencia: Date = new Date()): Estado {
  const dias = semana();
  const { dia, minutos } = ahoraEnElNegocio(referencia);

  const hoy = dias[dia];
  const abierto = hoy.tramos.find((t) => minutos >= t.desde && minutos < t.hasta);
  if (abierto) {
    return {
      abierto: true,
      cierraA: minutosATexto(abierto.hasta),
      minutosParaCerrar: abierto.hasta - minutos,
    };
  }

  const restanteHoy = hoy.tramos.find((t) => t.desde > minutos);
  if (restanteHoy) {
    return {
      abierto: false,
      proximaApertura: { dia, hora: minutosATexto(restanteHoy.desde), esHoy: true },
    };
  }

  for (let salto = 1; salto <= 7; salto += 1) {
    const indice = (((dia + salto) % 7) + 7) % 7 as IndiceDia;
    const siguiente = dias[indice];
    if (siguiente.tramos.length > 0) {
      return {
        abierto: false,
        proximaApertura: {
          dia: indice,
          hora: minutosATexto(siguiente.tramos[0].desde),
          esHoy: false,
        },
      };
    }
  }

  return { abierto: false, proximaApertura: null };
}

/**
 * Una duración corta, dicha como la diría alguien: "20 minutos", "1 h 15".
 * Sólo se usa cuando falta poco, así que no contempla días.
 */
export function duracionEnPalabras(minutos: number): string {
  if (minutos < 60) return `${minutos} minutos`;
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  if (resto === 0) return horas === 1 ? "1 hora" : `${horas} horas`;
  return `${horas} h ${resto}`;
}

/** `openingHoursSpecification` para el marcado LocalBusiness. */
export function especificacionSchema() {
  return semana().flatMap((dia) =>
    dia.tramos.map((tramo) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: DIA_SCHEMA[dia.indice],
      opens: minutosATexto(tramo.desde).padStart(5, '0'),
      closes: minutosATexto(tramo.hasta).padStart(5, '0'),
    })),
  );
}
