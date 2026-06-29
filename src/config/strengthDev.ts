/** Dev-only: skip Claude/Gemini pose check (office testing without a plank). */
export function isStrengthDevSkipPoseCheck(): boolean {
  return (
    __DEV__ &&
    process.env.EXPO_PUBLIC_STRENGTH_DEV_SKIP_POSE_CHECK?.trim().toLowerCase() === 'true'
  );
}
