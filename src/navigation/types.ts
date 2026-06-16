export type RootStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ResetPassword: undefined;
  NewPassword: { oobCode: string };
  ConnectTracker:
    | {
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
  StrengthAnalysing: { videoUri: string };
  StrengthResult: undefined;
  KnowledgeIntro: undefined;
  KnowledgeQuiz: undefined;
  KnowledgeAnalysing: undefined;
  KnowledgeResult: undefined;
  LevelReveal: undefined;
  HealthYears: undefined;
  FirstCycleRewards: undefined;
  Main: undefined;
};
