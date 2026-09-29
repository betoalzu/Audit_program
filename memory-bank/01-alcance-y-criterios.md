# Alcance y criterios de salida

## Usuario inicial

Persona responsable de operaciones, administración o dirección de una pequeña distribuidora mayorista. Puede no conocer con precisión el tiempo o coste de cada actividad.

## Flujo de la demo

1. La pantalla inicial explica el objetivo, la duración aproximada y los datos solicitados.
2. La persona inicia una entrevista escrita.
3. Indica datos básicos de la empresa.
4. Describe el proceso de recepción y gestión de pedidos.
5. Responde preguntas sobre frecuencia, volumen, duración, pasos, herramientas, errores y excepciones.
6. Revisa un resumen estructurado y editable.
7. Confirma el resumen.
8. Consulta el cierre explícito de la demo; en esta fase no se calcula un diagnóstico.

## Datos mínimos del esquema completo

Estos campos describen el objetivo del modelo de datos y se incorporarán por fases; la demo de Fase 1 no los recopila todos.

- nombre de la empresa;
- sector y ubicación;
- nombre y objetivo del proceso;
- rol responsable, sin datos personales identificables;
- cantidad de casos y unidad temporal;
- tiempo por caso y tipo de tiempo indicado;
- pasos ordenados, actores, herramientas y carácter manual;
- entradas y resultado;
- problemas, errores, retrabajo y excepciones;
- decisiones que requieren criterio humano;
- coste horario opcional;
- origen, confirmación y confianza de cada dato;
- datos desconocidos y preguntas pendientes.

## Estados de entrevista

```text
borrador -> en_progreso -> pendiente_de_revision -> confirmada -> diagnosticada
```

Estados de error o interrupción:

```text
en_progreso -> pausada
en_progreso -> error
```

La demo puede mantener estos estados localmente. La persistencia remota se añadirá en la Fase 2.

## Reglas iniciales de diagnóstico

- Normalizar la frecuencia a una unidad común antes de calcular.
- Calcular horas humanas como `casos_por_periodo * minutos_por_caso / 60` cuando ambos datos estén confirmados.
- No calcular dinero si falta el coste horario confirmado.
- Marcar como potencialmente automatizable una tarea repetitiva, frecuente, basada en reglas y con baja necesidad de criterio humano.
- Clasificar como parcial o con supervisión cuando existan excepciones, decisiones humanas o validaciones necesarias.
- Mostrar información insuficiente cuando falten datos esenciales o haya contradicciones.

## Criterios de salida de la Fase 1

- Se puede recorrer la entrevista escrita completa en móvil y escritorio.
- Solo aparece una pregunta principal por paso.
- Se puede avanzar, volver atrás y revisar el progreso.
- Las respuestas desconocidas o no aplicables no se fuerzan como datos reales.
- El resumen es editable antes de confirmar.
- La pantalla de cierre no afirma que se hayan calculado ahorros, enviado informes o conectado servicios.