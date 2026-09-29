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
- `npm test`: pruebas Vitest.
- `npm run db:generate`: genera migraciones Drizzle.
- `npm run db:migrate`: aplica migraciones PostgreSQL. Requiere `DATABASE_URL`.
- Drizzle carga `.env` mediante `dotenv/config`; Next.js también puede leer `.env.local`.

La aplicación también requiere PostgreSQL para persistencia real; consulta `README.md` para el arranque local.

## Implementación observada

- Interfaz principal en `src/app/page.tsx`; estilos globales en `src/app/globals.css`.
- Metadatos y configuración del idioma español en `src/app/layout.tsx`.
- La interfaz de entrevista está en `src/app/page.tsx`; los borradores se validan con Zod y se guardan mediante `src/app/api/interview/route.ts`.
- PostgreSQL se configura con `DATABASE_URL`; el esquema Drizzle y sus migraciones están en `src/lib/db/` y `drizzle/`.
- La sesión es anónima y usa una cookie privada de 30 días. Sin base disponible, la app indica que las respuestas son temporales.
- PostgreSQL de Supabase está conectado y la migración inicial está aplicada; se validó el ciclo HTTP de creación, guardado y recuperación.

## Stack previsto, aún no integrado

Vitest verifica validación y completitud. React Hook Form y shadcn/ui siguen como opciones posibles, no forman parte de esta fase.

## Restricciones técnicas

- El modo temporal debe funcionar sin secretos ni servicios externos.
- Mantener cálculos en lógica determinista y probarlos cuando se incorporen.
- Configurar secretos mediante variables de entorno solo al integrar proveedores.
- Revisar compatibilidad y costes de proveedores antes de seleccionarlos.

## Referencia

Consultar [02-arquitectura-y-stack.md](02-arquitectura-y-stack.md) para la evolución técnica prevista.