# Arquitectura frontend

## Referencias
IS_26 describe arquitectura web cliente-servidor, frontend Nuxt, API REST, NestJS y PostgreSQL. El AGENTS del backend delimita permisos y responsabilidades. El instructivo académico orienta la evidencia técnica, no impone estructura de carpetas de Nuxt.

## Organización orientativa, sujeta a la versión real de Nuxt
```text
app/ o raíz de Nuxt
  pages/                 # pantallas por módulo
  layouts/               # layout autenticado y público
  components/            # compartidos y específicos
  composables/           # llamadas API y estado
  middleware/            # sesión y navegación
  types/                 # tipos según respuestas reales
  assets/                # estilos y tipografías ya existentes
public/
  referencias/           # capturas de referencia
docs/
```

## Criterios
- Separar interfaces de negocio de los clientes HTTP.
- Centralizar manejo de 401, 403, validación y errores.
- No duplicar reglas del backend.
- Componentes oficiales Nuxt UI; TypeScript tipado.
- No asumir que el prefijo global HTTP es `/api` sin verificar.
- La interfaz de Gestión de Auxiliares y Gestión Documental puede tener carpetas de componentes separadas, compartiendo componentes de tareas y documentos cuando proceda.
- Priorizar rutas reales y flujos documentados sobre scaffolding excesivo.
