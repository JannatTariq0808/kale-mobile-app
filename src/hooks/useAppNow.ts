import { useEffect, useRef, useState } from 'react';
import { homeDemo } from '../data/homeDemo';

function parseTestNow(value: string): Date {
  // Date-only strings are local midnight — not UTC (ISO `YYYY-MM-DD` parses as UTC in JS).
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day, 0, 0, 0, 0);
  }
  return new Date(value);
}

function getTestAnchorMs(): number | null {
  return homeDemo.testNow ? parseTestNow(homeDemo.testNow).getTime() : null;
}

/** Real clock, or frozen `homeDemo.testNow` when set (no tick). */
export function resolveAppNow(): Date {
  const anchorMs = getTestAnchorMs();
  if (anchorMs !== null) {
    return new Date(anchorMs);
  }
  return new Date();
}

/**
 * Current app time. When `tick` is true, updates every second.
 * With `homeDemo.testNow` set, the test date advances in real time from mount
 * so the live countdown still runs during QA.
 */
export function useAppNow(tick = false): Date {
  const [stamp, setStamp] = useState(0);
  const mountMs = useRef(Date.now());
  const testAnchorMs = useRef(getTestAnchorMs());

  useEffect(() => {
    if (!tick) return undefined;
    const id = setInterval(() => setStamp((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [tick]);

  void stamp;

  if (testAnchorMs.current !== null) {
    if (tick) {
      return new Date(testAnchorMs.current + (Date.now() - mountMs.current));
    }
    return new Date(testAnchorMs.current);
  }

  return new Date();
}
