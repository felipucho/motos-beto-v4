'use client';

import { useEffect } from 'react';

/**
 * El comportamiento del encabezado, sin el encabezado.
 *
 * Antes esto vivía dentro de `Encabezado`, y por dos atributos que cambian al
 * hacer scroll —la regla de abajo y el enlace marcado— toda la cabecera tenía
 * que viajar al navegador y volver a construirse ahí. Ahora la cabecera se
 * imprime en el servidor y esto se monta al lado, no dibuja nada, y toca los
 * dos atributos directamente sobre el DOM: sin volver a renderizar en cada
 * píxel de scroll, y sin que el árbol del encabezado ocupe lugar en el bulto de
 * JavaScript.
 *
 * Todo lo que hace es decorativo. Sin JavaScript la cabecera se ve entera, los
 * enlaces funcionan y la única diferencia es que ninguno queda subrayado.
 */
export function NavegacionViva({ ids }: { ids: readonly string[] }) {
  useEffect(() => {
    const cabecera = document.querySelector<HTMLElement>('[data-encabezado]');
    const enlaces = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('a[data-seccion]'),
    );

    // --- La regla de abajo, que pasa de gris a tinta al despegarse del inicio.
    let puesto = false;
    const mirarScroll = () => {
      const ahora = window.scrollY > 32;
      if (ahora === puesto) return;
      puesto = ahora;
      if (!cabecera) return;
      if (ahora) cabecera.dataset.desplazado = 'si';
      else cabecera.removeAttribute('data-desplazado');
    };
    mirarScroll();
    window.addEventListener('scroll', mirarScroll, { passive: true });

    // --- El enlace de la sección que está en pantalla.
    const nodos = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => n !== null);

    const visibles = new Set<string>();
    let marcada: string | null = null;

    const marcar = (id: string | null) => {
      if (id === marcada) return;
      marcada = id;
      for (const enlace of enlaces) {
        if (enlace.dataset.seccion === id) enlace.setAttribute('aria-current', 'true');
        else enlace.removeAttribute('aria-current');
      }
    };

    // El margen superior descuenta el encabezado fijo, y el inferior obliga a
    // que una sección llegue al tercio superior para considerarse activa: sin
    // eso, la última sección corta gana apenas asoma.
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) visibles.add(entrada.target.id);
          else visibles.delete(entrada.target.id);
        }
        // La última en orden de documento, no la primera: bajando, dos
        // secciones pueden tocar la banda a la vez y la que interesa es siempre
        // la que se está entrando, no la que se está dejando.
        let ultima: string | null = null;
        for (let i = ids.length - 1; i >= 0; i -= 1) {
          if (visibles.has(ids[i])) {
            ultima = ids[i];
            break;
          }
        }
        marcar(ultima);
      },
      { rootMargin: '-96px 0px -60% 0px', threshold: 0 },
    );

    for (const nodo of nodos) observador.observe(nodo);

    return () => {
      window.removeEventListener('scroll', mirarScroll);
      observador.disconnect();
    };
  }, [ids]);

  return null;
}
