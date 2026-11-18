# Pruebas y aceptación del frontend

## Por módulo
- [ ] Todas las vistas derivadas de RF oficiales están inventariadas.
- [ ] Los formularios muestran campos exigidos por contrato real, sin inventar obligatoriedad.
- [ ] Listados y detalle: loading, empty, error, 403 y éxito.
- [ ] Operaciones CRUD muestran confirmación y mensajes de error.
- [ ] Archivos: tamaño/tipo, descarga autorizada, revisión y correcciones según API.
- [ ] Acceso según rol; asesor/auxiliar ven solo recursos autorizados.
- [ ] No se muestra administrador con acciones operativas de auxiliar/asesor.
- [ ] No se integran pantallas de escritura de Finanzas.

## Responsividad y UI
- [ ] Móvil 360–430 px, tablet 768 px, laptop 1280 px, desktop 1440 px.
- [ ] Sin desbordamiento horizontal global.
- [ ] Navegación y modales accesibles por teclado.
- [ ] Paleta de cinco colores exacta; tipografías existentes conservadas.
- [ ] Nuxt UI oficial y alertas success/warning/error/info.
- [ ] Texto en español, etiquetas y errores comprensibles.

## Evidencia
- [ ] Typecheck, lint y build ejecutados cuando existan scripts.
- [ ] Capturas por pantalla/tamaño para documentar resultados, si procede.
- [ ] Informe final separa páginas terminadas, API conectada y pendientes.
- [ ] No se afirma cumplimiento de RNF-01 (3 s consultas, 5 s PDF) sin medición.

## Criterios específicos RF-40–RF-51
- [ ] Asignar auxiliares a clientes propios y consultar asignaciones activas (RF-40–41).
- [ ] Crear tareas con título/instrucciones y mostrar tareas asignadas con cliente/estado (RF-42–43).
- [ ] Subir, descargar y actualizar documentos con permisos verificados (RF-44–45).
- [ ] Revisar, aprobar u observar documentos y consultar estados pendiente/no validado/validado/cancelado (RF-46–47, RF-49).
- [ ] Conservar historial al cargar correcciones (RF-48).
- [ ] Impedir eliminación de archivos ajenos y respetar conservación (RF-50).
- [ ] Actualizar estados pendiente/completada/cancelada (RF-51).
