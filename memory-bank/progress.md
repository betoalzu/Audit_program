# Progreso

## Fases

| Fase | Estado | Evidencia o salida |
| --- | --- | --- |
| 0. Definición | Completa | Alcance, decisiones, arquitectura y plan documentados en los archivos numerados existentes. |
| 1. Entrevista escrita | Completa | Recorrido verificado en navegador en escritorio y móvil: 12 preguntas, navegación, respuestas especiales, resumen editable y confirmación. |
| 2. Esquema y persistencia | Completa | Migración aplicada en Supabase; el endpoint creó, guardó y recuperó una entrevista de prueba. Los datos sintéticos se eliminaron. |
| 3. Extracción y aclaraciones | Pendiente | No hay integración con IA. |
| 4. Diagnóstico e informe | Pendiente | No hay cálculos de diagnóstico ni generación de PDF. |
| 5. Correo y operación | Pendiente | No hay envío de correo ni panel administrativo. |
| 6. Voz opcional | Pendiente | No hay captura ni transcripción de voz. |
| 7. Piloto | Pendiente | Sin piloto documentado. |

## Trabajo disponible

- La demo ofrece 12 preguntas sobre empresa, un proceso, frecuencia, volumen, duración, herramientas, tareas manuales, problemas y decisiones humanas.
- Se pueden recorrer las preguntas, volver atrás, usar respuestas especiales y editar respuestas desde el resumen.
- La confirmación solo muestra el final de la demo; no calcula un diagnóstico ni envía datos.
- El acceso persistente queda vinculado al navegador mediante una cookie privada; no hay cuentas ni recuperación entre dispositivos.
- Las respuestas se guardan en PostgreSQL si está configurado; si no, el modo temporal lo comunica explícitamente.

## Verificación de Fase 1

- `npm ci`: completado desde el lockfile; cero vulnerabilidades reportadas.
- `npm run lint`: correcto.
- `npm run build`: correcto.
- Navegador: 12 preguntas, navegación atrás/salida, respuestas desconocidas y vacías, edición del resumen y confirmación; sin desbordamiento horizontal en escritorio ni móvil.
- Campo numérico con respuesta especial: sin advertencias de consola y con valor conservado en el resumen.

## Verificación de Fase 2

- `npm run db:generate`: genera la migración de cuatro tablas.
- `npm test`: 5 pruebas correctas de borradores, números, campos inválidos, faltantes e inconsistencias.
- `npx tsc --noEmit`, `npm run lint` y `npm run build`: correctos.
- `npm audit --omit=dev`: cero vulnerabilidades.
- `npm run db:migrate`: aplicado correctamente con `DATABASE_URL` de Supabase.
- Prueba HTTP de integración: `POST` crea la entrevista, `PUT` guarda el borrador y `GET` recupera la misma respuesta; las filas sintéticas se eliminaron al terminar.
- `npm audit` reporta 6 vulnerabilidades moderadas en dependencias de desarrollo; no hay avisos críticos. Resolverlas requiere cambios mayores o ajustes de dependencias que no se forzaron.

## Próximo paso

Definir y autorizar el alcance de Fase 3: extracción de respuestas y preguntas de aclaración con IA.