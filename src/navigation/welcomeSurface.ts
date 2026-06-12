/** Welcome has fully mounted at least once — skip deferrals on return (e.g. logout pop). */
export let welcomeSurfaceReady = false;

export function markWelcomeSurfaceReady() {
  welcomeSurfaceReady = true;
}
