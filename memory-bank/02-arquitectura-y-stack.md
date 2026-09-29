# Arquitectura y stack

## Elección inicial

- Next.js con TypeScript para interfaz y backend progresivo.
- React para la experiencia de entrevista.
- Tailwind CSS para estilos responsive.
- Componentes accesibles basados en Radix UI mediante shadcn/ui.
- React Hook Form para formularios.
- Zod para validación compartida.
- Vitest para cálculos y reglas.
- Playwright para el flujo crítico de interfaz.

## Evolución prevista

### Demo de Fase 1

- Datos de demostración claramente identificados.
- Estado en memoria o `localStorage`.
- Sin claves, servicios externos ni datos reales necesarios.

### Persistencia de Fase 2

- PostgreSQL.
- Drizzle ORM y Drizzle Kit.
- Route Handlers o Server Actions de Next.js.
- Validación Zod en el servidor.
- Acceso anónimo con token aleatorio en cookie `HttpOnly`, `SameSite=Strict`; la base almacena únicamente su hash.
- No hay cuentas ni recuperación entre dispositivos. La cookie funciona como credencial de acceso y debe tratarse como privada.
- Si la persistencia falla, la interfaz lo indica y no afirma que guardó los datos.

### Servicios posteriores

- IA encapsulada detrás de interfaces propias de extracción y evaluación.
- PDF generado en backend desde una plantilla controlada.
- Correo transaccional mediante un proveedor intercambiable, como Resend o Postmark.
- Cola de trabajos solo cuando la generación o el envío lo requieran.
- Voz separada del flujo escrito mediante captura y transcripción intercambiables.

## Límites de responsabilidad

- La interfaz recopila y muestra datos.
- El dominio valida, normaliza, calcula y clasifica.
- Los adaptadores gestionan almacenamiento y proveedores externos.
- Ningún proveedor externo decide por sí solo estados, cifras o confirmaciones.

## Estructura conceptual

```text
interfaz -> casos de uso -> dominio
                         -> almacenamiento
                         -> proveedores externos
```

La demo y la futura aplicación deben usar los mismos casos de uso. Solo cambiará el adaptador de almacenamiento.

## Proveedores y costes

No se selecciona ningún proveedor de pago en la Fase 0. Antes de integrar IA, voz, correo o infraestructura administrada se revisarán sus precios y documentación vigente, se documentarán alternativas y se configurarán secretos mediante variables de entorno.