import { Inject, Injectable } from '@nestjs/common';
import { 
  IMonitoringSessionRepository, 
  MONITORING_REPOSITORY_TOKEN,
  PaginatedResult 
} from '../../domain/repositories/monitoring-session.repository.interface';
import { FilterHistoryDto } from '../dtos/filter-history.dto';
import { MonitoringSession } from '../../domain/entities/monitoring-session.entity';

@Injectable()
export class GetMonitorHistoryUseCase {
  constructor(
    @Inject(MONITORING_REPOSITORY_TOKEN)
    private readonly sessionRepository: IMonitoringSessionRepository,
  ) {}

  async execute(
    monitorProfileId: string, 
    filterDto: FilterHistoryDto
  ): Promise<PaginatedResult<MonitoringSession>> {
    // 1. Convertir DTO a criterios de dominio
    const criteria = {
      subjectId: filterDto.subjectId,
      sessionType: filterDto.sessionType,
      status: filterDto.status,
      dateRange: filterDto.startDate && filterDto.endDate 
        ? { start: new Date(filterDto.startDate), end: new Date(filterDto.endDate) }
        : undefined,
      searchTerm: filterDto.searchTerm,
      page: filterDto.page || 1,
      limit: filterDto.limit || 10,
    };

    // 2. Ejecutar consulta aislada en el repositorio
    return await this.sessionRepository.findByMonitor(monitorProfileId, criteria);
  }
}
