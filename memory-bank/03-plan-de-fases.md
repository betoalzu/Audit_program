# Plan de fases

## Fase 0: definición

Documentar alcance, datos, estados, arquitectura y criterios de salida. No incluye funcionalidades.

## Fase 1: entrevista escrita

Construir la demo navegable, accesible y responsive con datos locales. Validar el recorrido y el resumen editable.

## Fase 2: esquema y persistencia

Versionar modelos, añadir PostgreSQL, validación de servidor y pruebas de cálculos, faltantes y contradicciones.

## Fase 3: extracción y aclaraciones

Integrar un modelo existente detrás de una interfaz, con salida estructurada, procedencia y revisión humana.

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