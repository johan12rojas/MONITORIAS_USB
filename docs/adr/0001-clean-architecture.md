# ADR 0001: Adopción de Clean Architecture (Arquitectura Limpia / Hexagonal)

## Estado
Aceptado

## Contexto
El sistema de gestión y seguimiento de monitorías de la Universidad Simón Bolívar es un proyecto final de carrera en Ingeniería de Sistemas. Comúnmente, los desarrollos universitarios caen en arquitecturas monolíticas desestructuradas (patrón MVC simple con lógica de negocio incrustada en controladores de frameworks web como Express o Next.js API Routes). Esto ocasiona alto acoplamiento a las librerías, dificultades severas para ejecutar pruebas unitarias automatizadas y fragilidad ante cambios en los requerimientos o en los proveedores de datos (como el SIA institucional).

## Decisión
Se adopta **Clean Architecture (Arquitectura Hexagonal / Puertos y Adaptadores)** orientada al dominio (Domain-Driven Design - DDD) para el desarrollo del backend.

La arquitectura se divide en cuatro capas estrictas con la regla de dependencia apuntando hacia el interior:
1. **Capa de Dominio (`domain/`):**
   * Contiene las Entidades (`MonitoringSession`, `MonitorProfile`), Value Objects (`SessionDuration`, `HourGoal`), Excepciones de Dominio y Puertos (interfaces de repositorios).
   * No tiene dependencias de ningún framework, ORM ni base de datos.
2. **Capa de Aplicación (`application/`):**
   * Orquesta los Casos de Uso (`RegisterMonitoringSessionUseCase`, `GetMonitorProgressUseCase`, `GetMonitorHistoryUseCase`).
   * Maneja DTOs de entrada/salida y coordina los puertos de dominio.
3. **Capa de Infraestructura (`infrastructure/`):**
   * Implementa los puertos: repositorios con Prisma ORM, lectores de Excel/CSV (`SiaExcelParserAdapter`), generadores de PDF y servicios de correo/token.
4. **Capa de Presentación (`presentation/`):**
   * Controladores HTTP de NestJS, serializadores, validadores con class-validator/Zod y filtros de excepciones globales.

## Consecuencias
### Positivas
* **Testeabilidad:** El cálculo de las 54 horas y las validaciones de sesiones pueden probarse unitariamente en milisegundos sin levantar bases de datos ni servidores.
* **Independencia Tecnológica:** Si el motor de base de datos cambia de PostgreSQL a otro motor, solo se modifica el adaptador de repositorio sin tocar la lógica de negocio.
* **Rigor Académico:** Cumple con los más altos estándares de ingeniería de software para la sustentación de grado.

### Negativas / Mitigaciones
* Mayor cantidad de archivos y clases (interfaces, DTOs, mappers). Se mitiga mediante convenciones de nombres claras y plantillas de código reutilizables.
