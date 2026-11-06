# ADR 0004: Integración del Formato Oficial PIM-D (PM-DO-PEG-F066)

## Estado
Aceptado

## Contexto
En la Universidad Simón Bolívar (Sede Cúcuta), el Departamento de Pedagogía coordina el **Programa Institucional Monitores para la Docencia (PIM-D)**. Para legalizar las horas de monitoría y acceder al beneficio económico, los monitores no solo deben registrar sus actividades en el SIA digital, sino que están obligados a diligenciar y firmar una planilla física denominada:
* **Código:** `PM-DO-PEG-F066`
* **Nombre:** *Reporte de Monitorías Académicas*
* **Versión:** 1.0

Dicha planilla física contiene 12 columnas estructuradas:
1. `ITEM`
2. `CÓDIGO DEL ESTUDIANTE`
3. `NOMBRES Y APELLIDOS`
4. `TIPO DE DOCUMENTO (CC, TI)`
5. `NÚMERO DE DOCUMENTO`
6. `REMITIDO (R) O VOLUNTARIA (V)`
7. `CURSO`
8. `FECHA`
9. `HORA DE INICIO`
10. `HORA FINAL`
11. `LUGAR DE LA MONITORIA`
12. `FIRMA DEL ESTUDIANTE`

Históricamente, los monitores debían llevar este control en libretas o imprimir formatos vacíos para recolectar firmas manuales, incurriendo en transcripción doble o triple (en papel, en Excel personal y en el SIA), lo que originaba pérdidas de hasta el 45% de la información histórica.

## Decisión
Se adopta la **homologación integral del Formato PM-DO-PEG-F066** dentro del modelo de datos de la plataforma:
1. **Ampliación de la Entidad `SessionAttendee`:**
   * Se incorporan los atributos `studentCode`, `documentType` (CC, TI, CE), `documentNumber` y `referralType` ('R' para Remitido por docente, 'V' para Asistencia Voluntaria).
2. **Ampliación de la Entidad `MonitoringSession`:**
   * Se incorpora el atributo `location` (*Lugar de la Monitoría*, ej: Sala de Cómputo 3, Laboratorio de Software, Biblioteca, Virtual).
3. **Módulo de Generación y Exportación F066:**
   * La plataforma incluye un motor de visualización e impresión que genera el documento idéntico a la planilla física institucional de la USB, con su encabezado de calidad, numeración correlativa y firmas de entrega para Coordinación PIM-D.

## Consecuencias
* **Ahorro de Carga Operativa:** Los monitores solo digitan la información una vez; la plataforma consolida las horas, actualiza el SIA y exporta la planilla física lista para radicar.
* **Trazabilidad Pedagógica:** Permite a la Coordinación PIM-D y al Departamento de Pedagogía saber con exactitud qué estudiantes fueron remitidos por bajo rendimiento académico frente a los que asisten por iniciativa propia.
