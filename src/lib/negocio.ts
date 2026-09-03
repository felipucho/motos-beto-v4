import { negocio as datos } from '../../data/negocio.js';

export type Horario = {
  /** Etiqueta legible tal cual la escribe el dueño: "Lunes a viernes". */
  dias: string;
  /** Texto legible: "8:30 a 12:30 hs y 15:30 a 19:30 hs" o "Cerrado". */
  horas: string;
};

/** Fila de rótulo y explicación: la forma que repiten varias secciones. */
export type Detalle = {
  que: string;
  detalle: string;
};

export type Negocio = {
  nombre: string;
  rubro: string;
  direccion: string;
  telefonoTexto: string;
  telefonoLink: string;
  whatsappTexto: string;
  whatsappLink: string;
  instagramUsuario: string;
  instagramLink: string;
  antiguedad: string;
  horarios: Horario[];
  coordenadas: { lat: number; lng: number };
  googlePlaceId: string;
  mapaEmbed: string;
  mapaLink: string;
  comoLlegarLink: string;

  motos: {
    condicion: string;
    marcas: string[];
    masBuscadas: Detalle[];
    usadas: string;
  };
  /** `icono` elige el glifo en la sección de pagos: billete, tarjeta o calendario. */
  pagos: { forma: string; detalle: string; icono: string }[];
  pagosNota: string;
  bicicletas: {
    tipos: string;
    marcas: string[];
    accesorios: string;
    alquiler: string;
  };
  taller: {
    entrada: string;
    service: string[];
    mecanica: string[];
    ajenas: string;
  };
  repuestos: {
    moto: string;
    cubiertas: string;
    cascos: string;
    encargo: string;
    envios: string;
  };
  tramites: {
    gestoria: string;
    seguros: string;
  };
};

/**
 * Fuente única de verdad del sitio. Todo dato de contacto, dirección, horario o
 * de lo que se ofrece sale de `data/negocio.js`: el dueño edita ese archivo y
 * cambia el sitio entero, incluido el marcado LocalBusiness.
 */
export const negocio: Negocio = datos;

/** Partes de la dirección, para el marcado estructurado y el pie. */
export const direccion = {
  calle: 'B. Mitre 310',
  localidad: 'Las Varillas',
  provincia: 'Córdoba',
  pais: 'AR',
} as const;
