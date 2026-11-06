# 📖 Diccionario de Datos — Plataforma de Monitorías Académicas USB

Este documento describe la estructura formal, tipos de datos, restricciones de integridad referencial e índices del modelo relacional en **PostgreSQL**.

---

## 1. Tabla: `users`
Almacena los usuarios del sistema (Monitores, Coordinadores, Directores de Programa y Administradores).

| Campo | Tipo SQL | Nulo | Por Defecto | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | Clave primaria única. |
| `email` | `VARCHAR(255)` | No | - | Correo institucional único (`@unisimon.edu.co`). |
| `password_hash`| `VARCHAR(255)` | No | - | Hash seguro de la contraseña (bcrypt/argon2). |
| `full_name` | `VARCHAR(150)` | No | - | Nombres y apellidos completos. |
| `institutional_code`| `VARCHAR(50)` | No | - | Código estudiantil o docente USB. |
| `role` | `VARCHAR(30)` | No | `'MONITOR'` | Rol en el sistema: `MONITOR`, `COORDINADOR`, `DIRECTOR`, `ADMIN`. |
| `phone_number` | `VARCHAR(20)` | Sí | `NULL` | Teléfono de contacto. |
| `is_active` | `BOOLEAN` | No | `TRUE` | Estado de la cuenta. |
| `created_at` | `TIMESTAMP` | No | `NOW()` | Fecha de registro. |
| `updated_at` | `TIMESTAMP` | No | `NOW()` | Fecha de última actualización. |

* **Índices:**
  * `idx_users_email` (UNIQUE en `email`)
  * `idx_users_institutional_code` (UNIQUE en `institutional_code`)
  * `idx_users_role` (B-Tree en `role`)

---

## 2. Tabla: `academic_periods`
Representa los semestres académicos de la Universidad Simón Bolívar.

| Campo | Tipo SQL | Nulo | Por Defecto | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | Clave primaria. |
| `code` | `VARCHAR(20)` | No | - | Código semestral (Ej: `'2026-2'`). Único. |
| `name` | `VARCHAR(100)` | No | - | Nombre descriptivo (Ej: `'Periodo 2026 - Segundo Semestre'`). |
| `start_date` | `DATE` | No | - | Fecha de inicio del semestre. |
| `end_date` | `DATE` | No | - | Fecha de cierre del semestre. |
| `is_current` | `BOOLEAN` | No | `FALSE` | Bandera del periodo en curso. |

---

## 3. Tabla: `monitor_profiles`
Relaciona a un usuario con su rol activo de monitor para un periodo específico, permitiendo seguimiento de las **54 horas requeridas**.

| Campo | Tipo SQL | Nulo | Por Defecto | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | Clave primaria. |
| `user_id` | `UUID` | No | - | FK hacia `users(id)`. |
| `academic_period_id`| `UUID` | No | - | FK hacia `academic_periods(id)`. |
| `target_hours` | `DECIMAL(5,2)` | No | `54.00` | Meta de horas reglamentarias para el beneficio. |
| `status` | `VARCHAR(30)` | No | `'ACTIVO'` | Estado: `'ACTIVO'`, `'CUMPLIDO'`, `'INCOMPLETO'`. |
| `assigned_program` | `VARCHAR(100)`| No | - | Programa académico (Ej: `'Ingeniería de Sistemas'`). |

* **Restricciones:**
  * `UNIQUE(user_id, academic_period_id)`: Un usuario solo puede tener un perfil de monitor por periodo.

---

## 4. Tabla: `subjects`
Catálogo de asignaturas académicas adscritas al programa donde se prestan monitorías.

| Campo | Tipo SQL | Nulo | Por Defecto | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | Clave primaria. |
| `code` | `VARCHAR(30)` | No | - | Código institucional de la asignatura (Único). |
| `name` | `VARCHAR(150)` | No | - | Nombre de la asignatura (Ej: `'Bases de Datos I'`). |
| `program` | `VARCHAR(100)` | No | - | Programa académico al que pertenece. |

---

## 5. Tabla: `monitoring_sessions`
Registra cada sesión de monitoría impartida. Coincide con los campos solicitados en el SIA institucional y añade validaciones e integridad.

| Campo | Tipo SQL | Nulo | Por Defecto | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | Clave primaria. |
| `monitor_profile_id`| `UUID` | No | - | FK hacia `monitor_profiles(id)`. Aislamiento del monitor. |
| `academic_period_id`| `UUID` | No | - | FK hacia `academic_periods(id)`. |
| `subject_id` | `UUID` | No | - | FK hacia `subjects(id)`. |
| `session_date` | `DATE` | No | - | Fecha de la monitoría (`Fecha Inicio` del SIA). |
| `start_time` | `TIME` | No | - | Hora de inicio (`Hora Inicio` del SIA). |
| `end_time` | `TIME` | No | - | Hora de finalización (`Hora Fin` del SIA). |
| `calculated_hours` | `DECIMAL(5,2)` | No | - | Horas efectivas calculadas (Ej: `2.00`). |
| `session_type` | `VARCHAR(50)` | No | `'Presencial'`| Tipo: `'Presencial'`, `'Virtual'`, `'Taller'`, `'Asesoría'`. |
| `topic` | `VARCHAR(255)` | No | - | Tema desarrollado (`Tema` del SIA). |
| `recording_url` | `VARCHAR(500)` | Sí | `NULL` | Enlace a la grabación (`URL Grabación` del SIA). |
| `observation` | `TEXT` | No | - | Notas de la sesión (`Observación` del SIA). |
| `status` | `VARCHAR(30)` | No | `'PENDIENTE'` | `'PENDIENTE'`, `'APROBADO'`, `'OBSERVADO'`. |
| `coordinator_notes` | `TEXT` | Sí | `NULL` | Retroalimentación del docente coordinador. |
| `source` | `VARCHAR(30)` | No | `'DIRECT'` | Origen: `'DIRECT'` (plataforma) o `'SIA_IMPORT'`. |
| `import_hash` | `VARCHAR(64)` | Sí | `NULL` | Hash SHA-256 para evitar duplicados en importaciones. |
| `created_at` | `TIMESTAMP` | No | `NOW()` | Fecha y hora de creación. |
| `updated_at` | `TIMESTAMP` | No | `NOW()` | Fecha de última edición. |

* **Restricciones de Integridad (CHECK):**
  * `CHECK (end_time > start_time)`: Garantiza coherencia en la franja horaria.
  * `CHECK (calculated_hours > 0 AND calculated_hours <= 8.00)`: Limita sesiones anómalas mayores a 8h.
* **Índices:**
  * `idx_sessions_monitor_period` (`monitor_profile_id`, `academic_period_id`)
  * `idx_sessions_date` (`session_date`)
  * `idx_sessions_subject` (`subject_id`)
  * `idx_sessions_import_hash` (`import_hash`)

---

## 6. Tabla: `session_attendees`
Resuelve la falencia del formulario del SIA actual, permitiendo asociar de manera estructurada a los estudiantes atendidos en cada monitoría.

| Campo | Tipo SQL | Nulo | Por Defecto | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | Clave primaria. |
| `monitoring_session_id` | `UUID` | No | - | FK hacia `monitoring_sessions(id)` con `ON DELETE CASCADE`. |
| `student_id_card` | `VARCHAR(30)` | No | - | Número de documento / código estudiantil. |
| `student_name` | `VARCHAR(150)` | No | - | Nombre completo del estudiante asistente. |
| `student_email` | `VARCHAR(255)` | Sí | `NULL` | Correo electrónico del estudiante. |
| `career_program` | `VARCHAR(100)` | Sí | `NULL` | Programa académico del estudiante asistente. |

---

## 7. Tabla: `audit_logs`
Trazabilidad inmutable de cada acción sobre los registros (para cumplir los objetivos de auditoría y evitar alteración indebida de horas).

| Campo | Tipo SQL | Nulo | Por Defecto | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | Clave primaria. |
| `performed_by` | `UUID` | No | - | FK hacia `users(id)`. |
| `action` | `VARCHAR(50)` | No | - | Acción: `'SESSION_CREATED'`, `'SESSION_APPROVED'`, `'BULK_IMPORT'`, etc. |
| `entity_name` | `VARCHAR(50)` | No | - | Entidad afectada (ej: `'monitoring_sessions'`). |
| `entity_id` | `UUID` | Sí | `NULL` | ID del registro modificado. |
| `metadata` | `JSONB` | Sí | `NULL` | Valores anteriores y posteriores en formato JSON. |
| `created_at` | `TIMESTAMP` | No | `NOW()` | Momento exacto de la operación. |
