export type WeightUnit = 'kg' | 'lbs';

export function parsePositiveNumber(value: string): number {
  const trimmed = value.trim().replace(/,/g, '');
  if (!trimmed) return NaN;
  return Number(trimmed);
}

export function isValidWeight(value: string, unit: WeightUnit): boolean {
  const amount = parsePositiveNumber(value);
  if (!Number.isFinite(amount) || amount <= 0) return false;
  if (unit === 'kg') return amount >= 30 && amount <= 300;
  return amount >= 66 && amount <= 660;
}

export function formatWeightKg(kg: number | null | undefined, unit: WeightUnit = 'kg'): string {
  if (kg == null || !Number.isFinite(kg) || kg <= 0) return '';
  if (unit === 'kg') return String(Math.round(kg * 10) / 10);
  return String(Math.round((kg / 0.45359237) * 10) / 10);
}
