import { Inject, Injectable } from '@nestjs/common';
import { 
  IMonitoringSessionRepository, 
  MONITORING_REPOSITORY_TOKEN 
} from '../../domain/repositories/monitoring-session.repository.interface';
import { CreateSessionDto } from '../dtos/create-session.dto';
import { SessionDuration } from '../../domain/value-objects/session-duration.vo';
import { MonitoringSession } from '../../domain/entities/monitoring-session.entity';
import { SessionAttendee } from '../../domain/entities/session-attendee.entity';

@Injectable()
export class RegisterMonitoringSessionUseCase {
  constructor(
    @Inject(MONITORING_REPOSITORY_TOKEN)
    private readonly sessionRepository: IMonitoringSessionRepository,
  ) {}

  async execute(
    monitorProfileId: string,
    academicPeriodId: string,
    dto: CreateSessionDto
  ): Promise<MonitoringSession> {
    // 1. Instanciar Value Object de duración (valida horarios)
    const duration = new SessionDuration(dto.startTime, dto.endTime);

    // 2. Mapear asistentes si fueron proporcionados
    const attendees = (dto.attendees || []).map((att) => 
      new SessionAttendee(
        '', // Se genera en BD o repo
        '', 
        att.studentIdCard,
        att.studentName,
        att.studentEmail,
        att.careerProgram
      )
    );

    // 3. Crear entidad de Dominio
    const session = new MonitoringSession({
      monitorProfileId,
      academicPeriodId,
      subjectId: dto.subjectId,
      sessionDate: new Date(dto.sessionDate),
      duration,
      sessionType: dto.sessionType,
      topic: dto.topic,
      recordingUrl: dto.recordingUrl,
      observation: dto.observation,
      status: 'PENDIENTE',
      source: 'DIRECT',
      attendees,
    });

    // 4. Persistir a través del puerto
    return await this.sessionRepository.save(session);
  }
}
