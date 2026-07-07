const GARMIN_DEVICE_PATTERNS = [
  /\bgarmin\b/i,
  /\bforerunner\b/i,
  /\bfenix\b/i,
  /\bedge\b/i,
  /\bvenu\b/i,
  /\bepix\b/i,
  /\binstinct\b/i,
  /\bvivoactive\b/i,
  /\bvivomove\b/i,
  /\bapproach\b/i,
  /\bmarq\b/i,
];

/** True when the activity device name is a Garmin product (not Peloton, Coros, etc.). */
export function isGarminDeviceName(deviceName: string | null | undefined): boolean {
  if (!deviceName?.trim()) return false;
  return GARMIN_DEVICE_PATTERNS.some((pattern) => pattern.test(deviceName.trim()));
}
