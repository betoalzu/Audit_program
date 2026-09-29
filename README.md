# Audit_program

## Persistencia local

La aplicación usa PostgreSQL para guardar entrevistas. La sesión es anónima: una cookie `HttpOnly` da acceso a la entrevista desde el mismo navegador durante 30 días; no hay cuentas ni recuperación entre dispositivos. No introduzcas información personal ni confidencial.

Configura `DATABASE_URL` en `.env` o `.env.local` antes de migrar y arrancar la aplicación. Para Supabase, usa la URI PostgreSQL de Session Pooler; la contraseña debe estar codificada como parte de la URL.

```dotenv
DATABASE_URL="postgresql://usuario:contraseña@host:5432/postgres?sslmode=require"
```

Después ejecuta:

```powershell
npm run db:migrate
npm run dev
```

La base de datos debe existir previamente. `.env.example` contiene una URL local de ejemplo. Drizzle carga `.env` mediante `dotenv`; Next.js carga `.env` y `.env.local`. Los comandos `npm run db:generate` y `npm run db:migrate` generan y aplican migraciones versionadas.

Sin `DATABASE_URL` o sin conexión a PostgreSQL, la entrevista se puede recorrer como borrador temporal y la interfaz lo indica; las respuestas no se guardarán al cerrar o recargar.