import { IsString, IsNotEmpty, IsDateString, Matches, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AttendeeDto {
  @ApiProperty({ example: '1090123456', description: 'Cédula o código institucional del estudiante' })
  @IsString()
  @IsNotEmpty()
  studentIdCard: string;

  @ApiProperty({ example: 'Brayhan Alejandro Gómez Vega', description: 'Nombre completo' })
  @IsString()
  @IsNotEmpty()
  studentName: string;

  @ApiPropertyOptional({ example: 'b_gomez@unisimon.edu.co' })
  @IsOptional()
  @IsString()
  studentEmail?: string;

  @ApiPropertyOptional({ example: 'Ingeniería de Sistemas' })
  @IsOptional()
  @IsString()
  careerProgram?: string;
}

export class CreateSessionDto {
  @ApiProperty({ example: 'subject-uuid-123', description: 'ID de la asignatura' })
  @IsString()
  @IsNotEmpty()
  subjectId: string;

  @ApiProperty({ example: '2026-10-24', description: 'Fecha de la sesión (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  sessionDate: string;

  @ApiProperty({ example: '14:00', description: 'Hora inicio (HH:mm en formato 24h)' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Hora inicio debe tener formato HH:mm (24h)' })
  startTime: string;

  @ApiProperty({ example: '16:00', description: 'Hora fin (HH:mm en formato 24h)' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Hora fin debe tener formato HH:mm (24h)' })
  endTime: string;

  @ApiProperty({ example: 'Presencial', enum: ['Presencial', 'Virtual', 'Taller', 'Asesoría'] })
  @IsString()
  @IsNotEmpty()
  sessionType: string;

  @ApiProperty({ example: 'Normalización de Bases de Datos y Formas Normales (1FN, 2FN, 3FN)' })
  @IsString()
  @IsNotEmpty()
  topic: string;

  @ApiPropertyOptional({ example: 'https://teams.microsoft.com/l/meetup-join/...' })
  @IsOptional()
  @IsString()
  recordingUrl?: string;

  @ApiProperty({ example: 'Se resolvieron ejercicios prácticos de normalización con 4 estudiantes.' })
  @IsString()
  @IsNotEmpty()
  observation: string;

  @ApiPropertyOptional({ type: [AttendeeDto], description: 'Lista de estudiantes asistentes' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendeeDto)
  attendees?: AttendeeDto[];
}
