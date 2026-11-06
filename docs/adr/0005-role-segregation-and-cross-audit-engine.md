# ADR 0005: Segregación de Roles (RBAC), Portal de Autenticación y Motor de Auditoría Cruzada de Horas

## Estado
**Aceptado** (Fecha: 2026-11-06)

## Contexto
En el flujo operativo del Programa Institucional Monitores para la Docencia (PIM-D) de la Universidad Simón Bolívar:
1. **Monitores Académicos**: Requieren un espacio dedicado donde registrar sus monitorías académicas conforme al formulario SIA y la planilla física `PM-DO-PEG-F066`, filtrando exclusivamente sus propias sesiones y vigilando su avance en tiempo real hacia las 54 horas reglamentarias para su beneficio de matrícula.
2. **Director de Programa / Coordinadores**: Necesitan supervisar de forma integral a todos los monitores (20 monitores registrados en el periodo), observando barras de avance comparativo hacia las 54h, contrastando los registros individuales contra el Excel general consolidado del maestro (cruce de horas), y contando con herramientas administrativas de gestión (CRUD de usuarios, conmutación de roles y activación/desactivación).
3. **Seguridad y Confidencialidad**: El panel administrativo de roles y permisos no debe estar expuesto a la vista de los estudiantes ni monitores. El acceso debe estar gobernado por un portal de autenticación diferenciado.

## Decisiones de Diseño

### 1. Portal de Login y Roles (RBAC)
Se implementa un portal de autenticación institucional en dos niveles:
- **Rol MONITOR**:
  - Credenciales de prueba: Usuario `MONITOR18` / Clave `admin` (o correo `j_rojas20`).
  - Acceso restringido a:
    - Indicador visual de 54 horas reglamentarias (acumuladas vs restantes).
    - Registro de monitorías homologado con SIA y asistentes PIM-D.
    - Historial individual con filtros por tema, asignatura, modalidad y estado.
    - Exportación e impresión del formato oficial `PM-DO-PEG-F066`.
    - Generación del certificado de Paz y Salvo académico.
- **Rol DIRECTOR / ADMIN**:
  - Credenciales de prueba: Usuario `Admin` / Clave `admin`.
  - Acceso protegido a tres módulos estratégicos:
    1. **Matriz de Progreso de Monitores**: Visualización en tiempo real del progreso de cada uno de los 20 monitores hacia la meta de 54h, estadísticas de estudiantes atendidos y estado de cumplimiento.
    2. **Auditoría Cruzada (Excel Maestro)**: Carga del archivo Excel general del director, cálculo automático del delta de horas ($\Delta = \text{Horas Plataforma} - \text{Horas Excel}$) y conciliación de discrepancias.
    3. **Panel CRUD de Usuarios y Roles**: Modificación de roles (`MONITOR`, `COORDINADOR`, `DIRECTOR`, `ADMIN`), asignación de metas personalizadas de horas, activación o desactivación de accesos, y consulta de la bitácora de auditoría histórica.

### 2. Motor de Reconciliación Cruzada de Horas
Para resolver la problemática histórica donde los monitores reportan horas en físico y los directores reciben reportes fragmentados, el motor de auditoría ejecuta las siguientes reglas:
- Si $\Delta = 0$: Estado **Conciliado** (ambos reportes coinciden con precisión horaria).
- Si $\Delta > 0$: Alerta de **Horas excedentes en plataforma** (requiere validación de soporte o firma física).
- Si $\Delta < 0$: Alerta de **Horas pendientes de reporte** por parte del monitor.
- Si no existe en la sábana general: Estado **Sin Registro en Excel**.

### 3. Identidad Gráfica Institucional en Alta Definición
- **Universidad Simón Bolívar**: Se incorpora el isotipo oficial vectorizado y rasterizado de alta calidad (`logo-unisimon.png`).
- **PIM-D (Programa Institucional Monitores para la Docencia)**: Se reconstruyó en SVG vectorial puro (`logo-pimd.svg`) con los 5 puntos característicos en sus colores institucionales exactos, la tipografía seminegrita y el contraste de colores marino (`#152B52`) y rojo (`#D90429`), garantizando escalabilidad infinita e impresión nítida en planillas físicas.

## Consecuencias
- ✅ **Aislamiento de Privilegios**: Los monitores no tienen visibilidad ni acceso a las opciones directivas ni a la información confidencial de otros monitores.
- ✅ **Visibilidad Directiva sin Complejidad**: El director mantiene a la mano la matriz visual de progreso de horas de todos los estudiantes.
- ✅ **Trazabilidad Total**: Toda modificación de rol o estado queda registrada en el registro de auditoría (`audit_logs`).
