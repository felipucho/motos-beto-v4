import Image from 'next/image';
import type { Foto } from '@/lib/fotos';

type Props = {
  foto: Foto | null;
  /** Proporción del hueco, en formato CSS: '4 / 5'. */
  proporcion: string;
  className?: string;
  prioridad?: boolean;
  sizes?: string;
  /**
   * Duotono: la foto se imprime con las dos tintas del afiche en vez de a todo
   * color. Se usa sólo donde la foto ocupa el lugar de un plano de naranja —la
   * chapa de la portada—, porque ahí tiene que ser ese plano. En las bandas de
   * adentro la foto va como es, con su marco.
   */
  tinte?: boolean;
};

/**
 * Hueco de fotografía con proporción fija y marco de imprenta.
 *
 * Cuando no hay foto no dibuja nada: un panel de relleno con un ícono adentro
 * es un esqueleto de carga que nunca termina de cargar, y se nota. La página
 * está compuesta para verse entera sin fotos; cuando la foto llega, entra en
 * este hueco sin mover una línea de lo que ya está alrededor.
 */
export function HuecoFoto({
  foto,
  proporcion,
  className = '',
  prioridad = false,
  sizes = '(min-width: 64rem) 40vw, 100vw',
  tinte = false,
}: Props) {
  if (!foto) return null;

  return (
    <div
      className={`bg-tinta relative overflow-hidden ${tinte ? '' : 'border-tinta border-[3px]'} ${className}`}
      style={{ aspectRatio: proporcion }}
    >
      <Image
        src={foto.src}
        alt={foto.alt}
        fill
        sizes={sizes}
        priority={prioridad}
        className={`object-cover ${tinte ? 'grayscale contrast-[1.08]' : ''}`}
      />

      {tinte ? (
        <>
          <span
            aria-hidden="true"
            className="bg-naranja absolute inset-0 opacity-[0.62] mix-blend-multiply"
          />
          <span
            aria-hidden="true"
            className="bg-papel-alto absolute inset-0 opacity-[0.16] mix-blend-screen"
          />
        </>
      ) : null}
    </div>
  );
}
