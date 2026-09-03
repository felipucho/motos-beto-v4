'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Aparición al entrar en pantalla, una sola vez por elemento.
 *
 * El estado escondido lo pone el CSS y sólo cuando la bandera `data-js` está
 * puesta, cosa que el script de arranque hace únicamente si el navegador tiene
 * IntersectionObserver. Sin script, sin observador o con
 * `prefers-reduced-motion`, el contenido nace visible: esto es un adorno, no
 * una condición para leer la página.
 *
 * Es lo único que quedó acá. El comportamiento del encabezado se mudó a
 * `NavegacionViva`, que toca el DOM sin volver a renderizar.
 */
export function Revelar({
  children,
  retraso = 0,
  className = '',
}: {
  children: React.ReactNode;
  /** Milisegundos de espera, para escalonar hermanos. */
  retraso?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          observador.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.06 },
    );

    observador.observe(nodo);
    return () => observador.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`revelar ${className}`}
      data-visible={visible ? 'si' : undefined}
      style={retraso ? { transitionDelay: `${retraso}ms` } : undefined}
    >
      {children}
    </div>
  );
}
