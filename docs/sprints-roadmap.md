# 🗓️ Plan de Sprints y Matriz de Tareas (3 Sprints - Scrum)

Plan detallado para el desarrollo de la Plataforma de Monitorías Académicas de la Universidad Simón Bolívar.

---

## Resumen de Sprints

| Sprint | Semanas | Enfoque Principal | Entregable Clave |
| :---: | :---: | :--- | :--- |
| **Sprint 1** | 1 - 4 | Núcleo Backend: Arquitectura Limpia, Dominio, Seguridad (RBAC) y Casos de Uso del Monitor | Esquema PostgreSQL migrado con Prisma, Core Domain en TypeScript, JWT + Guards, seed de los 20 monitores y API de registro, historial filtrable y cálculo de horas. |
| **Sprint 2** | 5 - 8 | Ingesta SIA y Frontend (Portal del Monitor y Panel de Coordinación) | Parser Excel idempotente con hash anti-duplicados, portal web en Next.js con indicador de 54h y vista consolidada de los 20 monitores con métricas. |
| **Sprint 3** | 9 - 12 | Certificados PDF, Auditoría, Deploy Cloud, Piloto y Tesis | Generador de PDF oficial con QR, exportación a Excel directivo, despliegue en producción HTTPS y validación experimental del piloto. |

---

## Detalle Sprint por Sprint

### Sprint 1: Núcleo Backend — Arquitectura, Dominio, Seguridad y Casos de Uso del Monitor

> **Objetivo del Sprint:** Disponer de una API segura y funcional en la que cada monitor pueda registrar sus sesiones, consultar su historial filtrado y conocer su avance hacia las 54 horas.

#### Arquitectura Limpia, Dominio y Persistencia
* **HU-1.1:** Inicializar la estructura de capas del backend (`domain/`, `application/`, `infrastructure/`, `presentation/`).
* **HU-1.2:** Crear la entidad `MonitoringSession` con métodos de validación de negocio.
* **HU-1.3:** Crear el Value Object `SessionDuration`:
  * *Criterio de Aceptación:* Si `hora_fin <= hora_inicio`, debe lanzar `InvalidSessionTimeException`. Si la duración excede 8 horas, debe lanzar advertencia.
* **HU-1.4:** Crear el Value Object `HourGoal`:
  * *Criterio de Aceptación:* Recibe 54 horas fijas; expone métodos `calculateRemaining(currentHours)` y `calculatePercentage(currentHours)`.
* **HU-1.5:** Diseñar el archivo `schema.prisma` y generar las migraciones en PostgreSQL.

#### Autenticación, RBAC y Aislamiento de Datos
* **HU-1.6:** Implementar el módulo `Identity` con login de usuario y verificación de contraseña segura con `bcrypt`.
* **HU-1.7:** Generar tokens JWT firmados con expiración corta (15 min) y Refresh Tokens (7 días).
* **HU-1.8:** Crear el Guard `@Roles('MONITOR')` y el decorador `@CurrentUser()`.
* **HU-1.9:** Crear un seeder con los datos de 20 monitores, las materias y el semestre activo.
* **HU-1.10:** *Prueba de Aceptación:* Un usuario autenticado con rol `MONITOR` no puede acceder a las rutas de `/api/v1/coordination`.

#### Casos de Uso del Monitor e Historial Filtrable
* **HU-1.11:** Caso de uso `RegisterMonitoringSessionUseCase`: Recibe DTO con fecha, hora inicio, hora fin, asignatura, modalidad, tema, URL y observaciones.
* **HU-1.12:** Soporte para registro de la lista de asistentes (`SessionAttendee[]`) vinculados a la sesión.
* **HU-1.13:** Caso de uso `GetMonitorHistoryUseCase`:
  * Soporta parámetros de consulta: `subjectId`, `startDate`, `endDate`, `sessionType`, `status`, `searchTerm`, `page`, `limit`.
  * *Criterio de Aceptación:* El repositorio aplica incondicionalmente el filtro de `monitorProfileId` del usuario solicitante.
* **HU-1.14:** Caso de uso `GetMonitorProgressUseCase`: Retorna `{ targetHours: 54, accumulatedHours: number, remainingHours: number, percentage: number, status: string }`.

---

### Sprint 2: Ingesta SIA y Frontend — Portal del Monitor y Panel de Coordinación

> **Objetivo del Sprint:** Cargar de forma masiva y sin duplicados la información exportada del SIA y ofrecer las interfaces web para monitores y coordinadores.

#### Motor de Ingesta Masiva y Parser SIA (Excel/CSV)
* **HU-2.1:** Adaptador `SiaExcelParserAdapter` usando librerías de streaming (`exceljs` o `xlsx`).
* **HU-2.2:** Mapeo flexible de encabezados: reconoce variaciones como `"Hora Inicio"`, `"H. Inicio"`, `"HORA_INICIO"`.
* **HU-2.3:** Cálculo de hash SHA-256 por registro para garantizar idempotencia.
* **HU-2.4:** Endpoint `POST /api/v1/import/sia` que retorna el reporte de filas procesadas, ignoradas por duplicidad y errores.

#### Frontend Web - Portal del Monitor y Dashboard Visual
* **HU-2.5:** Crear la página de Dashboard del Monitor (`/monitor/dashboard`):
  * Gráfico de progreso radial o barra de avance hacia las 54h.
  * Tarjetas de resumen (Horas aprobadas, pendientes, alumnos atendidos).
* **HU-2.6:** Crear la página de Historial (`/monitor/history`):
  * Tabla con ordenamiento por fecha y horas.
  * Componentes de filtro: Select de asignatura, selector de rango de fechas, barra de búsqueda reactiva.
  * Modal de detalle para visualizar las observaciones y los estudiantes que asistieron.
* **HU-2.7:** Formulario de Registro rápido (`/monitor/new-session`) con validación Zod y sugerencias automáticas.

#### Panel de Coordinación, Aprobación y Métricas
* **HU-2.8:** Vista general de Coordinación (`/coordination/overview`):
  * Tabla de los 20 monitores con barra de avance individual.
  * Semáforo de estado: Verde (>= 54h o al día), Amarillo (ritmo medio), Rojo (retraso crítico).
* **HU-2.9:** Vista de detalle del monitor para el docente coordinador:
  * Historial completo del monitor auditado.
  * Botones de acción: *"Aprobar sesión"* o *"Solicitar corrección"* con nota explicativa.
* **HU-2.10:** Tablero estadístico con gráficos de barras y torta (materias más solicitadas, distribución horaria).

---

### Sprint 3: Certificados PDF, Auditoría, Deploy Cloud, Piloto y Tesis

> **Objetivo del Sprint:** Emitir documentos oficiales verificables, garantizar la trazabilidad, poner la plataforma en producción y validarla con los monitores reales.

#### Certificados PDF (Paz y Salvo) y Auditoría
* **HU-3.1:** Generación en el servidor de PDF de **Paz y Salvo de Monitorías**:
  * Incluye escudo de la Universidad Simón Bolívar, datos del estudiante, 54 horas certificadas y fecha.
  * Incluye código QR que enlaza a una URL de verificación pública institucional.
* **HU-3.2:** Exportación a Excel para el Director de Programa con el formato requerido por la Dirección de Docencia.
* **HU-3.3:** Registro inmutable en tabla `AuditLog` ante cualquier alteración de registros o estados.

#### Piloto con Monitores, Deploy Cloud y Tesis
* **HU-3.4:** Configuración de CI/CD en GitHub Actions y despliegue en Vercel (Front) y Render/Railway (Back) con PostgreSQL en la nube.
* **HU-3.5:** Prueba Piloto controlada con los 20 monitores identificados en el documento.
* **HU-3.6:** Medición de impacto: Reducción del tiempo de consulta de 2 semanas a menos de 5 segundos.
* **HU-3.7:** Redacción de la memoria técnica de grado y diapositivas de sustentación.
