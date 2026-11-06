# ADR 0003: Estrategia de Integración Híbrida con el Portal SIA Institucional

## Estado
Aceptado

## Contexto
El portal institucional del SIA (Sistema de Información Académico) es el canal formal de registro obligatorio de la Universidad Simón Bolívar. Dicho sistema no expone APIs públicas REST/GraphQL para interoperar y actualmente es una plataforma "write-only" que no provee interfaz de lectura a los monitores. La solución desarrollada no debe entrar en conflicto con la normativa institucional ni requerir permisos especiales de modificación sobre la infraestructura central de la universidad para poder entrar en operación como MVP.

## Decisión
Se define un modelo de **Integración Progresiva No Invasiva**:

1. **Adaptador de Ingesta Masiva (Bulk Parser de Sábanas SIA):**
   * El sistema incluye un servicio capaz de parsear las exportaciones de Excel/CSV generadas periódicamente por la universidad.
   * Valida columnas: `Fecha Inicio`, `Hora Inicio`, `Hora Fin`, `Tipo`, `Asignatura`, `Tema`, `URL Grabación`, `Observación`.
   * Calcula un hash SHA-256 por cada registro (`SHA256(monitor_codigo + fecha + hora_inicio)`) para garantizar **idempotencia**: subir el archivo varias veces jamás duplica registros ni altera el conteo de horas acumuladas.
2. **Registro Complementario en Tiempo Real:**
   * La plataforma permite el registro directo por parte de los monitores con cálculo instantáneo de horas y registro de estudiantes atendidos.
   * La interfaz ofrece la función *"Exportar fila formato SIA"*, permitiendo al monitor copiar o migrar sus datos hacia el SIA oficial de forma ágil mientras se consolida la plataforma.

## Consecuencias
* El proyecto puede desplegarse y utilizarse de inmediato sin esperar autorizaciones burocráticas del departamento de TI central.
* Proporciona un canal robusto para absorber el histórico de las monitorías del semestre en segundos.
