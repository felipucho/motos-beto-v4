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

/** Las partes de la dirección tal como las declara `data/negocio.js`. */
export type PartesDireccion = {
  calle: string;
  localidad: string;
  provincia: string;
  /** El que publica la ficha de Google del negocio. */
  codigoPostal: string;
  /** Escrito, para la línea que lee una persona: "Argentina". */
  pais: string;
  /** ISO, que es lo que pide schema.org: "AR". */
  paisIso: string;
};

export type Negocio = {
  nombre: string;
  rubro: string;
  direccion: string;
  partesDireccion: PartesDireccion;
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

/**
 * Partes de la dirección, para el marcado estructurado y el pie.
 *
 * Se derivan de `data/negocio.js` y no se escriben acá. Antes esta constante
 * era una segunda copia a mano de la misma dirección, y alcanzaba con corregir
 * una sola de las dos para que el sitio publicara dos direcciones distintas:
 * la del marcado por un lado y la de la línea escrita por el otro. Para un
 * negocio local esa es de las peores señales que se pueden emitir, porque
 * Google contrasta la dirección del sitio con la de la ficha y con la de
 * cualquier otra fuente, y una discrepancia se lee como dos comercios.
 *
 * `pais` queda en ISO —`AR`— porque es lo que consume el `PostalAddress`; la
 * forma escrita vive en `partesDireccion.pais` y la usa la línea completa.
 */
export const direccion = {
  calle: datos.partesDireccion.calle,
  localidad: datos.partesDireccion.localidad,
  provincia: datos.partesDireccion.provincia,
  codigoPostal: datos.partesDireccion.codigoPostal,
  pais: datos.partesDireccion.paisIso,
} as const;
