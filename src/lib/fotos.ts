export type Foto = {
  /** Ruta dentro de /public, por ejemplo '/fotos/local.jpg'. */
  src: string;
  /** Texto alternativo real: qué se ve, no "foto del negocio". */
  alt: string;
  ancho: number;
  alto: number;
};

/**
 * Fotos del negocio. Hoy no hay ninguna: el dueño las tiene pero todavía no las
 * entregó, así que el sitio se diseñó para verse terminado sin ellas.
 *
 * Para sumar una: copiar el archivo a `public/fotos/` y completar la entrada.
 * Los huecos ya tienen proporción fija, así que la foto entra sin mover el
 * layout. Ver `public/fotos/README.md`.
 */
export const fotos: {
  frente: Foto | null;
  motos: Foto | null;
  bicicletas: Foto | null;
  repuestos: Foto | null;
} = {
  frente: null,
  motos: null,
  bicicletas: null,
  repuestos: null,
};
