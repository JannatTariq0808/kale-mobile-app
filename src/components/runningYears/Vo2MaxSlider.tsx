import { useEffect, useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
} from 'react-native';
import { lumen, sora } from '../../theme';

const VO2_MIN = 20;
const VO2_MAX = 70;
const THUMB_SIZE = 24;
const THUMB_RADIUS = THUMB_SIZE / 2;
const TRACK_HEIGHT = 5;
const LANE_HEIGHT = 40;
const TRACK_TOP = (LANE_HEIGHT - TRACK_HEIGHT) / 2;
const THUMB_TOP = (LANE_HEIGHT - THUMB_SIZE) / 2;

type Vo2MaxSliderProps = {
  value: number;
  min?: number;
  max?: number;
  onChange: (vo2: number) => void;
};

function clampVo2(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(value)));
}

export function Vo2MaxSlider({
  value,
  min = VO2_MIN,
  max = VO2_MAX,
  onChange,
}: Vo2MaxSliderProps) {
  const trackWidthRef = useRef(0);
  const ratioAtGrantRef = useRef(0);
  const latestRef = useRef(value);
  const [trackWidth, setTrackWidth] = useState(0);

  const clamped = clampVo2(value, min, max);
  const ratio = max <= min ? 0 : (clamped - min) / (max - min);

  useEffect(() => {
    latestRef.current = clamped;
  }, [clamped]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onShouldBlockNativeResponder: () => true,
        onPanResponderGrant: (event: GestureResponderEvent) => {
          const width = trackWidthRef.current;
          if (width <= 0) return;
          const tapRatio = Math.min(1, Math.max(0, event.nativeEvent.locationX / width));
          ratioAtGrantRef.current = tapRatio;
          const next = clampVo2(min + tapRatio * (max - min), min, max);
          latestRef.current = next;
          onChange(next);
        },
        onPanResponderMove: (_event, gestureState) => {
          const width = trackWidthRef.current;
          if (width <= 0) return;
          const nextRatio = Math.min(
            1,
            Math.max(0, ratioAtGrantRef.current + gestureState.dx / width),
          );
          const next = clampVo2(min + nextRatio * (max - min), min, max);
          latestRef.current = next;
          onChange(next);
        },
      }),
    [min, max, onChange],
  );

  const onTrackLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    trackWidthRef.current = width;
    setTrackWidth(width);
  };

  const thumbTravel = Math.max(0, trackWidth - THUMB_SIZE);
  const thumbLeft = ratio * thumbTravel;
  const fillWidth = Math.max(THUMB_RADIUS, thumbLeft + THUMB_RADIUS);

  return (
    <View style={styles.block}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>YOUR VO₂MAX</Text>
        <Text style={styles.value}>
          {clamped}
          <Text style={styles.unit}> ml/kg/min</Text>
        </Text>
      </View>
      <Text style={styles.hint}>Drag to explore how fitness changes your curve</Text>

      <View
        style={styles.trackLane}
        onLayout={onTrackLayout}
        {...panResponder.panHandlers}
        accessibilityRole="adjustable"
        accessibilityValue={{ min, max, now: clamped }}
      >
        <View style={styles.trackBase} />
        {trackWidth > 0 ? (
          <>
            <View style={[styles.trackFill, { width: fillWidth }]} />
            <View style={[styles.thumb, { left: thumbLeft }]} />
          </>
        ) : null}
      </View>

      <View style={styles.labels}>
        <Text style={styles.label}>{min}</Text>
        <Text style={styles.label}>{max}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    marginBottom: 10,
    gap: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
  },
  eyebrow: {
    ...sora('bold'),
    color: lumen.fgMuted,
    fontSize: 10.5,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  value: {
    ...sora('bold'),
    color: lumen.lime,
    fontSize: 22,
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
  },
  unit: {
    ...sora('semibold'),
    color: lumen.fgMuted,
    fontSize: 12,
  },
  hint: {
    ...sora('regular'),
    color: lumen.fgMuted,
    fontSize: 11.5,
    marginTop: 4,
    marginBottom: 8,
  },
  trackLane: {
    width: '100%',
    height: LANE_HEIGHT,
    position: 'relative',
  },
  trackBase: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: TRACK_TOP,
    height: TRACK_HEIGHT,
    borderRadius: 999,
    backgroundColor: 'rgba(234,243,228,0.16)',
  },
  trackFill: {
    position: 'absolute',
    left: 0,
    top: TRACK_TOP,
    height: TRACK_HEIGHT,
    backgroundColor: lumen.lime,
    borderRadius: 999,
    zIndex: 1,
  },
  thumb: {
    position: 'absolute',
    top: THUMB_TOP,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_RADIUS,
    backgroundColor: lumen.lime,
    borderWidth: 3,
    borderColor: '#04413E',
    zIndex: 2,
    elevation: 4,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  label: {
    ...sora('bold'),
    color: lumen.fgMuted,
    fontSize: 11,
  },
});
