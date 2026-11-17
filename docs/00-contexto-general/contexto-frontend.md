# Contexto del frontend — GESTIÓN H3GA

## Fuentes
- Oficial: `IS_26_CHAN_MARTIN_LUIS_GAEL_DESARROLLO_SISTEMA_GESTION.pdf` (objetivos, RF, RNF, matriz de roles, arquitectura y diccionario).
- Apoyo: `Diccionario de datos (1).md`, **solo su parte operativa de Gestión**.
- Académica: `Instructivo_Memoria_Unificado_V5.1.pdf` para coherencia de memoria y evidencias.
- Técnica: `AGENTS.md` vigente del backend, `jwt-auth.guard.ts`, `roles.decorator.ts`, `clientes.controller.ts`.

## Objetivo
Interfaz web de GESTIÓN H3GA para centralizar información y expedientes de clientes, modalidades de pensión, seguimiento de trámites, agenda, formatos, servicios complementarios y coordinación operativa.

## Perfiles (IS_26, matriz de roles, pp. 49–50)
- **Asesor:** registra clientes, administra expedientes, diagnósticos, correcciones, etapas y agenda; solicita documentos al auxiliar y revisa sus entregas.
- **Auxiliar administrativo:** apoya en documentos y agenda; elabora y corrige archivos solicitados; solo elimina archivos propios.
- **Supervisor operativo:** supervisa avances, consulta documentos, reportes y agenda; no se deben inferir permisos operativos adicionales.
- En backend el rol supervisor se identifica como `administrador` según el AGENTS vigente.

## Requerimientos
La tabla oficial RF-01–RF-39 y RNF-01–RNF-05 está transcrita en `requerimientos-funcionales-referencia.md`. No adoptar RF-40 en adelante sin actualizar formalmente la fuente oficial.

## Límites
La sección H3GA Finanzas del diccionario auxiliar **no forma parte del desarrollo de interfaces de escritura de Gestión**. La memoria contiene un modelo de datos amplio; una tabla existente en el diccionario no implica que su API esté desarrollada.

## Diferencias documentales
El PDF conserva denominaciones históricas del sistema; en el frontend usar **GESTIÓN H3GA** por instrucción actual del proyecto, sin alterar los archivos fuente académicos.
