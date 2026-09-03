/**
 * Une una lista como la escribiría una persona: coma entre los primeros y "y"
 * antes del último. `['a','b','c']` → `"a, b y c"`.
 *
 * Existe para que los datos de `data/negocio.js` se guarden como listas —que es
 * lo que son, y lo que el dueño puede editar sin pelearse con la puntuación— y
 * se lean en la página como una frase.
 */
export function enumerar(items: readonly string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;
}
