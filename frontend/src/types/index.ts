export interface Attendee {
  id?: string;
  studentIdCard: string;
  studentName: string;
  studentEmail?: string;
  careerProgram?: string;
}

export interface MonitoringSession {
  id: string;
  monitorProfileId: string;
  academicPeriodId: string;
  subjectId: string;
  subjectName?: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  calculatedHours: number;
  sessionType: 'Presencial' | 'Virtual' | 'Taller' | 'Asesoría';
  topic: string;
  recordingUrl?: string;
  observation: string;
  status: 'PENDIENTE' | 'APROBADO' | 'OBSERVADO';
  coordinatorNotes?: string;
  source: 'DIRECT' | 'SIA_IMPORT';
  attendees?: Attendee[];
  createdAt?: string;
}

export interface MonitorProgress {
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

export interface MonitorSummary {
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

export interface CoordinatorDashboardData {
  periodId: string;
  totalMonitors: number;
  monitorsCompleted: number;
  monitorsInProgress: number;
  totalHoursAccumulated: number;
  totalStudentsAttended: number;
  averageCompliancePercentage: number;
  monitors: MonitorSummary[];
}
