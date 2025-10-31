# Registro de actualizaciones del proyecto

Este archivo sirve para llevar el control centralizado de las actualizaciones del proyecto: cambios, bugs críticos y tareas pendientes.

## ÍNDICE

- [Formato y Convenciones](#formato-y-convenciones)
- [Registro de Cambios (CHANGELOG)](#registro-de-cambios-changelog)
- [Bugs críticos](#bugs-cr%C3%ADticos)
- [Tareas por hacer (TODO)](#tareas-por-hacer-todo)
- [Cómo reportar un bug o añadir una tarea](#c%C3%B3mo-reportar-un-bug-o-a%C3%B1adir-una-tarea)
- [Ejemplo de entradas](#ejemplo-de-entradas)

---

## Cambios recientes

Se listan aquí las modificaciones realizadas en esta sesión (útil para el primer commit después de refactorizar la estructura de archivos).

- 2025-10-31 — GH
  - feat: Separado el HTML, CSS y JS en archivos independientes: `index.html`, `styles.css`, `script.js`.
  - feat: Añadido archivo `styles.css` con estilos globales y reglas para impresión.
  - feat: Añadido archivo `script.js` con toda la lógica de la aplicación (simulación de DB, CRUD, generación de links, renderizado de vistas).
  - chore: Actualizado `index.html` para referenciar `styles.css` y `script.js` y así mejorar mantenimiento.

Notas: después de subir, abrir `index.html` en un navegador para verificar que Tailwind y las fuentes se cargan y que las interacciones funcionan como antes.


## Formato y Convenciones

- Fecha: ISO (YYYY-MM-DD).
- Autor: nombre o iniciales.
- Prioridad: baja / media / alta / crítico.
- Estado (para tareas): abierto / en progreso / bloqueado / cerrado.
- Cada entrada nueva se añade al principio (orden descendente por fecha).

Usar este formato para facilitar búsquedas y filtrado.

---

## Registro de Cambios (CHANGELOG)

Anotar cambios relevantes, pequeñas mejoras o refactors que afecten al comportamiento. Incluye dependencias actualizadas, migraciones o cambios breaking.

Formato recomendado por entrada:
- Fecha — Autor — Versión (si aplica)
  - Tipo: (fix / feat / chore / docs / refactor)
  - Descripción breve (1-2 líneas)
  - Notas de despliegue (si aplica)

Ejemplo vacío (completar abajo):

- 2025-10-31 — GH — 0.1.0
  - feat: Añadido README de seguimiento y plantillas de reporte.
  - Notas: Ninguna.

---

## Bugs críticos

Lista de errores que impiden funcionamiento básico o causan pérdida de datos. Mantener actualizada la prioridad y el estado.

Formato por bug:
- ID: BUG-YYYY-NNN
- Fecha — Reportado por — prioridad: crítico / alta
- Estado: abierto / en progreso / resuelto
- Descripción detallada
- Pasos para reproducir
- Impacto y workaround (si existe)
- Referencia a commit/PR o a archivo donde se arregló (cuando aplique)

Ejemplo:
- BUG-2025-001
  - 2025-10-31 — GH — prioridad: crítico
  - Estado: abierto
  - Descripción: Al guardar, los cambios se pierden si la conexión cae.
  - Pasos: 1) Abrir X 2) Editar 3) Guardar 4) Simular pérdida de conexión
  - Impacto: pérdida de datos del usuario; workaround: volver a intentar guardar.

---

## Tareas por hacer (TODO)

Mantener las tareas organizadas por prioridad. Mover a cerrado cuando se complete y añadir referencia a commit/PR.

Formato por tarea:
- ID: TODO-YYYY-NNN
- Fecha — Autor — prioridad
- Estado: abierto / en progreso / bloqueado / cerrado
- Descripción
- Notas / subtareas

Ejemplo:
- TODO-2025-001
  - 2025-10-31 — GH — prioridad: media
  - Estado: abierto
  - Descripción: Revisar accesibilidad de `index.html`
  - Notas: Añadir etiquetas ARIA y revisar contraste.

---

## Cómo reportar un bug o añadir una tarea

1. Crear una entrada nueva en la sección correspondiente con el formato arriba.
2. Si es crítico, poner `prioridad: crítico` y notificar por el canal de comunicación del equipo.
3. Añadir una referencia a la rama/PR cuando se inicie la solución.
4. Al resolver, indicar la referencia del commit o PR y cambiar el estado a `resuelto` o `cerrado`.

---

## Ejemplo de entradas

### Cambio
- 2025-10-31 — GH — 0.1.0
  - feat: Añadido README de seguimiento y plantillas de reporte.
  - Notas: Plantilla inicial creada.

### Bug crítico
- BUG-2025-001
  - 2025-10-31 — GH — prioridad: crítico
  - Estado: abierto
  - Descripción: Al guardar, los cambios se pierden si la conexión cae.
  - Pasos para reproducir: ver sección "Bugs críticos".
  - Impacto: pérdida de datos.

### Tarea
- TODO-2025-001
  - 2025-10-31 — GH — prioridad: media
  - Estado: abierto
  - Descripción: Revisar accesibilidad de `index.html`.

---

## Notas finales

- Mantener el README legible y conciso; para discusiones largas usar issues/PRs.
- Este archivo es la fuente principal para conozca el estado del proyecto rápidamente.

---

(Archivo generado automáticamente el 2025-10-31)
