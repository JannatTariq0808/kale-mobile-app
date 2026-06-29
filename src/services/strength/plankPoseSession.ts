export type PlankFrameAnalysisError = 'network' | 'service' | 'auth' | 'quota';

export type PlankPoseFrameResult = {
  valid: boolean;
  confidence: number;
  error?: PlankFrameAnalysisError;
};

export type PlankPoseSessionStats = {
  sampledFrames: number;
  validFrames: number;
  estimatedValidHoldSec: number;
  sampleIntervalSec: number;
  networkErrors: number;
  serviceErrors: number;
  quotaErrors: number;
};

export class PlankPoseSession {
  private sampledFrames = 0;
  private validFrames = 0;
  private timer: ReturnType<typeof setInterval> | null = null;
  private active = false;
  private inFlight = false;
  private sampleIntervalMs = 1000;

  get liveValidFrames(): number {
    return this.validFrames;
  }

  get liveSampledFrames(): number {
    return this.sampledFrames;
  }

  start(
    sampleFn: () => Promise<PlankPoseFrameResult>,
    intervalMs: number,
  ): void {
    if (this.timer) return;
    this.active = true;
    this.sampleIntervalMs = intervalMs;

    this.timer = setInterval(() => {
      if (!this.active || this.inFlight) return;
      this.inFlight = true;
      void sampleFn()
        .then((result) => {
          this.sampledFrames += 1;
          if (result.valid) this.validFrames += 1;
        })
        .catch(() => {
          this.sampledFrames += 1;
        })
        .finally(() => {
          this.inFlight = false;
        });
    }, intervalMs);
  }

  stop(): PlankPoseSessionStats {
    this.active = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    const sampleIntervalSec = this.sampleIntervalMs / 1000;
    return {
      sampledFrames: this.sampledFrames,
      validFrames: this.validFrames,
      estimatedValidHoldSec: this.validFrames * sampleIntervalSec,
      sampleIntervalSec,
      networkErrors: 0,
      serviceErrors: 0,
      quotaErrors: 0,
    };
  }
}
