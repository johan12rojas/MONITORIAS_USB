import { SessionDuration, InvalidSessionTimeException } from './session-duration.vo';

describe('SessionDuration Value Object', () => {
  it('debe calcular exactamente 2.0 horas entre 14:00 y 16:00', () => {
    const duration = new SessionDuration('14:00', '16:00');
    expect(duration.hours).toBe(2.0);
    expect(duration.startTime).toBe('14:00');
    expect(duration.endTime).toBe('16:00');
  });

  it('debe calcular exactamente 1.5 horas entre 08:30 y 10:00', () => {
    const duration = new SessionDuration('08:30', '10:00');
    expect(duration.hours).toBe(1.5);
  });

  it('debe lanzar InvalidSessionTimeException si la hora de fin es menor o igual a la hora de inicio', () => {
    expect(() => new SessionDuration('16:00', '14:00')).toThrow(InvalidSessionTimeException);
    expect(() => new SessionDuration('14:00', '14:00')).toThrow(InvalidSessionTimeException);
  });

  it('debe lanzar excepción si el formato de hora es inválido', () => {
    expect(() => new SessionDuration('25:00', '14:00')).toThrow(InvalidSessionTimeException);
    expect(() => new SessionDuration('08:65', '10:00')).toThrow(InvalidSessionTimeException);
    expect(() => new SessionDuration('abc', '10:00')).toThrow(InvalidSessionTimeException);
  });

  it('debe lanzar excepción si la duración excede las 8 horas continuas', () => {
    expect(() => new SessionDuration('08:00', '17:00')).toThrow(InvalidSessionTimeException);
  });

  it('debe lanzar excepción si la duración es menor a 15 minutos', () => {
    expect(() => new SessionDuration('14:00', '14:10')).toThrow(InvalidSessionTimeException);
  });
});
