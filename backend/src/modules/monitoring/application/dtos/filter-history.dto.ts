import { IsOptional, IsString, IsDateString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterHistoryDto {
  @ApiPropertyOptional({ description: 'ID de la asignatura para filtrar' })
  @IsOptional()
  @IsString()
  subjectId?: string;

  @ApiPropertyOptional({ description: 'Modalidad (Presencial, Virtual, Taller, Asesoría)' })
  @IsOptional()
  @IsString()
  sessionType?: string;

  @ApiPropertyOptional({ enum: ['PENDIENTE', 'APROBADO', 'OBSERVADO'] })
  @IsOptional()
  @IsEnum(['PENDIENTE', 'APROBADO', 'OBSERVADO'])
  status?: 'PENDIENTE' | 'APROBADO' | 'OBSERVADO';

  @ApiPropertyOptional({ description: 'Fecha inicio del rango (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Fecha fin del rango (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Búsqueda por texto en tema u observaciones' })
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
