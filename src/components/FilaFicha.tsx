/**
 * La fila reglada: rótulo angosto a la izquierda, frase a la derecha, y una
 * regla de imprenta entre una y otra.
 *
 * Es el cuerpo común de las hojas densas y reemplaza a la grilla de tarjetas
 * iguales, que es la forma en que el rubro disimula que tiene poco que decir.
 * En teléfono el rótulo se apila sobre la frase; desde 40rem van en columnas.
 */
export function ListaFicha({ children }: { children: React.ReactNode }) {
  return <dl className="mt-9 max-w-4xl">{children}</dl>;
}

export function FilaFicha({
  rotulo,
  children,
  tono = 'tinta',
}: {
  rotulo: string;
  children: React.ReactNode;
  tono?: 'tinta' | 'claro';
}) {
  const claro = tono === 'claro';

  return (
    <div
      className={[
        'grid gap-x-10 border-t-2 py-5 first:border-t-0 first:pt-0 last:pb-0',
        'sm:grid-cols-[11rem_1fr]',
        claro ? 'border-papel-suave' : 'border-gris-plano',
      ].join(' ')}
    >
      <dt className={`rotulo sm:pt-1.5 ${claro ? 'text-papel-suave' : 'text-tinta-gris'}`}>
        {rotulo}
      </dt>
      <dd className={`mt-2 sm:mt-0 ${claro ? 'text-papel-alto' : 'text-tinta'}`}>{children}</dd>
    </div>
  );
}
