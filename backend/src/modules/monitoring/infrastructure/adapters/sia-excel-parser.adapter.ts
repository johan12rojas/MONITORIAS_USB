import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as crypto from 'crypto';

export interface SiaParsedRow {
  sessionDate: Date;
  startTime: string;
  endTime: string;
  sessionType: string;
  subjectName: string;
  topic: string;
  recordingUrl?: string;
  observation: string;
  monitorCodeOrEmail?: string;
  studentAttendeesCount?: number;
  importHash: string;
}

export interface SiaParseResult {
  totalRows: number;
  validRows: SiaParsedRow[];
  invalidRows: { rowNumber: number; reason: string }[];
}

@Injectable()
export class SiaExcelParserAdapter {
  parseBuffer(buffer: Buffer): SiaParseResult {
    const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Obtener los datos como arreglo de arreglos o JSON
    const rawData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

    const validRows: SiaParsedRow[] = [];
    const invalidRows: { rowNumber: number; reason: string }[] = [];

    rawData.forEach((row, index) => {
      const rowNumber = index + 2; // Considerando cabecera en fila 1

      try {
        // Mapeo flexible de columnas para contemplar variaciones de títulos del SIA o Excel
        const fechaRaw = row['Fecha Inicio'] || row['Fecha'] || row['FECHA'] || row['FECHA INICIO'];
        const horaInicioRaw = row['Hora Inicio'] || row['Hora inicio'] || row['HORA INICIO'] || row['H. Inicio'];
        const horaFinRaw = row['Hora Fin'] || row['Hora fin'] || row['HORA FIN'] || row['H. Fin'];
        const tipoRaw = row['Tipo'] || row['TIPO'] || row['Modalidad'] || 'Presencial';
        const asignaturaRaw = row['Asignatura'] || row['ASIGNATURA'] || row['Materia'];
        const temaRaw = row['Tema'] || row['TEMA'] || row['Tema Desarrollado'];
        const grabacionRaw = row['URL Grabación'] || row['Grabación'] || row['Enlace'];
        const observacionRaw = row['Observación'] || row['Observaciones'] || row['OBSERVACION'] || '';
        const monitorRaw = row['Monitor'] || row['Usuario'] || row['Correo'] || row['Código'];
        const estudiantesRaw = row['Total Estudiantes'] || row['Estudiantes'] || row['Nro Alumnos'];

        if (!fechaRaw || !horaInicioRaw || !horaFinRaw || !temaRaw) {
          invalidRows.push({
            rowNumber,
            reason: 'Faltan campos obligatorios (Fecha, Hora Inicio, Hora Fin o Tema).',
          });
          return;
        }

        // Formateo de fecha
        const sessionDate = this.normalizeDate(fechaRaw);
        const startTime = this.normalizeTime(horaInicioRaw);
        const endTime = this.normalizeTime(horaFinRaw);

        // Generar hash determinista para evitar duplicación
        const hashPayload = `${monitorRaw || ''}_${sessionDate.toISOString().split('T')[0]}_${startTime}_${endTime}_${temaRaw.trim()}`;
        const importHash = crypto.createHash('sha256').update(hashPayload).digest('hex');

        validRows.push({
          sessionDate,
          startTime,
          endTime,
          sessionType: String(tipoRaw).trim(),
          subjectName: String(asignaturaRaw || 'General').trim(),
          topic: String(temaRaw).trim(),
          recordingUrl: grabacionRaw ? String(grabacionRaw).trim() : undefined,
          observation: String(observacionRaw).trim(),
          monitorCodeOrEmail: monitorRaw ? String(monitorRaw).trim() : undefined,
          studentAttendeesCount: estudiantesRaw ? Number(estudiantesRaw) : undefined,
          importHash,
        });
      } catch (err: any) {
        invalidRows.push({
          rowNumber,
          reason: err.message || 'Error inesperado al parsear la fila.',
        });
      }
    });

    return {
      totalRows: rawData.length,
      validRows,
      invalidRows,
    };
  }

  private normalizeDate(value: any): Date {
    if (value instanceof Date) return value;
    if (typeof value === 'string') {
      // Manejar formato "DD/MM/YYYY" o "YYYY-MM-DD"
      if (value.includes('/')) {
        const [day, month, year] = value.split('/').map(Number);
        return new Date(year, month - 1, day);
      }
      return new Date(value);
    }
    return new Date();
  }

  private normalizeTime(value: any): string {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      // Si viene como "14:00" o "2:00 PM"
      const match24 = trimmed.match(/^([01]?\d|2[0-3]):([0-5]\d)/);
      if (match24) {
        return match24[0].padStart(5, '0');
      }
    }
    return '00:00';
  }
}
