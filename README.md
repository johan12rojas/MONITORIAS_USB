# 🎓 Plataforma de Gestión y Seguimiento de Monitorías Académicas
### Universidad Simón Bolívar — Cúcuta | Proyecto de Grado - Ingeniería de Sistemas

[![Architecture](https://img.shields.io/badge/Architecture-Clean%20%2F%20Hexagonal-blue.svg)](#arquitectura-del-sistema)
[![Backend](https://img.shields.io/badge/Backend-NestJS%20%7C%20TypeScript-red.svg)](https://nestjs.com/)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2014%20%7C%20Tailwind-black.svg)](https://nextjs.org/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%7C%20Prisma-indigo.svg)](https://www.prisma.io/)

---

## 📌 Contexto del Problema y Justificación

En la **Universidad Simón Bolívar**, los monitores académicos deben completar **54 horas** de monitoría por semestre para obtener el beneficio económico/beca correspondiente.

### Estado Actual (SIA Institucional)
* **Plataforma de solo escritura (Write-Only):** El portal del SIA permite registrar la sesión (fecha, hora inicio, hora fin, asignatura, tema y observaciones), pero **no ofrece ninguna opción de consulta ni navegación**.
* **Falta de Trazabilidad:** El monitor no puede ver su historial ni sabe cuántas horas lleva acumuladas en tiempo real.
* **Carencia de Registro de Asistentes:** El formulario institucional no cuenta con campos estructurados para registrar los estudiantes atendidos (cédula, nombres, programa), perdiéndose la evidencia de impacto docente.
* **Sobrecarga Administrativa:** El director del programa debe consolidar manualmente archivos de Excel bajo solicitud, un proceso que puede demorar **semanas**.
* **Pérdida de Información:** Solo el 55% de los monitores cuenta actualmente con registros consolidados.

### Solución Propuesta
Una **plataforma web complementaria** construida bajo principios de **Clean Architecture (Arquitectura Limpia / Hexagonal)** que proporciona:
1. **Historial personal e interactivo** con motor de filtros multidimensionales para cada monitor.
2. **Cálculo automático e inmutable de horas** y visualización del avance hacia la meta de las 54 horas.
3. **Registro detallado de estudiantes asistentes** por sesión.
4. **Panel consolidado en tiempo real** para coordinadores y directores con métricas institucionales.
5. **Motor de ingesta masiva (Excel/CSV)** para procesar las exportaciones periódicas del SIA sin duplicados.
6. **Emisión de certificados y Paz y Salvo digital** en formato PDF con verificación por código QR.

---

## 🏛️ Arquitectura del Sistema (Clean Architecture / DDD)

El sistema se estructura en capas concéntricas desacopladas, siguiendo el principio de inversión de dependencias:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. PRESENTACIÓN (UI / Controllers / DTOs / Guards)                     │
│    - Endpoints REST documentados en Swagger                            │
│    - Frontend Next.js 14 + shadcn/ui                                   │
├────────────────────────────────────────────────────────────────────────┤
│ 2. APLICACIÓN (Casos de Uso / Interactors / Services)                  │
│    - RegisterMonitoringSessionUseCase                                  │
│    - GetMonitorProgressUseCase (Horas acumuladas vs 54h)               │
│    - GetMonitorHistoryUseCase (Filtros y paginación)                   │
│    - ImportSiaBatchUseCase (Ingesta masiva Excel)                      │
├────────────────────────────────────────────────────────────────────────┤
│ 3. DOMINIO (Entidades, Value Objects, Puertos e Invariantes)            │
│    - MonitoringSession, MonitorProfile, AcademicPeriod, Attendee       │
│    - Value Objects: SessionDuration (cálculo de horas), HourGoal (54h) │
│    - Interfaces: IMonitoringRepository, IAuditRepository               │
├────────────────────────────────────────────────────────────────────────┤
│ 4. INFRAESTRUCTURA (Adaptadores, Persistencia y Servicios Externos)    │
│    - Prisma ORM + PostgreSQL                                           │
│    - SiaExcelParserAdapter (Lectura y normalización de Excel/CSV)      │
│    - JwtTokenAdapter, PdfGeneratorAdapter                              │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 👥 Aislamiento y Control de Acceso (RBAC)

Para soportar a **múltiples monitores** de manera segura:
* **`MONITOR`**: Solo tiene acceso de lectura/escritura a sus propios registros. La persistencia inyecta automáticamente `WHERE monitor_profile_id = current_user.id`.
* **`COORDINADOR`**: Visualiza y filtra las sesiones de todos los monitores adscritos a su programa. Puede aprobar o solicitar correcciones.
* **`DIRECTOR`**: Accede a tableros ejecutivos macro y genera reportes institucionales.
* **`ADMIN`**: Gestiona periodos académicos, asignaturas y credenciales.

---

## 📂 Estructura del Repositorio

```text
MONITORIAS_USB/
├── docs/                               # Documentación formal de Tesis
│   ├── adr/                            # Architecture Decision Records (ADRs)
│   ├── data-dictionary.md              # Diccionario de Datos y Modelo ER
│   └── sprints-roadmap.md              # Desglose de los 3 Sprints de Scrum
├── backend/                            # API NestJS + TypeScript + Prisma
│   ├── src/
│   │   ├── modules/
│   │   │   ├── monitoring/             # Módulo de Dominio: Monitorías
│   │   │   │   ├── domain/             # Entidades, Value Objects y Puertos
│   │   │   │   ├── application/        # Casos de Uso y DTOs
│   │   │   │   └── infrastructure/     # Repositorios Prisma y Controllers
│   │   │   ├── identity/               # Módulo de Autenticación y RBAC
│   │   │   └── audit/                  # Módulo de Trazabilidad
│   │   └── prisma/
│   │       └── schema.prisma           # Esquema relacional PostgreSQL
├── frontend/                           # Aplicación Web Next.js 14 + Tailwind
└── README.md
```

---

## 🛠️ Pila Tecnológica

| Componente | Selección | Justificación |
| :--- | :--- | :--- |
| **Backend** | NestJS (TypeScript) | Soporte empresarial para Inyección de Dependencias, modularidad y Clean Architecture. |
| **Frontend** | Next.js 14 (App Router) + Tailwind CSS + shadcn/ui | Interfaz fluida, SSR/SSG, componentes de alta usabilidad y accesibilidad. |
| **Base de Datos** | PostgreSQL (Neon / Supabase) | Integridad relacional, ACID, constraints temporales e indexación B-Tree. |
| **ORM** | Prisma ORM | Modelado declarativo, tipado estático end-to-end y control de migraciones. |
| **Seguridad** | JWT + Refresh Tokens + RBAC | Control de sesiones seguras y aislamiento por monitor. |

---

## 📋 Documentación de Referencia

* [Diccionario de Datos y Modelo ER](docs/data-dictionary.md)
* [Cronograma y Desglose de Sprints](docs/sprints-roadmap.md)
* [ADR 0001: Clean Architecture](docs/adr/0001-clean-architecture.md)
* [ADR 0002: Aislamiento Multi-Monitor y RBAC](docs/adr/0002-multi-monitor-isolation.md)
* [ADR 0003: Estrategia de Ingesta SIA](docs/adr/0003-hybrid-integration-sia.md)
