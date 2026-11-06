export class InvalidHourGoalException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidHourGoalException';
  }
}

export class HourGoal {
  public static readonly DEFAULT_TARGET_HOURS = 54;
  private readonly _targetHours: number;

  constructor(targetHours: number = HourGoal.DEFAULT_TARGET_HOURS) {
    if (targetHours <= 0) {
      throw new InvalidHourGoalException('La meta de horas debe ser un valor positivo mayor a cero.');
    }
    this._targetHours = targetHours;
  }

  get targetHours(): number {
    return this._targetHours;
  }

  calculateRemainingHours(accumulatedHours: number): number {
    const remaining = this._targetHours - accumulatedHours;
    return remaining > 0 ? Number(remaining.toFixed(2)) : 0;
  }

  calculateProgressPercentage(accumulatedHours: number): number {
    if (accumulatedHours <= 0) return 0;
    const percentage = (accumulatedHours / this._targetHours) * 100;
    return Number(Math.min(percentage, 100).toFixed(1));
  }

  isCompleted(accumulatedHours: number): boolean {
    return accumulatedHours >= this._targetHours;
  }
}
