import { HourGoal, InvalidHourGoalException } from './hour-goal.vo';

describe('HourGoal Value Object (Meta 54 Horas)', () => {
  it('debe inicializar por defecto en 54 horas', () => {
    const goal = new HourGoal();
    expect(goal.targetHours).toBe(54);
  });

  it('debe calcular correctamente las horas restantes', () => {
    const goal = new HourGoal(54);
    expect(goal.calculateRemainingHours(20)).toBe(34);
    expect(goal.calculateRemainingHours(50)).toBe(4);
    expect(goal.calculateRemainingHours(54)).toBe(0);
    expect(goal.calculateRemainingHours(60)).toBe(0);
  });

  it('debe calcular el porcentaje de avance con precisión decimal', () => {
    const goal = new HourGoal(54);
    expect(goal.calculateProgressPercentage(27)).toBe(50.0);
    expect(goal.calculateProgressPercentage(0)).toBe(0);
    expect(goal.calculateProgressPercentage(54)).toBe(100.0);
    expect(goal.calculateProgressPercentage(80)).toBe(100.0);
  });

  it('debe identificar si la meta está cumplida', () => {
    const goal = new HourGoal(54);
    expect(goal.isCompleted(53.9)).toBe(false);
    expect(goal.isCompleted(54.0)).toBe(true);
    expect(goal.isCompleted(90)).toBe(true);
  });

  it('debe lanzar excepción ante metas no positivas', () => {
    expect(() => new HourGoal(0)).toThrow(InvalidHourGoalException);
    expect(() => new HourGoal(-10)).toThrow(InvalidHourGoalException);
  });
});
