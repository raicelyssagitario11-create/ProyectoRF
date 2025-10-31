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
- 2025-10-31 — GH — 0.1.0
  - feat: Separación de código en archivos: `styles.css` y `script.js`; actualizado `index.html` para referenciarlos; creado `README.md` de seguimiento.
  - chore: Preparados commits locales para push al remoto.
  - Notas: Commit local creado; se intentó push al remoto (ver historial git para estado final).

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

### Últimos cambios
- 2025-10-31 — GH
  - chore: Separado el código en archivos estáticos.
    - `index.html`: ahora enlaza a `styles.css` y `script.js` en la raíz del proyecto.
    - `styles.css`: contiene los estilos extraídos del bloque <style>.
    - `script.js`: contiene toda la lógica JS que estaba inline en `index.html`.
  - docs: Actualizado `README.md` con este registro de cambios y plantillas para bugs/tareas.
  - Notas: Recomendado revisar en navegador y, si aparece algún fallo por orden de carga, añadir `defer` al script o envolver inicialización en `DOMContentLoaded`.

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
