import { IconoFlecha, IconoInstagram, IconoTelefono, IconoWhatsapp } from '@/components/Iconos';
import { TituloSeccion } from '@/components/TituloSeccion';
import { negocio } from '@/lib/negocio';

const VIAS = [
  {
    href: negocio.whatsappLink,
    externo: true,
    icono: <IconoWhatsapp width={24} height={24} />,
    rotulo: 'WhatsApp',
    valor: negocio.whatsappTexto,
    nota: 'Lo más rápido. Escribí a cualquier hora.',
  },
  {
    href: negocio.telefonoLink,
    externo: false,
    icono: <IconoTelefono width={24} height={24} />,
    rotulo: 'Teléfono',
    valor: negocio.telefonoTexto,
    nota: 'Durante el horario de atención.',
  },
  {
    href: negocio.instagramLink,
    externo: true,
    icono: <IconoInstagram width={24} height={24} />,
    rotulo: 'Instagram',
    valor: negocio.instagramUsuario,
    nota: 'Ahí van las novedades del local.',
  },
];

/**
 * La última hoja, y la más fuerte después de la portada: naranja de borde a
 * borde. Cada vía es una fila reglada del ancho entero; al pasar por encima el
 * bloque de tinta se corre sobre el naranja, que es lo único que hace una
 * imprenta de dos pasadas cuando quiere destacar una línea.
 */
export function Contacto() {
  return (
    <section id="contacto" className="ancla plano-naranja">
      <div className="contenedor pliego">
        <TituloSeccion tono="claro">Escribinos</TituloSeccion>

        <ul className="mt-10">
          {VIAS.map((via) => (
            <li key={via.rotulo} className="border-papel-alto border-t-2 last:border-b-2">
              <a
                href={via.href}
                target={via.externo ? '_blank' : undefined}
                rel={via.externo ? 'noreferrer noopener' : undefined}
                className="group hover:bg-tinta flex items-center gap-5 px-2 py-6 no-underline transition-colors duration-200 md:gap-8 md:py-8"
              >
                <span className="shrink-0">{via.icono}</span>

                <span className="min-w-0 flex-1">
                  <span className="rotulo block">{via.rotulo}</span>
                  <span translate="no" className="cifras text-t3 mt-2 block font-bold">
                    {via.valor}
                  </span>
                  <span className="mt-2 block text-dato">{via.nota}</span>
                </span>

                <IconoFlecha
                  width={24}
                  height={24}
                  className="shrink-0 transition-transform duration-200 group-hover:translate-x-1.5"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
