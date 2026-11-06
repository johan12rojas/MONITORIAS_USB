import { Inject, Injectable } from '@nestjs/common';
import { 
  IMonitoringSessionRepository, 
  MONITORING_REPOSITORY_TOKEN 
} from '../../domain/repositories/monitoring-session.repository.interface';
import { HourGoal } from '../../domain/value-objects/hour-goal.vo';

export interface MonitorProgressResponse {
  targetHours: number;
  approvedHours: number;
  pendingHours: number;
  totalAccumulatedHours: number;
  remainingHours: number;
  progressPercentage: number;
  isCompleted: boolean;
  totalStudentsAttended: number;
  totalSessions: number;
  statusMessage: string;
}

@Injectable()
export class GetMonitorProgressUseCase {
  constructor(
    @Inject(MONITORING_REPOSITORY_TOKEN)
    private readonly sessionRepository: IMonitoringSessionRepository,
  ) {}

  async execute(monitorProfileId: string, customTargetHours = 54): Promise<MonitorProgressResponse> {
    const goal = new HourGoal(customTargetHours);
    const progress = await this.sessionRepository.calculateMonitorProgress(monitorProfileId);

    const accumulated = progress.approvedHours;
    const remaining = goal.calculateRemainingHours(accumulated);
    const percentage = goal.calculateProgressPercentage(accumulated);
    const completed = goal.isCompleted(accumulated);

    let statusMessage = `Has completado ${accumulated} horas de ${goal.targetHours} horas requeridas.`;
    if (completed) {
      statusMessage = `¡Felicitaciones! Has cumplido el requisito de ${goal.targetHours} horas de monitoría.`;
    } else if (remaining <= 10) {
      statusMessage = `¡Estás muy cerca! Te faltan solo ${remaining} horas para completar tu beneficio.`;
    }

    return {
      targetHours: goal.targetHours,
      approvedHours: progress.approvedHours,
      pendingHours: progress.pendingHours,
      totalAccumulatedHours: progress.totalHours,
      remainingHours: remaining,
      progressPercentage: percentage,
      isCompleted: completed,
      totalStudentsAttended: progress.totalStudentsAttended,
      totalSessions: progress.totalSessions,
      statusMessage,
    };
  }
}
