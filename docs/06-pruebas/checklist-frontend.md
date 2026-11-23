# Checklist de aceptación frontend — H3GA

> Marcar solo después de comprobar y añadir evidencia: ruta, captura, prueba, comando o contrato.

## 1. Cobertura documental
- [ ] Todas las imágenes de `docs/05-modulos/` están inventariadas.
- [ ] Cada captura tiene interfaz relacionada o justificación de no aplicación.
- [ ] RF-01 a RF-75 mapeados a UI, proceso backend o justificación.
- [ ] Numeración oficial preservada (incluido RF-9).
- [ ] Dudas de diseño, negocio y permisos registradas.

## 2. Base global
- [ ] Layout, navegación, sesión y logout preservados.
- [ ] Roles coinciden con código/contrato.
- [ ] Sidebar/header/perfil funcionan.
- [ ] Componentes compartidos reutilizados.
- [ ] Tokens H3GA y tipografía contrastados con CSS/configuración.
- [ ] APIs de Nuxt UI corresponden a versión instalada.

## 3. Cada interfaz
- [ ] Página y secciones implementadas.
- [ ] Campos, etiquetas, placeholders y ayudas revisados.
- [ ] Validaciones y mensajes contemplados.
- [ ] Modales tienen disparador, cierre y cancelación.
- [ ] Tablas/filtros/orden/paginación cuando corresponda.
- [ ] Todos los botones tienen comportamiento definido.
- [ ] Acciones pendientes no simulan éxito.
- [ ] Loading, vacío, error, sin permiso y éxito cubiertos.
- [ ] Teclado, foco, etiquetas y contraste utilizables.

## 4. Responsive
- [ ] 1920 comparado con Figma.
- [ ] 1440 comparado con Figma.
- [ ] 1024 usable.
- [ ] 400 usable.
- [ ] Anchos intermedios comprobados.
- [ ] Sin scroll horizontal global accidental.
- [ ] Tablas con scroll interno/adaptación sin perder datos/acciones.
- [ ] Modales dentro del viewport.
- [ ] Controles táctiles y navegación móvil usables.

## 5. Integración y seguridad
- [ ] Integraciones existentes preservadas.
- [ ] Cada endpoint nuevo tiene evidencia backend/Swagger.
- [ ] Request/response y tipos coinciden con contrato.
- [ ] Permisos y propiedad validados en backend.
- [ ] Sin tokens ni URLs privadas expuestas.
- [ ] Archivos respetan formatos/tamaño/MIME confirmados.
- [ ] Sin mocks que simulen persistencia.
- [ ] Destructivas con confirmación y protección doble envío.
- [ ] Errores HTTP tratados según contrato real.

## 6. Calidad técnica
- [ ] `pnpm typecheck` ejecutado y resultado registrado.
- [ ] `pnpm lint` ejecutado y resultado registrado.
- [ ] `pnpm build` ejecutado y resultado registrado.
- [ ] Pruebas existentes ejecutadas y resultado registrado.
- [ ] Regresiones revisadas.
- [ ] Limitaciones de navegador/entorno declaradas.

## 7. Evidencia de cierre
| Módulo/interfaz | Estado | Captura/prueba | Comando/resultado | Pendientes |
|---|---|---|---|---|
| Completar | Pendiente | | | |

## Criterio de cierre
Un módulo solo queda «revisado» cuando todas sus filas de matriz tienen estado/evidencia, no quedan piezas sin implementar o justificar, responsive y permisos se comprobaron, y no hay defectos bloqueantes conocidos. La aprobación visual del usuario precede a nuevas integraciones; el cierre funcional requiere contratos verificados y pruebas reales.
