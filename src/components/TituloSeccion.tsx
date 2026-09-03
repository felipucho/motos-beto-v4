/**
 * El titular de hoja: caja alta, ancho de tres cuartos, peso máximo.
 *
 * No lleva ningún rótulo encima. En un afiche el titular se sostiene solo, y el
 * cambio de tinta entre una hoja y la siguiente ya dice que empezó otra cosa.
 */
export function TituloSeccion({
  children,
  tono = 'tinta',
}: {
  children: React.ReactNode;
  /** Sobre plano de tinta o de naranja el titular se imprime en papel. */
  tono?: 'tinta' | 'claro';
}) {
  return (
    <h2 className={`cartel text-t2 ${tono === 'claro' ? 'text-papel-alto' : 'text-tinta'}`}>
      {children}
    </h2>
  );
}
