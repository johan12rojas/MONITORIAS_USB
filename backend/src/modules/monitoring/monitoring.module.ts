import { Module } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { MONITORING_REPOSITORY_TOKEN } from './domain/repositories/monitoring-session.repository.interface';
import { PrismaMonitoringSessionRepository } from './infrastructure/persistence/prisma-monitoring-session.repository';
import { RegisterMonitoringSessionUseCase } from './application/use-cases/register-monitoring-session.use-case';
import { GetMonitorProgressUseCase } from './application/use-cases/get-monitor-progress.use-case';
import { GetMonitorHistoryUseCase } from './application/use-cases/get-monitor-history.use-case';
import { GetCoordinatorDashboardUseCase } from './application/use-cases/get-coordinator-dashboard.use-case';
import { SiaExcelParserAdapter } from './infrastructure/adapters/sia-excel-parser.adapter';
import { MonitoringController } from './infrastructure/http/monitoring.controller';
import { CoordinationController } from './infrastructure/http/coordination.controller';

@Module({
  controllers: [MonitoringController, CoordinationController],
  providers: [
    PrismaService,
    SiaExcelParserAdapter,
    RegisterMonitoringSessionUseCase,
    GetMonitorProgressUseCase,
    GetMonitorHistoryUseCase,
    GetCoordinatorDashboardUseCase,
    {
      provide: MONITORING_REPOSITORY_TOKEN,
      useClass: PrismaMonitoringSessionRepository,
    },
  ],
  exports: [
    RegisterMonitoringSessionUseCase,
    GetMonitorProgressUseCase,
    GetMonitorHistoryUseCase,
    GetCoordinatorDashboardUseCase,
    MONITORING_REPOSITORY_TOKEN,
  ],
})
export class MonitoringModule {}
