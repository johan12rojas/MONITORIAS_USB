export class SessionAttendee {
  constructor(
    public readonly id: string,
    public readonly monitoringSessionId: string,
    public readonly studentIdCard: string,
    public readonly studentName: string,
    public readonly studentEmail?: string,
    public readonly careerProgram?: string,
    public readonly createdAt?: Date
  ) {
    if (!studentIdCard || studentIdCard.trim() === '') {
      throw new Error('La cédula o código del estudiante asistente es obligatorio.');
    }
    if (!studentName || studentName.trim() === '') {
      throw new Error('El nombre del estudiante asistente es obligatorio.');
    }
  }
}
