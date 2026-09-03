import type { Metadata, Viewport } from 'next';
import { Archivo, Bitter } from 'next/font/google';
import { negocio } from '@/lib/negocio';
import { siteUrl } from '@/lib/site';
import './globals.css';

/**
 * Una sola familia de cartel con dos ejes. Archivo es variable en peso y en
 * ancho, así que el titular de afiche (900, ancho 76) y el rótulo del pie
 * (700, ancho normal) salen del mismo archivo: menos descarga y una voz sola.
 */
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
});

const bitter = Bitter({
  subsets: ['latin'],
  variable: '--font-bitter',
  display: 'swap',
});

// El `<title>` es la línea azul del resultado de Google, no sólo la pestaña:
// tiene que nombrar el rubro y el pueblo, que es lo que la gente busca. Va la
// versión larga, con el nombre adelante para que la pestaña —que corta cerca
// del carácter 30— siga leyéndose "Motos Beto".
const titulo = 'Motos Beto — Motos, bicicletas y repuestos en Las Varillas';
const tituloRedes = 'Motos Beto — Motos, bicicletas y repuestos en Las Varillas, Córdoba';
const descripcion =
  'Motos, bicicletas, repuestos y taller propio en B. Mitre 310, Las Varillas. Honda, Yamaha, Guerrero, Corven y CF Moto. Financiación en cuotas, gestoría y envíos.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: titulo,
    template: '%s — Motos Beto',
  },
  description: descripcion,
  applicationName: negocio.nombre,
  keywords: [
    'motos Las Varillas',
    'bicicletas Las Varillas',
    'repuestos de moto Las Varillas',
    'repuestos de bicicleta Las Varillas',
    'taller de motos Las Varillas',
    'alquiler de bicicletas Las Varillas',
    'accesorios para moto Córdoba',
    'gestoría y patentamiento de motos',
    'Motos Beto',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: siteUrl,
    siteName: negocio.nombre,
    title: tituloRedes,
    description: descripcion,
  },
  twitter: { card: 'summary', title: tituloRedes, description: descripcion },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  category: 'business',
};

export const viewport: Viewport = {
  // El color de la interfaz del navegador iguala el papel del encabezado, que
  // es la primera tinta que se ve al abrir la página.
  themeColor: '#f5f3ef',
  colorScheme: 'light',
};

/**
 * Contrato de dirección. Va como comentario HTML en el markup emitido para que
 * sobreviva al build de producción y pueda auditarse contra el render.
 */
const CONTRATO = `<!--
IMPECCABLE — CONTRATO DE DIRECCIÓN

THESIS: un afiche serigrafiado de mostrador, donde cada sección es una hoja de una sola tinta y cada hoja dice una sola cosa. Rechaza la ficha de comercio local —tarjetas iguales sobre blanco, sombras blandas, esquinas redondeadas— con la que el rubro disimula que tiene poco que mostrar.
OWN-WORLD: cuatro tintas y ni un degradado: naranja quemado #b84610 en campos enteros, tinta cálida #191713, gris #c7c1b6 y papel #eae7e1. Cero radios, cero sombras, reglas de 2 y 3px. Archivo (Omnibus-Type) en caja alta a ancho 76 y peso 900 para el cartel, Bitter (Huerta Tipográfica) para el texto. El estado se lee como marca —cuadrado lleno o cruzado—, nunca como color.
STORY: el vecino ve tres palabras del tamaño de una pared, entiende en un segundo que hay motos, bicicletas y repuestos, confía porque un reloj real le dice que está abierto, y escribe por WhatsApp.
FIRST VIEWPORT: encabezado de papel con regla de 3px; a la izquierda el apilado MOTOS / BICICLETAS / REPUESTOS a 6rem con interlínea 0.86, la segunda línea impresa en naranja, y debajo la antigüedad sellada sobre una regla más las dos acciones cuadradas; a la derecha, sangrando al borde, la chapa naranja con el 310 como monumento —o la foto del frente en duotono cuando exista, en la misma caja medida—; cerrando la vista, la franja de tinta con estado en vivo, horario de hoy y teléfono.
FORM: challenger elegido por el usuario, cartel de parque WPA re-entintado en naranja y gris, por sobre el índice asignado 5 y mi candidato; semilla 25fbff0d.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
-->`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${archivo.variable} ${bitter.variable}`}>
      <head>
        {/* Marca, antes del primer pintado, que hay JavaScript y que el
            navegador puede observar la entrada en pantalla. Sin esta bandera
            el CSS deja la tinta puesta, que es el estado correcto cuando el
            script no corre o el navegador no tiene el observador. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if('IntersectionObserver' in window)document.documentElement.dataset.js='si'",
          }}
        />
      </head>
      <body>
        <div hidden aria-hidden="true" dangerouslySetInnerHTML={{ __html: CONTRATO }} />
        {children}
      </body>
    </html>
  );
}
