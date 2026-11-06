# ADR 0006: Rediseño Institucional Anti-IA, Módulo de Calendario y Reglas de Cómputo de Asistencia

## Estado
**Aceptado** (Fecha: 2026-11-06)

## Contexto
1. **Identidad Visual y Experiencia de Usuario**:
   - Las iteraciones preliminares recurrieron a patrones estéticos comúnmente asociados a prototipos generados por IA (tarjetas con fondos pastel verde/amarillo/rojo, bordes excesivamente redondeados `rounded-3xl`, y tipografía genérica SaaS como *Plus Jakarta Sans*).
   - Los usuarios del portal de la Universidad Simón Bolívar (SIA / Intranet) están habituados a la tipografía corporativa institucional (**Segoe UI**, estándar en Microsoft Office 365 y portales universitarios), tablas de datos con bordes precisos, indicadores sobrios y paleta de colores institucional en verde USB (`#007336`).
2. **Programación y Cierre de Monitorías en Calendario**:
   - Los monitores planifican sus jornadas con días de antelación. Requerir que el monitor vuelva a llenar manualmente todos los campos (fecha, hora inicio, hora fin, asignatura, lugar, tema) al concluir la sesión genera fricción y duplicidad.
   - Es necesario un calendario mensual interactivo donde agendar la sesión con antelación (`PROGRAMADA`) y, llegado el día, realizar un **Check-in o Validación en un solo clic**, adjuntando de forma opcional una evidencia fotográfica (tablero, aula o captura de Teams).
3. **Reglas de Negocio Institucionales sobre Asistencia y Cómputo de Horas**:
   - **Caso 1: Monitor presente con estudiantes.** Se convalida la totalidad de horas efectivas desarrolladas (ej: +2.0h).
   - **Caso 2: Monitor presente, pero ningún estudiante asistió (Sin Quórum).** **SÍ SUMA HORAS** al monitor reglamentariamente, dado que el monitor cumplió su turno institucional de guardia y disponibilidad en el espacio asignado.
   - **Caso 3: Monitor ausente o cancelada por el monitor.** **NO SUMA HORAS** (0.0h computadas).

---

## Decisiones de Arquitectura y Diseño

### 1. Sustitución Tipográfica y Diseño Institucional Oficial
- **Tipografía**: Se migró a la pila del sistema universitario oficial:
  ```css
  font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Open Sans', 'Helvetica Neue', Arial, sans-serif;
  ```
- **Diseño de Paneles y Métricas (Anti-IA)**:
  - Se eliminaron los fondos pastel (`bg-emerald-50`, `bg-amber-50`, `bg-rose-50`) en las tarjetas macro de conciliación.
  - Se implementaron tarjetas blancas sobrias con borde estándar (`border-slate-300`) y franjas laterales de color sólido de 4px (`border-l-4 border-l-[#007336]` para registros coincidentes, ámbar para diferencias, y carmín para faltantes en sábana).
  - Los radios de curvatura se normalizaron a `rounded-md` y `rounded` corporativos.

### 2. Módulo de Calendario y Agenda del Monitor
- Se incorporó la navegación por pestañas en el perfil del monitor:
  - 📋 **Historial y Registro de Monitorías** (vista tabular tradicional homologada con SIA).
  - 📅 **Calendario y Programación de Sesiones** (grilla mensual interactiva de Lunes a Domingo).
- El calendario muestra los eventos agendados y su estado mediante etiquetas compactas:
  - 🔵 Azul: Sesión Programada (esperando fecha de ejecución).
  - 🟢 Verde: Sesión Cumplida con Estudiantes (horas efectivas sumadas).
  - 🟡 Ámbar: Sesión Cumplida Sin Alumnos (horas sumadas por guardia).
  - 🔴 Rojo: Inasistencia del Monitor (0 horas computadas).

### 3. Flujo de Ejecución Rápida (Check-in de Sesión)
- Al pulsar **"Validar / Registrar Ejecución"** en una monitoría agendada:
  1. Se despliega un modal con los datos precargados (asignatura, horario, aula, tema).
  2. El monitor selecciona el resultado de la sesión mediante tres opciones excluyentes:
     - *Sesión Realizada con Asistencia*: Suma horas y permite asociar lista de asistentes F066.
     - *Monitor Asistió Sin Quórum de Alumnos*: Suma horas completas con justificación de guardia.
     - *Inasistencia del Monitor*: Registra 0 horas y marca inasistencia.
  3. Carga opcional de fotografía de evidencia (con previsualización inmediata en base64 / blob).
  4. Al confirmar, la sesión pasa inmediatamente al historial y se suma en tiempo real al computador de 54 horas.

---

## Consecuencias
- ✅ **Alineación con el Portal Institucional**: La interfaz refleja el estándar visual del Sistema Académico de la Universidad Simón Bolívar.
- ✅ **Cero Redundancia de Entrada de Datos**: Los monitores programan una vez y validan con un clic al finalizar su turno.
- ✅ **Seguridad Jurídica y Académica**: Se contempla con precisión la regla de disponibilidad del monitor frente a la eventual inasistencia estudiantil.
