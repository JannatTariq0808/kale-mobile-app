import { useEffect, useState } from 'react';
import { fetchRunningYearsGoalPresets } from '../services/runningYears/fetchRunningYearsGoalPresets';
import type { RunningYearsGoalPreset } from '../types/runningYearsGoalPreset';

export function useRunningYearsGoalPresets() {
  const [items, setItems] = useState<RunningYearsGoalPreset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchRunningYearsGoalPresets()
      .then((presets) => {
        if (!cancelled) setItems(presets);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { items, loading };
}
