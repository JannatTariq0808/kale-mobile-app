/** Mirrors Flutter `athleteLevelCalculation` — weighted pillars with cardio floor. */
export function athleteLevelCalculation(
  cardioLevel: number,
  strengthLevel: number,
  knowledgeLevel: number,
): number {
  const weighted = 0.7 * cardioLevel + 0.2 * strengthLevel + 0.1 * knowledgeLevel;
  const rounded = Math.trunc(weighted + 0.4);

  const athleteLevel = rounded > cardioLevel + 1 ? cardioLevel + 1 : rounded;

  if (athleteLevel < 1) return 1;
  if (athleteLevel > 10) return 10;
  return athleteLevel;
}
