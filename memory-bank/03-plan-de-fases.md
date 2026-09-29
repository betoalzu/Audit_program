# Plan de fases

## Fase 0: definición

Documentar alcance, datos, estados, arquitectura y criterios de salida. No incluye funcionalidades.

## Fase 1: entrevista escrita

Construir la demo navegable, accesible y responsive con datos locales. Validar el recorrido y el resumen editable.

## Fase 2: esquema y persistencia

Versionar modelos, añadir PostgreSQL, validación de servidor y pruebas de cálculos, faltantes y contradicciones.

## Fase 3: extracción y aclaraciones

Integrar Gemini 3.1 Flash-Lite mediante Vercel AI SDK 6, con salida estructurada, procedencia y revisión humana. Usar el nivel de pago, consentimiento antes del envío, máximo de dos llamadas por entrevista y reutilizar resultados del mismo borrador. La clave vive solo en el servidor.

- Extraer hechos con campo de origen, cita literal y nivel de confianza estimado.
- Detectar campos faltantes, ambigüedades y posibles contradicciones.
- Proponer preguntas de seguimiento breves, sin contestarlas ni modificar los datos automáticamente.
- Validar la salida con Zod y conservar modelo, versión del prompt y consumo de tokens.
- Evaluar con casos representativos; separar error del proveedor, respuesta inválida y falta de configuración.

La tarifa consultada de Gemini 3.1 Flash-Lite es $0.25/1M tokens de entrada y $1.50/1M de salida. Revisar [precios](https://ai.google.dev/gemini-api/docs/pricing) y [tratamiento de datos](https://ai.google.dev/gemini-api/terms) antes de un piloto, pues pueden cambiar.

## Fase 4: diagnóstico e informe

Añadir cálculos deterministas, reglas de recomendación, resumen diagnóstico y generación controlada de PDF.

## Fase 5: correo y operación

Añadir envío transaccional, estados verificables, reintentos, protección contra duplicados y panel administrativo si procede.

## Fase 6: voz opcional

Añadir consentimiento, captura, transcripción visible, edición y continuidad por texto.

## Fase 7: piloto

Probar con empresas del sector inicial, medir utilidad, calidad, abandono, coste y errores antes de ampliar el alcance.

## Regla de trabajo

Cada fase termina con pruebas enfocadas, revisión del resultado y un commit independiente. No se inicia la siguiente fase hasta validar la anterior.