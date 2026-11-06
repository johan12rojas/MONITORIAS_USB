import { MonitoringSession, SessionStatusType } from '../entities/monitoring-session.entity';

export interface DateRangeCriteria {
  start: Date;
  end: Date;
}

export interface SessionFilterCriteria {
  subjectId?: string;
  sessionType?: string;
  status?: SessionStatusType;
  dateRange?: DateRangeCriteria;
  searchTerm?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MonitorAccumulatedHours {
  approvedHours: number;
  pendingHours: number;
  totalHours: number;
  totalStudentsAttended: number;
  totalSessions: number;
}

export interface MonitorProgressSummary {
  monitorProfileId: string;
  monitorName: string;
  institutionalCode: string;
  email: string;
  targetHours: number;
  accumulatedHours: number;
  remainingHours: number;
  progressPercentage: number;
  totalStudentsAttended: number;
  totalSessions: number;
  status: 'ACTIVO' | 'CUMPLIDO' | 'INCOMPLETO';
}

export const MONITORING_REPOSITORY_TOKEN = 'IMonitoringSessionRepository';

export interface IMonitoringSessionRepository {
  save(session: MonitoringSession): Promise<MonitoringSession>;
  findById(id: string): Promise<MonitoringSession | null>;
  findByImportHash(hash: string): Promise<MonitoringSession | null>;
  findByMonitor(monitorProfileId: string, criteria: SessionFilterCriteria): Promise<PaginatedResult<MonitoringSession>>;
  findGlobalSessions(periodId: string, criteria: SessionFilterCriteria & { monitorProfileId?: string }): Promise<PaginatedResult<MonitoringSession>>;
  calculateMonitorProgress(monitorProfileId: string): Promise<MonitorAccumulatedHours>;
  getProgramConsolidatedSummary(periodId: string): Promise<MonitorProgressSummary[]>;
  update(session: MonitoringSession): Promise<MonitoringSession>;
}
