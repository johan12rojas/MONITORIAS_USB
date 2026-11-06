import { Controller, Get, Patch, Param, Body, Query, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GetCoordinatorDashboardUseCase } from '../../application/use-cases/get-coordinator-dashboard.use-case';
import { 
  IMonitoringSessionRepository, 
  MONITORING_REPOSITORY_TOKEN 
} from '../../domain/repositories/monitoring-session.repository.interface';
import { FilterHistoryDto } from '../../application/dtos/filter-history.dto';

class ReviewSessionDto {
  status: 'APROBADO' | 'OBSERVADO';
  coordinatorNotes?: string;
}

@ApiTags('Coordinación y Dirección')
@Controller('api/v1/coordination')
export class CoordinationController {
  constructor(
    private readonly dashboardUseCase: GetCoordinatorDashboardUseCase,
    @Inject(MONITORING_REPOSITORY_TOKEN)
    private readonly sessionRepository: IMonitoringSessionRepository,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Obtener tablero consolidado de todos los monitores del programa (Matriz 20 monitores)' })
  async getDashboard(@Query('periodId') periodId: string) {
    const targetPeriod = periodId || 'default-period-id';
    return await this.dashboardUseCase.execute(targetPeriod);
  }

  @Get('sessions')
  @ApiOperation({ summary: 'Consultar todas las sesiones del programa con filtros globales' })
  async getGlobalSessions(
    @Query('periodId') periodId: string,
    @Query('monitorProfileId') monitorProfileId?: string,
    @Query() filterDto?: FilterHistoryDto,
  ) {
    const targetPeriod = periodId || 'default-period-id';
    return await this.sessionRepository.findGlobalSessions(targetPeriod, {
      ...filterDto,
      monitorProfileId,
    });
  }

  @Patch('sessions/:id/review')
  @ApiOperation({ summary: 'Aprobar u observar una sesión de monitoría con notas del docente' })
  async reviewSession(@Param('id') id: string, @Body() dto: ReviewSessionDto) {
    const session = await this.sessionRepository.findById(id);
    if (!session) {
      throw new Error('Sesión no encontrada.');
    }

    if (dto.status === 'APROBADO') {
      session.approve(dto.coordinatorNotes);
    } else {
      session.observe(dto.coordinatorNotes || 'Observada por coordinación.');
    }

    return await this.sessionRepository.update(session);
  }
}
