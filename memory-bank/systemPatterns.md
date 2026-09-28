# Patrones del sistema

## Separación de responsabilidades

La interfaz recopila y presenta datos; los casos de uso coordinan el flujo; el dominio valida, normaliza, calcula y clasifica; los adaptadores gestionan almacenamiento y proveedores externos. En la demo local estas capas aún no están implementadas como módulos separados.

## Flujo y estados

El recorrido conceptual es:

```text
borrador -> en_progreso -> pendiente_de_revision -> confirmada -> diagnosticada
```

También se contemplan estados de pausa y error. La demo actual administra pantallas y respuestas con estado local de React; no persiste estos estados.

## Integridad de datos

- Guardar las unidades, procedencia, confirmación y confianza junto con cada dato.
- Mantener diferenciados los datos desconocidos, no aplicables y no respondidos.
- No corregir contradicciones ni inferencias de forma silenciosa.
- Ejecutar cálculos aritméticos en código y validar las unidades antes de presentar resultados.
- Requerir revisión humana antes de confirmar la información extraída.

## Proveedores externos

Las futuras integraciones de IA, voz, correo y almacenamiento deben quedar detrás de interfaces/adaptadores reemplazables. La interfaz del proveedor no debe controlar por sí sola los estados, cifras ni confirmaciones del producto.

## Referencias

La arquitectura conceptual está en [02-arquitectura-y-stack.md](02-arquitectura-y-stack.md); los criterios del diagnóstico están en [01-alcance-y-criterios.md](01-alcance-y-criterios.md).