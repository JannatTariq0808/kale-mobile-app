import type { KnowledgeAssessmentMeta, QuestionSetQuestion } from '../types/questionSet';
import type { PlankAnalysisResult, PlankPoseSessionStats } from '../types/plankRecording';

export type RootStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ResetPassword: undefined;
  NewPassword: { oobCode: string };
  ConnectTracker:
    | {
        flow?: 'onboarding' | 'quarterly';
        activitiesSince?: string;
        assessmentId?: string;
        syncPeriodLabel?: string;
        garminCapped?: boolean;
        errorMessage?: string;
        errorReason?: string;
        errorProvider?: 'strava' | 'garmin';
        pendingToken?: string;
        oauthProvider?: 'strava' | 'garmin';
        oauthStatus?: 'connected' | 'error';
      }
    | undefined;
  CardioAnalysing: undefined;
  CardioResult: undefined;
  StrengthIntro: undefined;
  StrengthRecord: undefined;
  StrengthAnalysing: {
    videoUri: string;
    recordedDurationSec: number;
    poseStats?: PlankPoseSessionStats;
  };
  StrengthResult: {
    analysis: PlankAnalysisResult;
    videoUri: string;
    strengthAssessmentId?: string;
    elapsed_time: number;
    level: number;
  };
  KnowledgeIntro: undefined;
  KnowledgeQuiz: {
    setId: string;
    questions: QuestionSetQuestion[];
    meta: KnowledgeAssessmentMeta;
    assessmentId: string;
    startIndex?: number;
  };
  KnowledgeAnalysing: {
    assessmentId: string;
    setId: string;
    totalQuestions: number;
    meta: KnowledgeAssessmentMeta;
  };
  KnowledgeResult: {
    assessmentId: string;
    setId: string;
    totalQuestions: number;
    meta: KnowledgeAssessmentMeta;
  };
  LevelReveal: undefined;
  HealthYears: undefined;
  FirstCycleRewards: undefined;
  Main: undefined;
};
