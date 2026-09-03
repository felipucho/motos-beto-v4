'use client';

import { useState } from 'react';
import { IconoFlecha } from '@/components/Iconos';
import { direccion, negocio } from '@/lib/negocio';

/**
 * El mapa, pero recién cuando alguien lo pide.
 *
 * El embebido de Google trae más de 200 kB de scripts, tipografías y azulejos
 * de terceros. En una página que existe para decir tres cosas —qué hay, cuándo
 * abre, dónde queda— es de lejos lo más pesado del sitio, y lo bajaba todo el
 * mundo aunque no lo mirara: `loading="lazy"` sólo espera al scroll, y esta
 * sección está a un scroll de distancia.
 *
 * En su lugar va una tapa impresa con la misma tinta que el resto, del tamaño
 * exacto del mapa —así no se mueve una línea al cambiar—, que dice la dirección
 * y espera el toque.
 *
 * La tapa es un enlace de verdad a la ficha de Google, no un botón: sin
 * JavaScript el toque abre el mapa en Google, que es la respuesta correcta a
 * "quiero ver dónde queda". Con JavaScript el enlace se intercepta y el mapa se
 * imprime acá mismo. Nadie se queda sin mapa por no tener script.
 *
 * (No va dentro de `<noscript>`: React hidrata los hijos de esa etiqueta como
 * nodos reales, así que el iframe terminaba cargándose igual y el ahorro era
 * cero. Se comprobó midiendo.)
 */
export function MapaDiferido() {
  const [abierto, setAbierto] = useState(false);

  if (abierto) {
    return (
      <iframe
        src={negocio.mapaEmbed}
        title={`Mapa con la ubicación de ${negocio.nombre} en ${negocio.direccion}`}
        referrerPolicy="no-referrer-when-downgrade"
        className="block h-[22rem] w-full md:h-[28rem]"
      />
    );
  }

  return (
    <a
      href={negocio.mapaLink}
      target="_blank"
      rel="noreferrer noopener"
      onClick={(evento) => {
        // Sólo el clic común. Con Ctrl, Cmd o el botón del medio, quien está
        // del otro lado pidió otra pestaña y hay que dársela.
        if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.button !== 0) return;
        evento.preventDefault();
        setAbierto(true);
      }}
      className="plano-gris hover:bg-gris-claro group flex h-[22rem] w-full flex-col items-start justify-between p-6 text-left no-underline transition-colors duration-200 md:h-[28rem] md:p-10"
    >
      <span className="rotulo text-tinta-media">Mapa</span>

      <span>
        <span className="cartel text-t3 text-tinta block">{direccion.calle}</span>
        <span className="text-dato text-tinta-media mt-2 block">
          {direccion.localidad}, {direccion.provincia}
        </span>

        <span className="border-tinta text-tinta rotulo mt-7 inline-flex min-h-12 items-center gap-2.5 border-2 px-5">
          Ver el mapa
          <IconoFlecha
            width={18}
            height={18}
            className="shrink-0 transition-transform duration-200 group-hover:translate-x-1.5"
          />
        </span>
      </span>
    </a>
  );
}
