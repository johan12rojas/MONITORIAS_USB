import { SessionDuration } from '../value-objects/session-duration.vo';
import { SessionAttendee } from './session-attendee.entity';

export type SessionStatusType = 'PENDIENTE' | 'APROBADO' | 'OBSERVADO';
export type SessionSourceType = 'DIRECT' | 'SIA_IMPORT';

export interface MonitoringSessionProps {
  id?: string;
  monitorProfileId: string;
  academicPeriodId: string;
  subjectId: string;
  sessionDate: Date;
  duration: SessionDuration;
  sessionType: string;
  topic: string;
  recordingUrl?: string;
  observation: string;
  status?: SessionStatusType;
  coordinatorNotes?: string;
  source?: SessionSourceType;
  importHash?: string;
  attendees?: SessionAttendee[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class MonitoringSession {
  private readonly _id?: string;
  private readonly _monitorProfileId: string;
  private readonly _academicPeriodId: string;
  private readonly _subjectId: string;
  private readonly _sessionDate: Date;
  private readonly _duration: SessionDuration;
  private readonly _sessionType: string;
  private readonly _topic: string;
  private readonly _recordingUrl?: string;
  private _observation: string;
  private _status: SessionStatusType;
  private _coordinatorNotes?: string;
  private readonly _source: SessionSourceType;
  private readonly _importHash?: string;
  private _attendees: SessionAttendee[];
  private readonly _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(props: MonitoringSessionProps) {
    if (!props.topic || props.topic.trim() === '') {
      throw new Error('El tema de la monitoría no puede estar vacío.');
    }
    if (!props.observation || props.observation.trim() === '') {
      throw new Error('Las observaciones de la monitoría son obligatorias.');
    }

    this._id = props.id;
    this._monitorProfileId = props.monitorProfileId;
    this._academicPeriodId = props.academicPeriodId;
    this._subjectId = props.subjectId;
    this._sessionDate = props.sessionDate;
    this._duration = props.duration;
    this._sessionType = props.sessionType || 'Presencial';
    this._topic = props.topic.trim();
    this._recordingUrl = props.recordingUrl;
    this._observation = props.observation.trim();
    this._status = props.status || 'PENDIENTE';
    this._coordinatorNotes = props.coordinatorNotes;
    this._source = props.source || 'DIRECT';
    this._importHash = props.importHash;
    this._attendees = props.attendees || [];
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  // Getters
  get id(): string | undefined { return this._id; }
  get monitorProfileId(): string { return this._monitorProfileId; }
  get academicPeriodId(): string { return this._academicPeriodId; }
  get subjectId(): string { return this._subjectId; }
  get sessionDate(): Date { return this._sessionDate; }
  get duration(): SessionDuration { return this._duration; }
  get sessionType(): string { return this._sessionType; }
  get topic(): string { return this._topic; }
  get recordingUrl(): string | undefined { return this._recordingUrl; }
  get observation(): string { return this._observation; }
  get status(): SessionStatusType { return this._status; }
  get coordinatorNotes(): string | undefined { return this._coordinatorNotes; }
  get source(): SessionSourceType { return this._source; }
  get importHash(): string | undefined { return this._importHash; }
  get attendees(): SessionAttendee[] { return this._attendees; }
  get calculatedHours(): number { return this._duration.hours; }
  get createdAt(): Date | undefined { return this._createdAt; }
  get updatedAt(): Date | undefined { return this._updatedAt; }

  // Métodos de Dominio
  approve(coordinatorNotes?: string): void {
    this._status = 'APROBADO';
    if (coordinatorNotes) {
      this._coordinatorNotes = coordinatorNotes;
    }
  }

  observe(reason: string): void {
    if (!reason || reason.trim() === '') {
      throw new Error('Debe proporcionar un motivo para observar la monitoría.');
    }
    this._status = 'OBSERVADO';
    this._coordinatorNotes = reason;
  }

  addAttendee(attendee: SessionAttendee): void {
    this._attendees.push(attendee);
  }
}
