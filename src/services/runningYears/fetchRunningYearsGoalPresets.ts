import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { isFirebaseConfigured } from '../../config/firebase';
import {
  RUNNING_YEARS_GOAL_PRESETS,
  sportForGoalId,
  type RunningYearsSport,
} from '../../config/runningYearsGoals';
import { getFirebaseFirestore } from '../auth/firebaseApp';
import type { RunningYearsGoalPreset } from '../../types/runningYearsGoalPreset';

function readSport(data: Record<string, unknown>, presetId: string): RunningYearsSport {
  const raw = typeof data.sport === 'string' ? data.sport.trim().toLowerCase() : '';
  if (raw === 'cycling' || raw === 'running') return raw;
  return sportForGoalId(presetId);
}

function mapDoc(id: string, data: Record<string, unknown>): RunningYearsGoalPreset | null {
  const label = typeof data.label === 'string' ? data.label.trim() : '';
  const sortOrder = typeof data.sortOrder === 'number' ? data.sortOrder : 0;
  const active = data.active !== false;
  const presetId = typeof data.presetId === 'string' ? data.presetId.trim() : id;

  if (!label || !active) return null;
  return { id: presetId, label, sortOrder, sport: readSport(data, presetId), active };
}

/**
 * Canonical goal list comes from bundled config so product changes ship with the app.
 * Firestore can override label/sort for known ids after re-seed.
 */
export async function fetchRunningYearsGoalPresets(): Promise<RunningYearsGoalPreset[]> {
  const fallback = RUNNING_YEARS_GOAL_PRESETS.map((item, index) => ({
    id: item.id,
    label: item.label,
    sortOrder: index + 1,
    sport: item.sport,
    active: true,
  }));

  if (!isFirebaseConfigured()) return fallback;

  try {
    const snap = await getDocs(
      query(collection(getFirebaseFirestore(), 'runningYearsGoals'), orderBy('sortOrder', 'asc')),
    );
    const fromFirestore = snap.docs
      .map((doc) => mapDoc(doc.id, doc.data() as Record<string, unknown>))
      .filter((item): item is RunningYearsGoalPreset => item !== null);

    if (fromFirestore.length === 0) return fallback;

    const byId = new Map(fromFirestore.map((item) => [item.id, item]));
    const knownIds = new Set(RUNNING_YEARS_GOAL_PRESETS.map((item) => item.id));

    // Prefer canonical ids; drop retired goals still sitting in Firestore.
    return RUNNING_YEARS_GOAL_PRESETS.map((item, index) => {
      const override = byId.get(item.id);
      return {
        id: item.id,
        label: override?.label ?? item.label,
        sortOrder: override?.sortOrder ?? index + 1,
        sport: override?.sport ?? item.sport,
        active: true,
      };
    }).sort((a, b) => a.sortOrder - b.sortOrder)
      .filter((item) => knownIds.has(item.id));
  } catch {
    return fallback;
  }
}
