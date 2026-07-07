export type QuoteKalettes = {
  balance: number;
  pending: number;
};

function readPointsField(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;
}

/** Banked + pending Kalettes stored on the active `quotes/{id}` document. */
export function readQuoteKalettes(data: Record<string, unknown> | undefined): QuoteKalettes {
  if (!data) {
    return { balance: 0, pending: 0 };
  }

  return {
    balance: readPointsField(data.kalettesBalance ?? data.kalettes_balance),
    pending: readPointsField(data.kalettesPending ?? data.kalettes_pending),
  };
}
