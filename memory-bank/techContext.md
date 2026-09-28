# Contexto técnico

## Stack detectado

- Next.js `16.3.6` con React `19.2.8`.
- TypeScript `5`.
- Tailwind CSS `4`.
- ESLint `9` con configuración de Next.js.
- Gestor de paquetes observado: npm.

## Comandos disponibles

- `npm run dev`: servidor de desarrollo de Next.js.
- `npm run build`: compilación de producción.
- `npm start`: servidor de producción.
- `npm run lint`: ESLint.

El `package.json` no declara actualmente comandos de pruebas ni dependencias de pruebas.

## Implementación observada

- Interfaz principal en `src/app/page.tsx`; estilos globales en `src/app/globals.css`.
- Metadatos y configuración del idioma español en `src/app/layout.tsx`.
- La entrevista y las respuestas están definidas en la página cliente y se conservan en estado React mientras la página permanece cargada.
- No se observa backend de dominio, base de datos, esquema de validación ni proveedor externo integrado.

## Stack previsto, aún no integrado

La documentación propone PostgreSQL y Drizzle para persistencia en Fase 2, Zod para validación y Vitest/Playwright para pruebas. React Hook Form y shadcn/ui también aparecen como elecciones posibles en la arquitectura inicial. No asumir que estas dependencias están instaladas; comprobar `package.json` antes de usarlas.

## Restricciones técnicas

- La demo debe funcionar sin secretos ni servicios externos.
- Mantener cálculos en lógica determinista y probarlos cuando se incorporen.
- Configurar secretos mediante variables de entorno solo al integrar proveedores.
- Revisar compatibilidad y costes de proveedores antes de seleccionarlos.

## Referencia

Consultar [02-arquitectura-y-stack.md](02-arquitectura-y-stack.md) para la evolución técnica prevista.