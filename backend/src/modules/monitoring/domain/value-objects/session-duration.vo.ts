export class InvalidSessionTimeException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidSessionTimeException';
  }
}

export class SessionDuration {
  private readonly _hours: number;
  private readonly _startTime: string;
  private readonly _endTime: string;

  constructor(startTime: string, endTime: string) {
    this.validateTimeFormat(startTime, 'Hora de inicio');
    this.validateTimeFormat(endTime, 'Hora de fin');

    const startMinutes = this.timeToMinutes(startTime);
    const endMinutes = this.timeToMinutes(endTime);

    if (endMinutes <= startMinutes) {
      throw new InvalidSessionTimeException(
        `La hora de fin (${endTime}) debe ser estrictamente posterior a la hora de inicio (${startTime}).`
      );
    }

    const durationMinutes = endMinutes - startMinutes;
    const computedHours = Number((durationMinutes / 60).toFixed(2));

    if (computedHours > 8) {
      throw new InvalidSessionTimeException(
        `Una sesión de monitoría no puede exceder las 8 horas continuas (duración registrada: ${computedHours} horas).`
      );
    }

    if (durationMinutes < 15) {
      throw new InvalidSessionTimeException(
        `Una sesión de monitoría debe tener al menos 15 minutos de duración (duración registrada: ${durationMinutes} minutos).`
      );
    }

    this._startTime = startTime;
    this._endTime = endTime;
    this._hours = computedHours;
  }

  get hours(): number {
    return this._hours;
  }

  get startTime(): string {
    return this._startTime;
  }

  get endTime(): string {
    return this._endTime;
  }

  private validateTimeFormat(time: string, fieldName: string): void {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(time)) {
      throw new InvalidSessionTimeException(
        `${fieldName} tiene un formato inválido ('${time}'). Debe ser 'HH:mm' en formato 24 horas (ej: 08:30, 14:00).`
      );
    }
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
