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

## Revisión asistida por IA

La revisión usa Vercel AI SDK 6 con `gemini-3.1-flash-lite`. Para habilitarla, crea una clave de Gemini API con facturación activa y configura `GOOGLE_GENERATIVE_AI_API_KEY` en `.env` local y en las variables de entorno de Vercel. No uses el nivel gratuito para respuestas reales: Google puede usar sus entradas para mejorar productos y sus términos exigen servicios de pago para aplicaciones disponibles en el EEE.

La tarifa publicada consultada para Gemini 3.1 Flash-Lite es de $0.25 por millón de tokens de entrada y $1.50 por millón de tokens de salida. El servidor limita la salida a 1,200 tokens y a dos análisis por entrevista; el mismo borrador se reutiliza sin una nueva llamada. El coste real depende de los tokens de entrada y salida. Consulta los [precios oficiales](https://ai.google.dev/gemini-api/docs/pricing) y las [condiciones sobre datos](https://ai.google.dev/gemini-api/terms) antes de usar datos reales.

La revisión solo se ejecuta después de que la persona marque el consentimiento en la pantalla. Se envían las respuestas guardadas para encontrar hechos, ambigüedades y contradicciones; cada hecho debe incluir una cita literal de origen. Los resultados son sugerencias, no cambian las respuestas automáticamente y deben revisarse por una persona. Sin `GOOGLE_GENERATIVE_AI_API_KEY`, la interfaz informa que la función no está configurada y no llama al proveedor.