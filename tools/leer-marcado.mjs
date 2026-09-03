/**
 * Lee el JSON-LD de la página y devuelve el nodo del negocio.
 *
 * El marcado es un `@graph` con cuatro entidades enlazadas por `@id` —negocio,
 * sitio, página, imagen—, así que la ficha del comercio no está en la raíz del
 * documento. Toda prueba que quiera mirar dirección, horarios o coordenadas
 * tiene que entrar por acá, y no volver a suponer que hay un solo nodo.
 */
export async function leerNegocio(pagina) {
  const crudo = await pagina.evaluate(
    () => document.querySelector('script[type="application/ld+json"]').textContent,
  );
  const datos = JSON.parse(crudo);
  const nodos = Array.isArray(datos['@graph']) ? datos['@graph'] : [datos];
  const negocio = nodos.find((n) => String(n['@id'] ?? '').endsWith('#business'));
  if (!negocio) {
    throw new Error(`el grafo no tiene un nodo #business: ${nodos.map((n) => n['@id']).join(', ')}`);
  }
  return { negocio, nodos, datos };
}
