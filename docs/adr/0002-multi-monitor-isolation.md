# ADR 0002: Modelo de Aislamiento de Datos Multi-Monitor y RBAC

## Estado
Aceptado

## Contexto
En la Universidad Simón Bolívar operan más de 20 monitores simultáneamente por periodo académico. El sistema debe permitir que cada monitor registre, consulte y filtre exclusivamente sus propias monitorías y consulte su progreso individual hacia las 54 horas. Al mismo tiempo, los Coordinadores y el Director de Programa deben tener visión agregada y capacidad de filtrado sobre todos los monitores. Una fuga de información entre monitores violaría la privacidad estudiantil y la integridad del proceso de asignación de becas/beneficios.

## Decisión
Se implementa una estrategia de **Aislamiento a Nivel de Repositorio (Tenant Scoping por Monitor)** combinada con **Control de Acceso Basado en Roles (RBAC)**:

1. **Tokens JWT con Contexto Completo:**
   * Al autenticarse, el token firma el `userId`, el rol (`MONITOR`, `COORDINADOR`, `DIRECTOR`) y el `monitorProfileId` activo para el periodo.
2. **Inyección de Identidad Segura:**
   * El controlador extrae el `monitorProfileId` del token validado por el guard criptográfico y lo entrega al caso de uso. El cliente jamás puede enviar un `monitor_id` arbitrario en el body o query params para consultar datos de otro usuario.
3. **Filtro Forzoso en Persistencia:**
   * Las consultas de repositorio para el rol `MONITOR` añaden incondicionalmente la cláusula `WHERE monitor_profile_id = :id`.
4. **Roles Superiores:**
   * Para los roles `COORDINADOR` y `DIRECTOR`, la cláusula `monitor_profile_id` es opcional, habilitando el filtrado multidimensional entre uno o todos los monitores.

## Consecuencias
* Se erradican vulnerabilidades de Insecure Direct Object References (IDOR).
* Cada monitor cuenta con una experiencia personalizada y un historial limpio y filtrable.
* Facilita la auditoría al vincular de forma estricta cada sesión con la firma digital del monitor que la reportó.
