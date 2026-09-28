# Contexto activo

## Estado actual

- Rama observada: `develop`.
- El repositorio contiene una aplicación Next.js con TypeScript y una interfaz local de entrevista escrita.
- La pantalla implementa bienvenida, preguntas secuenciales, progreso, revisión editable y confirmación local.
- La entrevista cubre datos básicos de empresa, un proceso, frecuencia, volumen, tiempo, herramientas, tareas manuales, problemas y decisiones humanas.
- El estado de las respuestas vive en React durante la sesión; no hay persistencia tras recargar.
- La confirmación termina en una pantalla de demo. No calcula un diagnóstico ni envía información.

## Fase activa

Fase 1: completar y validar el flujo escrito y la experiencia base. El código existente ya ofrece una primera versión navegable de ese flujo.

## Próximo foco

Comparar la demo con los criterios de salida de Fase 1, completar los estados y detalles faltantes del recorrido y verificar el flujo en móvil y escritorio. No incorporar servicios externos ni funcionalidades de fases posteriores sin actualizar el alcance.

## Restricciones vigentes

- Un único proceso por entrevista.
- Sin voz, IA, correo, autenticación ni integraciones reales.
- No calcular costes o ahorros sin datos confirmados y reglas explícitas.
- Conservar los cambios existentes y trabajar en pasos pequeños verificables.

## Documentos relacionados

- [00-contexto-y-decisiones.md](00-contexto-y-decisiones.md)
- [01-alcance-y-criterios.md](01-alcance-y-criterios.md)
- [03-plan-de-fases.md](03-plan-de-fases.md)