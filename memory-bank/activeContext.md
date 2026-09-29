# Contexto activo

## Estado actual

- Rama observada: `develop`.
- El repositorio contiene una aplicación Next.js con TypeScript y una interfaz local de entrevista escrita.
- La pantalla implementa bienvenida, 12 preguntas secuenciales, progreso, revisión editable y confirmación local.
- La entrevista cubre datos básicos de empresa, un proceso, frecuencia, volumen, tiempo, herramientas, tareas manuales, problemas y decisiones humanas.
- PostgreSQL guarda empresa, entrevista, proceso y una sesión anónima; las respuestas se validan en el servidor.
- La interfaz restaura la entrevista asociada a una cookie `HttpOnly` de 30 días; sin base disponible, el borrador es temporal y se indica como tal.
- La confirmación sigue siendo un cierre de demo. No calcula un diagnóstico ni envía correo.

## Estado de fases

Fase 1 y Fase 2 completas y verificadas. Fase 3 en curso: Gemini está integrado detrás de la ruta de servidor con salida Zod, citas verificables, consentimiento y límite de uso. Falta configurar una clave de pago y probar una respuesta real del modelo.

## Próximo foco

Configurar `GOOGLE_GENERATIVE_AI_API_KEY` con una cuenta de Gemini API de pago y evaluar la extracción con ejemplos representativos; no compartir ni versionar la clave.

## Restricciones vigentes

- Un único proceso por entrevista.
- Sin voz, correo, cuentas de usuario ni integraciones de negocio.
- La sesión anónima usa la cookie privada como credencial; no permite recuperar la entrevista desde otro dispositivo.
- No calcular costes o ahorros sin datos confirmados y reglas explícitas.
- Conservar los cambios existentes y trabajar en pasos pequeños verificables.

## Documentos relacionados

- [00-contexto-y-decisiones.md](00-contexto-y-decisiones.md)
- [01-alcance-y-criterios.md](01-alcance-y-criterios.md)
- [03-plan-de-fases.md](03-plan-de-fases.md)