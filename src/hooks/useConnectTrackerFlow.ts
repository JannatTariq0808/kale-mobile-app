import { useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useRef } from 'react';
import {
  routeParamsToConnectIssue,
  type ConnectTrackerRouteParams,
} from '../navigation/trackerLinking';
import {
  buildConnectIssue,
  type ConnectIssueContent,
} from '../services/tracker/connectIssueCopy';
import { finishTrackerConnection } from '../services/tracker/connect';
import { isPendingTokenInFlight } from '../services/tracker/connectSession';
import { getActiveAssessmentFlowAsync } from '../services/assessment/assessmentFlowSession';
import type { AssessStravaOptions } from '../services/tracker/assess';

async function resolveAssessOptionsFromConnect(
  params: ConnectTrackerRouteParams,
): Promise<AssessStravaOptions | undefined> {
  const flow = await getActiveAssessmentFlowAsync();
  const options: AssessStravaOptions = {};
  if (params.activitiesSince) options.activitiesSince = params.activitiesSince;
  if (params.assessmentId) options.assessmentId = params.assessmentId;
  if (!options.activitiesSince && flow?.activitiesSince) {
    options.activitiesSince = flow.activitiesSince;
  }
  if (!options.assessmentId && flow?.assessmentId) {
    options.assessmentId = flow.assessmentId;
  }
  if (__DEV__) {
    console.log('[cardio-sync] oauth return assess options', {
      fromRoute: {
        activitiesSince: params.activitiesSince ?? null,
        assessmentId: params.assessmentId ?? null,
      },
      fromStorage: {
        activitiesSince: flow?.activitiesSince ?? null,
        assessmentId: flow?.assessmentId ?? null,
      },
      merged: options,
    });
  }
  return Object.keys(options).length > 0 ? options : undefined;
}

export function useConnectTrackerFlow(options: {
  setConnecting: (brand: 'strava' | 'garmin' | 'apple' | null) => void;
  setConnectIssue: (issue: ConnectIssueContent | null) => void;
  onSuccess: () => void;
}) {
  const route = useRoute();
  const processingParams = useRef(false);
  const handledParamKeys = useRef(new Set<string>());

  const applyRouteParams = useCallback(
    async (params: ConnectTrackerRouteParams) => {
      const key = JSON.stringify(params);
      if (processingParams.current || handledParamKeys.current.has(key)) return;
      if (
        !params.errorMessage &&
        !params.errorReason &&
        !(params.oauthStatus === 'connected' && params.pendingToken && params.oauthProvider)
      ) {
        return;
      }

      processingParams.current = true;
      handledParamKeys.current.add(key);

      try {
        const errorFromParams = routeParamsToConnectIssue(params);
        if (errorFromParams) {
          options.setConnecting(null);
          options.setConnectIssue(
            buildConnectIssue(
              errorFromParams.message,
              errorFromParams.provider,
              errorFromParams.reason,
            ),
          );
          return;
        }

        if (
          params.oauthStatus === 'connected' &&
          params.oauthProvider &&
          params.pendingToken
        ) {
          if (isPendingTokenInFlight(params.pendingToken)) {
            return;
          }
          options.setConnecting(params.oauthProvider);
          options.setConnectIssue(null);
          const assessOptions = await resolveAssessOptionsFromConnect(params);
          const result = await finishTrackerConnection(
            params.oauthProvider,
            params.pendingToken,
            assessOptions,
          );
          if (!result.ok) {
            if (!result.cancelled) {
              options.setConnectIssue(
                buildConnectIssue(result.message, result.provider, result.oauthReason),
              );
            }
            return;
          }
          options.onSuccess();
        }
      } finally {
        options.setConnecting(null);
        processingParams.current = false;
      }
    },
    [options.setConnectIssue, options.setConnecting, options.onSuccess],
  );

  useEffect(() => {
    const params = (route.params ?? {}) as ConnectTrackerRouteParams;
    void applyRouteParams(params);
  }, [applyRouteParams, route.params]);
}
