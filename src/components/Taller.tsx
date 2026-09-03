import { FilaFicha, ListaFicha } from '@/components/FilaFicha';
import { HuecoFoto } from '@/components/HuecoFoto';
import { TituloSeccion } from '@/components/TituloSeccion';
import { fotos } from '@/lib/fotos';
import { negocio } from '@/lib/negocio';

const { taller, repuestos, tramites } = negocio;

/**
 * Lo que pasa después de la venta, que en este rubro es la mitad del negocio.
 *
 * Los trabajos del taller van como marbetes y no como frase: son cosas sueltas,
 * se escanean mejor sueltas, y entran en un tercio del alto. Los repuestos sí
 * necesitan frase, porque cada uno tiene su condición.
 */
function Marbetes({ titulo, items }: { titulo: string; items: string[] }) {
  return (
    <div>
      <p className="rotulo text-tinta-gris">{titulo}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item} className="rotulo marbete">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Taller() {
  return (
    <section id="taller" className="ancla bg-papel-alto">
      <div className="contenedor pliego">
        <TituloSeccion>Taller y repuestos</TituloSeccion>

        <p className="text-guia medida text-tinta-media mt-5">{taller.entrada}</p>

        <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:gap-16">
          <Marbetes titulo="Service" items={taller.service} />
          <Marbetes titulo="Mecánica" items={taller.mecanica} />
        </div>

        <p className="medida text-tinta-media mt-8 text-dato">{taller.ajenas}</p>

        <div className="regla mt-14 pt-10">
          <h3 className="cartel text-t3 text-tinta">Repuestos</h3>
          <ListaFicha>
            <FilaFicha rotulo="De moto">{repuestos.moto}</FilaFicha>
            <FilaFicha rotulo="Cubiertas">{repuestos.cubiertas}</FilaFicha>
            <FilaFicha rotulo="Cascos">{repuestos.cascos}</FilaFicha>
            <FilaFicha rotulo="Por encargo">{repuestos.encargo}</FilaFicha>
            <FilaFicha rotulo="Envíos">{repuestos.envios}</FilaFicha>
          </ListaFicha>

          <HuecoFoto
            foto={fotos.repuestos}
            proporcion="21 / 9"
            className="mt-12"
            sizes="(min-width: 78rem) 74rem, 100vw"
          />
        </div>

        <div className="regla mt-14 pt-10">
          <h3 className="cartel text-t3 text-tinta">Trámites</h3>
          <ListaFicha>
            <FilaFicha rotulo="Gestoría">{tramites.gestoria}</FilaFicha>
            <FilaFicha rotulo="Seguros">{tramites.seguros}</FilaFicha>
          </ListaFicha>
        </div>
      </div>
    </section>
  );
}
