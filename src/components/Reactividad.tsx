'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Piezas de comportamiento compartidas. Todas parten de un estado que ya es
 * correcto sin JavaScript: si el script no corre, el contenido se ve entero y
 * la navegación funciona igual. Nada de esto oculta información.
 */

/** ¿La página ya se desplazó más de `umbral` píxeles? */
export function useDesplazado(umbral = 24): boolean {
  const [desplazado, setDesplazado] = useState(false);

  useEffect(() => {
    const mirar = () => setDesplazado(window.scrollY > umbral);
    mirar();
    window.addEventListener('scroll', mirar, { passive: true });
    return () => window.removeEventListener('scroll', mirar);
  }, [umbral]);

  return desplazado;
}

/**
 * Cuál de las secciones está ocupando la pantalla. Se usa para marcar el enlace
 * correspondiente en la navegación.
 *
 * El margen superior descuenta el encabezado fijo, y el inferior obliga a que
 * una sección tenga que llegar al tercio superior para considerarse activa: sin
 * eso, la última sección corta gana apenas asoma.
 */
export function useSeccionActiva(ids: string[]): string | null {
  const [activa, setActiva] = useState<string | null>(null);

  useEffect(() => {
    const nodos = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => n !== null);

    if (nodos.length === 0) return;

    const visibles = new Set<string>();

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) visibles.add(entrada.target.id);
          else visibles.delete(entrada.target.id);
        }
        // La última en orden de documento, no la primera: bajando, dos
        // secciones pueden tocar la banda a la vez y la que interesa es
        // siempre la que se está entrando, no la que se está dejando.
        let ultima: string | null = null;
        for (let i = ids.length - 1; i >= 0; i -= 1) {
          if (visibles.has(ids[i])) {
            ultima = ids[i];
            break;
          }
        }
        setActiva(ultima);
      },
      { rootMargin: '-96px 0px -60% 0px', threshold: 0 },
    );

    for (const nodo of nodos) observador.observe(nodo);
    return () => observador.disconnect();
  }, [ids]);

  return activa;
}

/**
 * Aparición al entrar en pantalla, una sola vez por elemento.
 *
 * El estado escondido lo pone el CSS y sólo cuando la bandera `data-js` está
 * puesta, cosa que el script de arranque hace únicamente si el navegador tiene
 * IntersectionObserver. Sin script, sin observador o con
 * `prefers-reduced-motion`, el contenido nace visible: esto es un adorno, no
 * una condición para leer la página.
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
