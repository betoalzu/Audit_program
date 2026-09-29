# Prompt: mejorar el resultado del análisis de la entrevista

Actúa como un ingeniero senior familiarizado con este proyecto Next.js y revisa el flujo completo de análisis y presentación de entrevistas antes de modificarlo.

## Objetivo

Cambia el resultado del análisis de la entrevista para que el usuario vea únicamente los hallazgos que requieren atención y pueda aclarar, de forma opcional, las respuestas que el sistema haya clasificado con baja confianza.

## Requisitos funcionales

1. Elimina del resultado visible el listado de todas las preguntas con su resultado individual.
2. Conserva únicamente las preguntas o hallazgos detectados como:
   - inconsistentes;
   - faltantes;
   - ambiguos;
   - de baja confianza; o
   - cualquier otra categoría que requiera revisión o aclaración.
3. Para cada hallazgo de baja confianza, genera una pregunta de seguimiento concreta que ayude a obtener información suficiente para aumentar la confianza del análisis.
4. La pregunta de seguimiento debe:
   - estar relacionada con el hallazgo original;
   - ser clara y específica;
   - evitar pedir información que el análisis ya conoce;
   - permitir una respuesta libre adecuada al contexto; y
   - mostrarse solo cuando exista una baja confianza que pueda aclararse.
5. La pregunta de seguimiento debe ser opcional. Incluye un botón visible con el texto `Prefiero no contestar` para que el usuario pueda omitirla sin que la interfaz quede en un estado incompleto.
6. Conserva el comportamiento actual para guardar, consultar y analizar la entrevista, salvo los cambios necesarios para cumplir estos requisitos.
7. Si el modelo de datos, el esquema de validación o la API necesitan nuevos campos para representar los hallazgos y las preguntas de seguimiento, actualízalos de forma compatible con el flujo existente.

## Requisitos de interfaz

- Presenta los hallazgos en una vista clara y escaneable.
- No muestres una sección redundante con todas las preguntas analizadas.
- Distingue visualmente el tipo de hallazgo y su nivel de confianza.
- Muestra la pregunta de seguimiento junto con el hallazgo de baja confianza.
- Permite responder, omitir con `Prefiero no contestar` y continuar sin bloquear el flujo.
- Mantén los estilos y componentes existentes del proyecto.
- Asegura que el diseño funcione en escritorio y móvil.

## Requisitos técnicos

- Inspecciona primero las rutas de API, los esquemas, la lógica de análisis y los componentes de la interfaz que controlan este resultado.
- Reutiliza los tipos y patrones existentes; no dupliques modelos ni lógica sin necesidad.
- Valida las respuestas externas y conserva un comportamiento seguro si falta la pregunta de seguimiento.
- No expongas datos internos del prompt ni información técnica innecesaria al usuario final.
- Actualiza las pruebas existentes y agrega las pruebas mínimas necesarias para cubrir:
  - ocultar preguntas sin hallazgos;
  - mostrar solo hallazgos relevantes;
  - generar y mostrar una pregunta para baja confianza;
  - aceptar una respuesta de seguimiento;
  - omitirla con `Prefiero no contestar`; y
  - manejar una respuesta sin pregunta de seguimiento.

## Criterios de aceptación

- El resultado no muestra todas las preguntas de la entrevista.
- Solo aparecen preguntas con inconsistencias, faltantes, ambigüedades, baja confianza u otros hallazgos que requieran atención.
- Cada hallazgo de baja confianza incluye una pregunta de aclaración útil cuando sea posible.
- El usuario puede contestar la pregunta o pulsar `Prefiero no contestar`.
- Ninguna de las dos opciones bloquea el uso posterior del flujo.
- La información existente de la entrevista no se pierde.
- Las pruebas y la comprobación de tipos/lint pasan sin errores nuevos.

## Forma de trabajo

1. Revisa el código relevante y localiza el punto exacto donde se construye y renderiza el resultado.
2. Explica brevemente la causa del comportamiento actual y el cambio propuesto.
3. Implementa el cambio con el menor alcance necesario.
4. Ejecuta las pruebas enfocadas, el lint y la comprobación de tipos disponibles.
5. Resume los archivos modificados, las decisiones relevantes y cualquier limitación pendiente.
