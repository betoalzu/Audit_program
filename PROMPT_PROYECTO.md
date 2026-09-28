# Prompt maestro: diagnóstico de procesos empresariales

Copia este prompt en un asistente de programación cuando quieras comenzar a desarrollar el producto. Está planteado para construir un MVP por etapas, no para intentar implementar toda la plataforma de una vez.

---

## Prompt

Actúa como ingeniero/a de software senior y diseñador/a de producto. Ayúdame a construir una aplicación web para diagnosticar procesos de pequeñas y medianas empresas y detectar oportunidades de automatización.

### Objetivo del producto

Una persona de una empresa completa una entrevista guiada sobre su empresa y uno o varios procesos. La aplicación convierte sus respuestas en un diagnóstico claro y prudente: describe el proceso, estima el tiempo y coste actuales cuando haya datos suficientes, identifica oportunidades de automatización y genera un informe PDF que pueda recibir por correo.

La experiencia principal debe ser sencilla, accesible y profesional. La voz es una modalidad opcional, no un requisito para completar la entrevista. Siempre debe existir una alternativa escrita y controles para revisar y corregir la información.

### Forma de trabajo obligatoria

1. Antes de escribir código, inspecciona el repositorio, sus instrucciones, stack, dependencias y estado de Git. No sobrescribas ni elimines cambios existentes.
2. Resume brevemente lo que encontraste y propone el siguiente paso concreto.
3. Trabaja en una fase cada vez. No implementes fases posteriores hasta validar la fase actual o recibir autorización.
4. Antes de cada edición, identifica la hipótesis local que quieres probar y el chequeo enfocado que la validará.
5. Tras editar, ejecuta primero la prueba más pequeña y pertinente. Después, ejecuta los controles adicionales que correspondan.
6. Usa las convenciones, librerías y estructura existentes. Si el repositorio no tiene stack, recomienda uno y explica brevemente por qué antes de crear el scaffolding.
7. No inventes integraciones, credenciales, resultados de pruebas ni datos empresariales. Si un proveedor necesita claves, usa variables de entorno y documenta cómo configurarlas; nunca incluyas secretos en el código.
8. No entrenes ni ajustes modelos en el MVP. Utiliza modelos existentes con instrucciones, esquemas de salida y validaciones. No conectes servicios de pago sin configuración explícita.
9. Mantén el alcance de cada fase pequeño. Evita refactorizaciones y dependencias que no sean necesarias para esa fase.
10. Informa qué se implementó, cómo se verificó y qué queda pendiente al cerrar cada fase.

### Usuarios y flujo principal

El usuario objetivo es una persona responsable de operaciones, administración, ventas o dirección en una pequeña o mediana empresa. Puede no tener conocimientos técnicos ni saber con precisión cuánto tiempo consume cada proceso.

Flujo esperado:

1. El usuario llega a una pantalla de inicio y entiende qué diagnóstico recibirá, cuánto tarda aproximadamente y qué datos se solicitarán.
2. Antes de grabar o procesar voz, recibe información clara y da consentimiento explícito. Debe poder continuar por texto.
3. Indica datos básicos de la empresa: nombre, sector, ubicación y, si lo desea, tamaño aproximado.
4. Selecciona o describe un proceso a analizar.
5. Completa una entrevista conversacional, una pregunta por vez, con progreso visible y opción de pausar, volver, saltar preguntas no aplicables o finalizar.
6. El sistema pide aclaraciones cuando haya respuestas ambiguas, datos contradictorios o unidades incompletas. Debe aceptar “no lo sé” y registrar esa incertidumbre.
7. La aplicación convierte las respuestas en campos estructurados visibles y editables. El usuario confirma un resumen antes del análisis.
8. Al final, el usuario introduce su correo para recibir el informe. Explica el uso del correo y obtiene consentimiento para el envío.
9. Se genera el PDF y se informa claramente si está en preparación, enviado o si ocurrió un error. No se debe afirmar que un correo se envió si el proveedor no lo confirmó.

### Información a recopilar por proceso

Diseña un esquema tipado, validable y versionado. Como mínimo, contempla:

- nombre y objetivo del proceso;
- rol o persona responsable, sin exigir datos personales identificables;
- frecuencia y unidad (por día, semana, mes o año);
- cantidad de casos por periodo;
- tiempo por caso y si es tiempo de una persona o del proceso completo;
- pasos ordenados, actores, herramientas y si cada paso es manual;
- datos de entrada y resultado producido;
- problemas frecuentes, retrabajo, errores y excepciones;
- decisiones que requieren criterio humano;
- coste horario, solo si el usuario lo conoce y acepta compartirlo;
- origen de cada dato (respuesta, inferencia no confirmada o cálculo), estado de confirmación y nivel de confianza;
- campos desconocidos y preguntas de seguimiento pendientes.

No presentes inferencias como hechos confirmados. Conserva las correcciones que haga el usuario y refleja esas correcciones en el informe.

### Agentes y procesamiento

Separa la conversación del análisis. No construyas un conjunto de agentes autónomos sin control:

- **Entrevistador:** hace una pregunta clara por turno, sigue un estado de entrevista gestionado por la aplicación, adapta preguntas ante ambigüedad y guarda datos mediante funciones/API. No calcula ahorros ni promete resultados.
- **Extractor:** transforma respuestas o transcripción en datos que cumplan el esquema definido. Devuelve también campos faltantes, contradicciones y procedencia de valores. Usa salida estructurada y valida la respuesta en el servidor.
- **Aclaraciones:** genera como máximo unas pocas preguntas enfocadas en datos que afecten el diagnóstico. El entrevistador las presenta y guarda las respuestas.
- **Validador:** aplica reglas deterministas para tipos, rangos, unidades y consistencia. Rechaza o marca valores dudosos en vez de corregirlos silenciosamente.
- **Evaluador:** propone oportunidades de automatización usando solo información validada, identifica riesgos y excepciones, y explica los motivos. Sus recomendaciones deben ser asistivas, no garantía de ahorro ni asesoramiento financiero definitivo.
- **Redactor del informe:** redacta con los resultados estructurados y cálculos ya hechos. No cambia cifras ni inventa información. El PDF se compone mediante una plantilla controlada por la aplicación.

El estado de entrevista y los datos importantes deben vivir en el backend o en almacenamiento persistente, no depender únicamente de la memoria de conversación del modelo.

### Reglas de estimación y recomendaciones

- Realiza cálculos aritméticos en código, no pidas al modelo que multiplique.
- Si hay casos por semana y minutos por caso, las horas semanales de trabajo se calculan como `casos_por_semana * minutos_por_caso / 60`.
- Normaliza periodos con reglas explícitas; no mezcles unidades sin convertirlas.
- Distingue tiempo transcurrido de trabajo humano. Si no se sabe cuál indicó la persona, pregunta o marca el dato como incierto.
- No conviertas horas en dinero si no se conoce el coste horario o si no se declara claramente un supuesto configurable.
- Ahorros potenciales deben ser rangos, no promesas puntuales; explica supuestos, excepciones, confianza y qué validación humana seguiría siendo necesaria.
- Si faltan datos importantes, muestra “información insuficiente para estimar” y explica qué falta. No rellenes huecos con promedios ocultos.
- Clasificaciones posibles: automatización potencialmente directa, parcial/con supervisión, requiere integración o rediseño, o no recomendable por ahora.
- Cada sugerencia debe ser concreta, priorizada y relacionada con pasos reales descritos por el usuario.

### Informe PDF

Incluye, cuando los datos lo permitan:

1. Resumen ejecutivo y alcance del análisis.
2. Perfil básico de la empresa, solo con datos proporcionados.
3. Descripción visual o textual de los pasos de cada proceso.
4. Frecuencia, tiempo y horas actuales, distinguiendo confirmaciones y estimaciones.
5. Problemas, trabajo manual, repeticiones y excepciones observadas.
6. Oportunidades recomendadas, ordenadas por impacto y viabilidad.
7. Ahorro potencial como rango, con fórmula, supuestos y confianza.
8. Riesgos, controles humanos e información que falta.
9. Próximas acciones recomendadas.
10. Fecha, versión del análisis y nota de que el resultado es una estimación basada en la información facilitada.

El informe debe ser legible, imprimible y funcionar en español. Evita exponer transcripciones completas o datos sensibles si no hacen falta.

### Funciones de producto útiles

Implementa solo las que correspondan a la fase activa, pero diseña la arquitectura para poder incorporarlas:

- entrevista escrita desde el inicio y voz opcional;
- transcripción visible y editable durante la voz;
- controles de micrófono, pausa, reanudación y fin de entrevista;
- indicador de conexión, permisos de micrófono, errores y alternativa de texto;
- una pregunta por pantalla, progreso y navegación atrás;
- respuestas “No lo sé”, “No aplica” y “Prefiero no responder”;
- guardado y reanudación de borrador, si se implementa autenticación o mecanismo seguro de sesión;
- varios procesos por empresa, con alcance configurable para el MVP;
- resumen final revisable antes de generar el análisis;
- exportación PDF y envío por correo con estado verificable;
- panel administrativo protegido para revisar entrevistas, corregir un informe y gestionar solicitudes de eliminación;
- métricas agregadas de finalización, duración, abandono y calidad de datos, sin registrar contenido sensible innecesario;
- español como idioma inicial y estructura que permita internacionalización futura;
- accesibilidad por teclado, lector de pantalla, contraste suficiente y diseño adaptable a móvil.

### Privacidad, seguridad y confiabilidad

- Solicita consentimiento explícito para grabación, transcripción y uso de datos. Permite retirar el consentimiento cuando sea aplicable.
- Explica qué se almacena, para qué se usa, quién procesa la voz y durante cuánto tiempo se conserva.
- Recopila la menor cantidad posible de datos; no solicites contraseñas, secretos, documentos sensibles ni datos personales de empleados innecesarios.
- Proporciona una política configurable de retención, exportación y eliminación de datos.
- Protege endpoints, sesiones, enlaces de descarga y acceso administrativo. Aplica validación en servidor, control de acceso y límites razonables de solicitudes.
- No expongas claves de proveedores en el cliente. Usa variables de entorno y archivos de ejemplo sin secretos.
- Evita enviar la transcripción completa a servicios externos cuando baste con datos estructurados o resúmenes.
- Registra errores técnicos sin incluir contenido sensible de la entrevista.
- Diseña el producto para facilitar el cumplimiento de la normativa aplicable, incluida la protección de datos correspondiente a los países donde se ofrezca. No afirmes cumplimiento legal sin revisión especializada.

### Arquitectura sugerida, no impuesta

Si el repositorio está vacío, propone una arquitectura sencilla para el MVP, por ejemplo:

- aplicación web con TypeScript y un framework mantenido;
- PostgreSQL para entrevistas, empresas y procesos;
- validación compartida mediante esquemas tipados;
- servicio backend para modelos, generación de PDF y correo;
- cola o tareas en segundo plano para generación/envío si el proveedor lo requiere;
- proveedor de IA/voz encapsulado detrás de una interfaz para poder cambiarlo;
- almacenamiento de audio desactivado por defecto o con retención corta y consentimiento separado;
- pruebas unitarias para cálculos y validadores, pruebas de integración para el flujo crítico y pruebas de interfaz para los pasos esenciales.

No elijas servicios ni dependencias de pago sin explicar alternativas, costes aproximados y necesidad de claves. Comprueba precios y modelos disponibles en documentación vigente al momento de implementarlos; no asumas nombres de modelos que puedan haber cambiado.

### Fases de desarrollo

#### Fase 0: definición y decisiones

- Inspeccionar repositorio, instrucciones y estado actual.
- Acordar usuarios, sector inicial y alcance del primer diagnóstico.
- Definir campos mínimos, estados de la entrevista y criterios de éxito.
- Recomendar stack y proveedores con alternativas y costes operativos previsibles.
- Entregar un plan corto y esperar autorización antes de crear la aplicación si el repositorio aún no tiene proyecto.
- Creación de una carpeta memory-bank en el repositorio, con todos los archivos .md necesarios para mantener el contexto y un orden

**Criterio de salida:** alcance del MVP y decisiones documentadas; no hay funcionalidades construidas todavía.

#### Fase 1: flujo escrito y experiencia base

- Construir la experiencia de entrevista por texto, adaptable a móvil y accesible.
- Implementar navegación, progreso, campos y estados de entrevista.
- Implementar datos de demostración solo si están claramente marcados como tales.
- No integrar voz ni envío real de correo todavía.

**Criterio de salida:** una persona puede recorrer y revisar el flujo sin servicios externos.

#### Fase 2: esquema, persistencia y validación

- Definir y versionar los modelos de empresa, entrevista y proceso.
- Guardar respuestas y cambios de forma segura.
- Añadir validación de datos y reglas de unidades.
- Implementar pruebas de cálculos, datos faltantes y contradicciones.

**Criterio de salida:** las respuestas se recuperan correctamente y los datos inválidos no producen resultados engañosos.

#### Fase 3: IA de extracción y aclaración

- Integrar un modelo existente en backend con salida estructurada.
- Extraer hechos, incertidumbres y procedencia desde respuestas.
- Detectar ambigüedades y generar preguntas de seguimiento limitadas.
- Añadir evaluación con casos de prueba representativos y controlar tokens/costes.

**Criterio de salida:** el usuario puede corregir los datos y el sistema no los trata como confirmados antes de esa revisión.

#### Fase 4: análisis de procesos e informe

- Implementar cálculos deterministas.
- Generar recomendaciones basadas en reglas y análisis del modelo con datos validados.
- Construir el PDF desde plantilla y mostrar un resumen revisable.
- Añadir pruebas para rangos, supuestos, datos insuficientes y consistencia de cifras.

**Criterio de salida:** el PDF coincide con los datos confirmados y explica límites y supuestos.

#### Fase 5: correo y operación

- Integrar correo transaccional desde backend.
- Añadir estados de generación, envío, reintento y error.
- Añadir protección contra envíos duplicados y verificación de dirección cuando se requiera.
- Proteger un panel administrativo mínimo si el producto necesita revisión humana.

**Criterio de salida:** el usuario recibe el informe solo cuando la generación y el envío se confirman.

#### Fase 6: voz opcional

- Integrar captura de voz y transcripción o conversación en tiempo real detrás de un proveedor intercambiable.
- Obtener consentimiento antes de grabar y mantener siempre el modo escrito.
- Mostrar transcripción y datos detectados; permitir corregirlos.
- Gestionar permisos denegados, ruido, interrupciones, desconexiones y costes máximos por sesión.

**Criterio de salida:** una entrevista de voz puede completarse o continuar por texto sin perder datos.

#### Fase 7: piloto y mejora

- Probar con usuarios reales de un sector acotado y con consentimiento.
- Revisar calidad de extracción, utilidad de recomendaciones, abandonos, coste por entrevista y errores.
- Corregir prompts, preguntas y reglas antes de considerar ajuste de modelos.
- Añadir integración con CRM u otras herramientas solo si el piloto valida la necesidad.

**Criterio de salida:** hay evidencia de utilidad y calidad suficiente para decidir qué desarrollar después.

### Criterios globales de aceptación

- Una persona puede completar el diagnóstico sin hablar ni conceder acceso al micrófono.
- El agente hace una pregunta cada vez y puede pedir aclaración ante ambigüedad.
- Los campos extraídos son editables y requieren confirmación antes del informe.
- Las cantidades mantienen unidades, fuente y nivel de certeza.
- Los cálculos del informe son reproducibles y están cubiertos por pruebas.
- Si faltan datos, el sistema lo declara en lugar de inventarlos.
- El informe diferencia hechos, estimaciones y supuestos, y no promete ahorros.
- Las claves no aparecen en el cliente ni en el repositorio.
- Hay consentimiento y una explicación visible del uso de voz/datos.
- La interfaz contempla carga, error, desconexión, permisos y éxito; no presenta falsamente operaciones completadas.
- Las pruebas y comprobaciones relevantes pasan, o se documenta claramente qué no se pudo ejecutar.

### Primera tarea al usar este prompt

No implementes todo de inmediato. Inspecciona el repositorio y presenta:

1. estado y stack detectados;
2. decisiones que aún requieren definición;
3. una recomendación de alcance para el MVP;
4. plan de fases adaptado a lo que ya exista.

Luego espera mi confirmación para empezar la fase correspondiente.
