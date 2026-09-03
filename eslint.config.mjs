import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

const config = [
  ...coreWebVitals,
  ...typescript,
  // `.claude/` guarda worktrees de sesiones de trabajo: son copias del repo, y
  // sin esta línea el lint informa dos veces cada problema.
  { ignores: ['.next/**', 'node_modules/**', 'tools/**', '.claude/**'] },
];

export default config;
