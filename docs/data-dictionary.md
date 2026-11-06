# 📖 Diccionario de Datos — Plataforma de Monitorías Académicas USB

Este documento describe la estructura formal, tipos de datos, restricciones de integridad referencial e índices del modelo relacional en **PostgreSQL**, homologado con el **SIA Institucional** y el **Formato Físico PIM-D (PM-DO-PEG-F066)**.

---

## 1. Tabla: `users`
Almacena los usuarios del sistema (Monitores, Coordinadores PIM-D, Directores de Programa y Administradores).

| Campo | Tipo SQL | Nulo | Por Defecto | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | Clave primaria única. |
| `email` | `VARCHAR(255)` | No | - | Correo institucional único (`@unisimon.edu.co`). |
| `password_hash`| `VARCHAR(255)` | No | - | Hash seguro de la contraseña (bcrypt/argon2). |
| `full_name` | `VARCHAR(150)` | No | - | Nombres y apellidos completos. |
| `institutional_code`| `VARCHAR(50)` | No | - | Código estudiantil o docente USB (ej: `MONITOR18`). |
| `role` | `VARCHAR(30)` | No | `'MONITOR'` | Rol en el sistema: `MONITOR`, `COORDINADOR`, `DIRECTOR`, `ADMIN`. |
| `phone_number` | `VARCHAR(20)` | Sí | `NULL` | Teléfono de contacto. |
| `is_active` | `BOOLEAN` | No | `TRUE` | Estado de la cuenta. |
| `created_at` | `TIMESTAMP` | No | `NOW()` | Fecha de registro. |
| `updated_at` | `TIMESTAMP` | No | `NOW()` | Fecha de última actualización. |

---

## 2. Tabla: `academic_periods`
Semestres académicos de la Universidad Simón Bolívar.

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
Relaciona a un usuario con su beneficio activo de monitoría y seguimiento de las **54 horas requeridas**.

| Campo | Tipo SQL | Nulo | Por Defecto | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | Clave primaria. |
| `user_id` | `UUID` | No | - | FK hacia `users(id)`. |
| `academic_period_id`| `UUID` | No | - | FK hacia `academic_periods(id)`. |
| `target_hours` | `DECIMAL(5,2)` | No | `54.00` | Meta de horas reglamentarias para el beneficio. |
| `status` | `VARCHAR(30)` | No | `'ACTIVO'` | Estado: `'ACTIVO'`, `'CUMPLIDO'`, `'INCOMPLETO'`. |
| `assigned_program` | `VARCHAR(100)`| No | - | Programa académico (Ej: `'Ingeniería de Sistemas'`). |

---

## 4. Tabla: `subjects`
Catálogo de asignaturas donde se prestan las monitorías académicas.

| Campo | Tipo SQL | Nulo | Por Defecto | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | Clave primaria. |
| `code` | `VARCHAR(30)` | No | - | Código institucional de la asignatura (Único). |
| `name` | `VARCHAR(150)` | No | - | Nombre de la asignatura (`CURSO` en F066). |
| `program` | `VARCHAR(100)` | No | - | Programa académico al que pertenece. |

---

## 5. Tabla: `monitoring_sessions`
Registra cada sesión impartida. Homologada tanto con el **SIA** como con el encabezado de sesión del **Formato Físico PIM-D (PM-DO-PEG-F066)**.

| Campo | Tipo SQL | Nulo | Por Defecto | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | Clave primaria. |
| `monitor_profile_id`| `UUID` | No | - | FK hacia `monitor_profiles(id)`. Aislamiento del monitor. |
| `academic_period_id`| `UUID` | No | - | FK hacia `academic_periods(id)`. |
| `subject_id` | `UUID` | No | - | FK hacia `subjects(id)` (`CURSO` en F066). |
| `session_date` | `DATE` | No | - | Fecha de la monitoría (`FECHA` en F066). |
| `start_time` | `TIME` | No | - | Hora de inicio (`HORA DE INICIO` en F066). |
| `end_time` | `TIME` | No | - | Hora de fin (`HORA FINAL` en F066). |
| `calculated_hours` | `DECIMAL(5,2)` | No | - | Horas efectivas computadas. |
| `session_type` | `VARCHAR(50)` | No | `'Presencial'`| Tipo: `'Presencial'`, `'Virtual'`, `'Taller'`, `'Asesoría'`. |
| `location` | `VARCHAR(150)` | No | `'Campus USB'`| **`LUGAR DE LA MONITORIA` en F066** (ej: Sala 3, Biblioteca). |
| `topic` | `VARCHAR(255)` | No | - | Tema desarrollado (`Tema` en el SIA). |
| `recordingUrl` | `VARCHAR(500)` | Sí | `NULL` | Enlace a grabación en Teams (si fue virtual). |
| `observation` | `TEXT` | No | - | Notas y observaciones de la monitoría. |
| `status` | `VARCHAR(30)` | No | `'PENDIENTE'` | `'PENDIENTE'`, `'APROBADO'`, `'OBSERVADO'`. |
| `source` | `VARCHAR(30)` | No | `'DIRECT'` | Origen: `'DIRECT'` (plataforma) o `'SIA_IMPORT'`. |
| `import_hash` | `VARCHAR(64)` | Sí | `NULL` | Hash SHA-256 para evitar duplicidad de registros. |
| `created_at` | `TIMESTAMP` | No | `NOW()` | Fecha de creación. |

---

## 6. Tabla: `session_attendees`
**Mapeo 1:1 con las columnas de estudiantes del Formato Físico PIM-D (`PM-DO-PEG-F066`):**

| Campo | Tipo SQL | Nulo | Por Defecto | Descripción en Formato F066 |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | Clave primaria. |
| `monitoring_session_id` | `UUID` | No | - | FK hacia `monitoring_sessions(id)`. |
| `student_code` | `VARCHAR(30)` | Sí | `NULL` | **`CÓDIGO DEL ESTUDIANTE`** |
| `student_name` | `VARCHAR(150)` | No | - | **`NOMBRES Y APELLIDOS`** |
| `document_type`| `VARCHAR(10)` | No | `'CC'` | **`TIPO DE DOCUMENTO (CC, TI, CE)`** |
| `document_number`| `VARCHAR(30)` | No | - | **`NÚMERO DE DOCUMENTO`** |
| `referral_type`| `VARCHAR(5)` | No | `'V'` | **`REMITIDO (R) O VOLUNTARIA (V)`** |
| `student_email` | `VARCHAR(255)` | Sí | `NULL` | Correo de contacto del estudiante. |
| `career_program` | `VARCHAR(100)` | Sí | `NULL` | Programa académico del estudiante. |

---

## 7. Tabla: `audit_logs`
Registro inmutable de auditoría para garantizar transparencia institucional.

| Campo | Tipo SQL | Nulo | Por Defecto | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | Clave primaria. |
| `performed_by` | `UUID` | No | - | FK hacia `users(id)`. |
| `action` | `VARCHAR(50)` | No | - | `'SESSION_CREATED'`, `'SESSION_APPROVED'`, `'BULK_IMPORT'`. |
| `entity_name` | `VARCHAR(50)` | No | - | Entidad afectada (`monitoring_sessions`). |
| `metadata` | `JSONB` | Sí | `NULL` | Datos modificados. |
| `created_at` | `TIMESTAMP` | No | `NOW()` | Marca de tiempo. |
