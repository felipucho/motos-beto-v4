import { Bicicletas } from '@/components/Bicicletas';
import { Contacto } from '@/components/Contacto';
import { DatosEstructurados } from '@/components/DatosEstructurados';
import { Encabezado } from '@/components/Encabezado';
import { Franja } from '@/components/Franja';
import { Horarios } from '@/components/Horarios';
import { Motos } from '@/components/Motos';
import { Pie } from '@/components/Pie';
import { Portada } from '@/components/Portada';
import { Taller } from '@/components/Taller';
import { Ubicacion } from '@/components/Ubicacion';

export default function Inicio() {
  return (
    <>
      <a
        href="#contenido"
        className="accion accion-naranja focus:top-3 focus:left-3 fixed -top-24 left-3 z-50"
      >
        Saltar al contenido
      </a>

      <DatosEstructurados />
      <Encabezado />

      <main id="contenido">
        {/* Cada sección es una hoja de una sola tinta, y el orden es el de una
            conversación en el mostrador: primero qué hay (motos, bicicletas),
            después qué pasa cuando algo se rompe (taller), y recién ahí la
            logística —cuándo abre, cómo se llega— y la forma de escribir.

            Nada se esconde esperando el scroll salvo las franjas del reloj. Las
            hojas del medio traen el dato que la gente vino a buscar: taparlas
            para animarlas es retrasar la respuesta. */}
        <Portada />
        <Franja />
        <Motos />
        <Bicicletas />
        <Taller />
        <Horarios />
        <Ubicacion />
        <Contacto />
      </main>

      <Pie />
    </>
  );
}
