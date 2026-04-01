export function predictedMaxHR(age: number, betaBlocker: boolean): number {
  if (betaBlocker) {
    return Math.round(164 - 0.7 * age);
  }
  return 220 - age;
}

export function stopHR(maxHR: number): number {
  return Math.round(maxHR * 0.85);
}
