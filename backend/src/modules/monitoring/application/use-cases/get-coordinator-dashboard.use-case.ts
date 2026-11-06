import { Inject, Injectable } from '@nestjs/common';
import { 
  IMonitoringSessionRepository, 
  MONITORING_REPOSITORY_TOKEN,
  MonitorProgressSummary
} from '../../domain/repositories/monitoring-session.repository.interface';

export interface CoordinatorDashboardResponse {
  periodId: string;
  totalMonitors: number;
  monitorsCompleted: number;
  monitorsInProgress: number;
  totalHoursAccumulated: number;
  totalStudentsAttended: number;
  averageCompliancePercentage: number;
  monitors: MonitorProgressSummary[];
}

@Injectable()
export class GetCoordinatorDashboardUseCase {
  constructor(
    @Inject(MONITORING_REPOSITORY_TOKEN)
    private readonly sessionRepository: IMonitoringSessionRepository,
  ) {}

  async execute(periodId: string): Promise<CoordinatorDashboardResponse> {
    const summaries = await this.sessionRepository.getProgramConsolidatedSummary(periodId);

    const totalMonitors = summaries.length;
    let completedCount = 0;
    let inProgressCount = 0;
    let totalHours = 0;
    let totalStudents = 0;
    let sumPercentage = 0;

    for (const monitor of summaries) {
      if (monitor.status === 'CUMPLIDO') {
        completedCount++;
      } else {
        inProgressCount++;
      }
      totalHours += monitor.accumulatedHours;
      totalStudents += monitor.totalStudentsAttended;
      sumPercentage += monitor.progressPercentage;
    }

    const averageCompliance = totalMonitors > 0 
      ? Number((sumPercentage / totalMonitors).toFixed(1)) 
      : 0;

    return {
      periodId,
      totalMonitors,
      monitorsCompleted: completedCount,
      monitorsInProgress: inProgressCount,
      totalHoursAccumulated: Number(totalHours.toFixed(2)),
      totalStudentsAttended: totalStudents,
      averageCompliancePercentage: averageCompliance,
      monitors: summaries,
    };
  }
}
