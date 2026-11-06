import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service';
import { 
  IMonitoringSessionRepository, 
  SessionFilterCriteria, 
  PaginatedResult, 
  MonitorAccumulatedHours, 
  MonitorProgressSummary 
} from '../../domain/repositories/monitoring-session.repository.interface';
import { MonitoringSession, SessionStatusType, SessionSourceType } from '../../domain/entities/monitoring-session.entity';
import { SessionDuration } from '../../domain/value-objects/session-duration.vo';
import { SessionAttendee } from '../../domain/entities/session-attendee.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaMonitoringSessionRepository implements IMonitoringSessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(session: MonitoringSession): Promise<MonitoringSession> {
    const created = await this.prisma.monitoringSession.create({
      data: {
        monitorProfileId: session.monitorProfileId,
        academicPeriodId: session.academicPeriodId,
        subjectId: session.subjectId,
        sessionDate: session.sessionDate,
        startTime: session.duration.startTime,
        endTime: session.duration.endTime,
        calculatedHours: new Prisma.Decimal(session.calculatedHours),
        sessionType: session.sessionType,
        topic: session.topic,
        recordingUrl: session.recordingUrl,
        observation: session.observation,
        status: session.status,
        source: session.source,
        importHash: session.importHash,
        attendees: {
          create: session.attendees.map((att) => ({
            studentIdCard: att.studentIdCard,
            studentName: att.studentName,
            studentEmail: att.studentEmail,
            careerProgram: att.careerProgram,
          })),
        },
      },
      include: {
        attendees: true,
      },
    });

    return this.mapToDomain(created);
  }

  async findById(id: string): Promise<MonitoringSession | null> {
    const record = await this.prisma.monitoringSession.findUnique({
      where: { id },
      include: { attendees: true },
    });
    return record ? this.mapToDomain(record) : null;
  }

  async findByImportHash(hash: string): Promise<MonitoringSession | null> {
    const record = await this.prisma.monitoringSession.findUnique({
      where: { importHash: hash },
      include: { attendees: true },
    });
    return record ? this.mapToDomain(record) : null;
  }

  async findByMonitor(
    monitorProfileId: string, 
    criteria: SessionFilterCriteria
  ): Promise<PaginatedResult<MonitoringSession>> {
    const page = criteria.page || 1;
    const limit = criteria.limit || 10;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.MonitoringSessionWhereInput = {
      monitorProfileId, // Aislamiento estricto
      ...(criteria.subjectId && { subjectId: criteria.subjectId }),
      ...(criteria.sessionType && { sessionType: criteria.sessionType }),
      ...(criteria.status && { status: criteria.status }),
      ...(criteria.dateRange && {
        sessionDate: {
          gte: criteria.dateRange.start,
          lte: criteria.dateRange.end,
        },
      }),
      ...(criteria.searchTerm && {
        OR: [
          { topic: { contains: criteria.searchTerm, mode: 'insensitive' } },
          { observation: { contains: criteria.searchTerm, mode: 'insensitive' } },
        ],
      }),
    };

    const [total, records] = await Promise.all([
      this.prisma.monitoringSession.count({ where: whereClause }),
      this.prisma.monitoringSession.findMany({
        where: whereClause,
        include: { attendees: true },
        orderBy: { sessionDate: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: records.map((r) => this.mapToDomain(r)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findGlobalSessions(
    periodId: string, 
    criteria: SessionFilterCriteria & { monitorProfileId?: string }
  ): Promise<PaginatedResult<MonitoringSession>> {
    const page = criteria.page || 1;
    const limit = criteria.limit || 10;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.MonitoringSessionWhereInput = {
      academicPeriodId: periodId,
      ...(criteria.monitorProfileId && { monitorProfileId: criteria.monitorProfileId }),
      ...(criteria.subjectId && { subjectId: criteria.subjectId }),
      ...(criteria.sessionType && { sessionType: criteria.sessionType }),
      ...(criteria.status && { status: criteria.status }),
      ...(criteria.dateRange && {
        sessionDate: {
          gte: criteria.dateRange.start,
          lte: criteria.dateRange.end,
        },
      }),
      ...(criteria.searchTerm && {
        OR: [
          { topic: { contains: criteria.searchTerm, mode: 'insensitive' } },
          { observation: { contains: criteria.searchTerm, mode: 'insensitive' } },
        ],
      }),
    };

    const [total, records] = await Promise.all([
      this.prisma.monitoringSession.count({ where: whereClause }),
      this.prisma.monitoringSession.findMany({
        where: whereClause,
        include: { attendees: true },
        orderBy: { sessionDate: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: records.map((r) => this.mapToDomain(r)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async calculateMonitorProgress(monitorProfileId: string): Promise<MonitorAccumulatedHours> {
    const sessions = await this.prisma.monitoringSession.findMany({
      where: { monitorProfileId },
      include: { attendees: true },
    });

    let approvedHours = 0;
    let pendingHours = 0;
    let totalStudents = 0;

    for (const session of sessions) {
      const hours = Number(session.calculatedHours);
      if (session.status === 'APROBADO') {
        approvedHours += hours;
      } else if (session.status === 'PENDIENTE') {
        pendingHours += hours;
      }
      totalStudents += session.attendees.length;
    }

    return {
      approvedHours: Number(approvedHours.toFixed(2)),
      pendingHours: Number(pendingHours.toFixed(2)),
      totalHours: Number((approvedHours + pendingHours).toFixed(2)),
      totalStudentsAttended: totalStudents,
      totalSessions: sessions.length,
    };
  }

  async getProgramConsolidatedSummary(periodId: string): Promise<MonitorProgressSummary[]> {
    const monitorProfiles = await this.prisma.monitorProfile.findMany({
      where: { academicPeriodId: periodId },
      include: {
        user: true,
        sessions: {
          include: { attendees: true },
        },
      },
      orderBy: { user: { fullName: 'asc' } },
    });

    return monitorProfiles.map((profile) => {
      let accumulated = 0;
      let totalStudents = 0;

      for (const s of profile.sessions) {
        if (s.status === 'APROBADO' || s.status === 'PENDIENTE') {
          accumulated += Number(s.calculatedHours);
        }
        totalStudents += s.attendees.length;
      }

      accumulated = Number(accumulated.toFixed(2));
      const target = Number(profile.targetHours);
      const remaining = Math.max(0, target - accumulated);
      const percentage = target > 0 ? Number(Math.min(100, (accumulated / target) * 100).toFixed(1)) : 0;
      const status = accumulated >= target ? 'CUMPLIDO' : 'ACTIVO';

      return {
        monitorProfileId: profile.id,
        monitorName: profile.user.fullName,
        institutionalCode: profile.user.institutionalCode,
        email: profile.user.email,
        targetHours: target,
        accumulatedHours: accumulated,
        remainingHours: remaining,
        progressPercentage: percentage,
        totalStudentsAttended: totalStudents,
        totalSessions: profile.sessions.length,
        status,
      };
    });
  }

  async update(session: MonitoringSession): Promise<MonitoringSession> {
    const updated = await this.prisma.monitoringSession.update({
      where: { id: session.id },
      data: {
        status: session.status,
        coordinatorNotes: session.coordinatorNotes,
      },
      include: { attendees: true },
    });
    return this.mapToDomain(updated);
  }

  private mapToDomain(record: any): MonitoringSession {
    const duration = new SessionDuration(record.startTime, record.endTime);
    const attendees = (record.attendees || []).map(
      (a: any) => new SessionAttendee(a.id, a.monitoringSessionId, a.studentIdCard, a.studentName, a.studentEmail, a.careerProgram, a.createdAt)
    );

    return new MonitoringSession({
      id: record.id,
      monitorProfileId: record.monitorProfileId,
      academicPeriodId: record.academicPeriodId,
      subjectId: record.subjectId,
      sessionDate: record.sessionDate,
      duration,
      sessionType: record.sessionType,
      topic: record.topic,
      recordingUrl: record.recordingUrl,
      observation: record.observation,
      status: record.status as SessionStatusType,
      coordinatorNotes: record.coordinatorNotes,
      source: record.source as SessionSourceType,
      importHash: record.importHash,
      attendees,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
