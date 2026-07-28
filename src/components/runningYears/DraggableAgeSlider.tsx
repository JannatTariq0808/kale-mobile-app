import { useEffect, useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
} from 'react-native';
import {
  RUNNING_YEARS_GOAL_AGE_DEFAULT,
  RUNNING_YEARS_GOAL_AGE_MAX,
  RUNNING_YEARS_GOAL_AGE_MIN,
} from '../../config/runningYearsGoals';
import { lumen, sora } from '../../theme';

type DraggableAgeSliderProps = {
  value: number;
  min?: number;
  max?: number;
  onChange?: (age: number) => void;
  onChangeEnd?: (age: number) => void;
  showLargeValue?: boolean;
  labelMode?: 'anchors' | 'ends' | 'main-fixed';
  yearsFromNow?: number;
  variant?: 'goal' | 'main';
  /** Display-only — no drag; use Change button to edit goal. */
  readOnly?: boolean;
};

function clampAge(age: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(age)));
}

function ageFromRatio(ratio: number, min: number, max: number): number {
  return clampAge(min + ratio * (max - min), min, max);
}

function ratioFromAge(age: number, min: number, max: number): number {
  if (max <= min) return 0;
  return (clampAge(age, min, max) - min) / (max - min);
}

const THUMB_SIZE = 24;
const THUMB_RADIUS = THUMB_SIZE / 2;
const TRACK_HEIGHT = 5;
const LANE_HEIGHT = 40;
const TRACK_TOP = (LANE_HEIGHT - TRACK_HEIGHT) / 2;
const THUMB_TOP = (LANE_HEIGHT - THUMB_SIZE) / 2;
const THUMB_BORDER = '#04413E';

export function DraggableAgeSlider({
  value,
  min = RUNNING_YEARS_GOAL_AGE_MIN,
  max = RUNNING_YEARS_GOAL_AGE_MAX,
  onChange,
  onChangeEnd,
  showLargeValue = false,
  labelMode = 'anchors',
  yearsFromNow,
  variant = 'main',
  readOnly = false,
}: DraggableAgeSliderProps) {
  const trackWidthRef = useRef(0);
  const ratioAtGrantRef = useRef(0);
  const latestAgeRef = useRef(value);
  const [trackWidth, setTrackWidth] = useState(0);

  const clamped = clampAge(value, min, max);
  const ratio = ratioFromAge(clamped, min, max);

  useEffect(() => {
    latestAgeRef.current = clamped;
  }, [clamped]);

  const panResponder = useMemo(
    () =>
      readOnly
        ? PanResponder.create({})
        : PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderTerminationRequest: () => false,
            onShouldBlockNativeResponder: () => true,
            onPanResponderGrant: (event: GestureResponderEvent) => {
              const width = trackWidthRef.current;
              if (width <= 0) return;
              const tapRatio = Math.min(1, Math.max(0, event.nativeEvent.locationX / width));
              ratioAtGrantRef.current = tapRatio;
              const nextAge = ageFromRatio(tapRatio, min, max);
              latestAgeRef.current = nextAge;
              onChange?.(nextAge);
            },
            onPanResponderMove: (_event, gestureState) => {
              const width = trackWidthRef.current;
              if (width <= 0) return;
              const nextRatio = Math.min(
                1,
                Math.max(0, ratioAtGrantRef.current + gestureState.dx / width),
              );
              const nextAge = ageFromRatio(nextRatio, min, max);
              latestAgeRef.current = nextAge;
              onChange?.(nextAge);
            },
            onPanResponderRelease: () => {
              onChangeEnd?.(latestAgeRef.current);
            },
          }),
    [min, max, onChange, onChangeEnd, readOnly],
  );

  const onTrackLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    trackWidthRef.current = width;
    setTrackWidth(width);
  };

  const thumbTravel = Math.max(0, trackWidth - THUMB_SIZE);
  const thumbLeft = ratio * thumbTravel;
  const fillWidth = Math.max(THUMB_RADIUS, thumbLeft + THUMB_RADIUS);

  const labelAges =
    labelMode === 'ends'
      ? [min, RUNNING_YEARS_GOAL_AGE_DEFAULT, max]
      : labelMode === 'main-fixed'
        ? [min, RUNNING_YEARS_GOAL_AGE_DEFAULT, max]
        : [min, clamped, max];

  const trackMarginTop = showLargeValue ? (variant === 'goal' ? 14 : 8) : 0;
  const isMainVariant = variant === 'main' && !showLargeValue;

  return (
    <View style={styles.block}>
      {showLargeValue ? (
        <View style={styles.valueBlock}>
          <Text style={styles.sliderEyebrow}>I want to do this at</Text>
          <View style={styles.valueRow}>
            <View style={styles.ageCol}>
              <Text style={styles.sliderValue}>{clamped}</Text>
              <Text style={styles.yearsOld}>years old</Text>
            </View>
            {yearsFromNow != null ? (
              <Text style={styles.yearsFromNow} numberOfLines={2}>
                {yearsFromNow} years from now
              </Text>
            ) : null}
          </View>
        </View>
      ) : null}

      <View
        style={[
          styles.trackLane,
          { marginTop: trackMarginTop },
          isMainVariant && styles.trackLaneMain,
        ]}
        onLayout={onTrackLayout}
        {...(readOnly ? {} : panResponder.panHandlers)}
        accessibilityRole={readOnly ? 'text' : 'adjustable'}
        accessibilityValue={{ min, max, now: clamped }}
        pointerEvents={readOnly ? 'none' : 'auto'}
      >
        <View style={[styles.trackBase, isMainVariant && styles.trackBaseMain]} />
        {trackWidth > 0 ? (
          <>
            <View
              style={[
                styles.trackFill,
                isMainVariant && styles.trackFillMain,
                { width: fillWidth },
              ]}
            />
            <View
              style={[
                styles.thumb,
                isMainVariant && styles.thumbMain,
                { left: thumbLeft },
              ]}
            />
          </>
        ) : null}
      </View>

      <View style={styles.labels}>
        {labelAges.map((age, index) => (
          <Text
            key={`${labelMode}-${age}-${index}`}
            style={[
              styles.label,
              labelMode === 'anchors' && age === clamped && styles.labelActive,
              labelMode === 'main-fixed' && age === clamped && styles.labelActive,
            ]}
          >
            {labelMode === 'anchors' ? `at ${age}` : String(age)}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: 0 },
  valueBlock: { gap: 0 },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  ageCol: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    flexShrink: 0,
  },
  sliderEyebrow: {
    ...sora('bold'),
    color: lumen.fgMuted,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  sliderValue: {
    ...sora('bold'),
    color: lumen.lime,
    fontSize: 54,
    letterSpacing: -1.5,
    lineHeight: 58,
  },
  yearsOld: {
    ...sora('bold'),
    color: lumen.fg,
    fontSize: 14,
    lineHeight: 20,
    paddingBottom: 6,
  },
  yearsFromNow: {
    ...sora('regular'),
    color: lumen.fgMuted,
    fontSize: 12.5,
    lineHeight: 18,
    textAlign: 'right',
    paddingBottom: 6,
    flexShrink: 1,
    maxWidth: 132,
  },
  trackLane: {
    width: '100%',
    height: LANE_HEIGHT,
    position: 'relative',
  },
  trackLaneMain: {
    marginHorizontal: -2,
    paddingHorizontal: 2,
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
  trackBaseMain: {
    backgroundColor: 'rgba(4,65,62,0.28)',
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
  trackFillMain: {
    backgroundColor: lumen.lime,
    shadowColor: '#04413E',
    shadowOpacity: 0.35,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  thumb: {
    position: 'absolute',
    top: THUMB_TOP,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_RADIUS,
    backgroundColor: lumen.lime,
    borderWidth: 3,
    borderColor: THUMB_BORDER,
    zIndex: 2,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  thumbMain: {
    elevation: 6,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  label: {
    ...sora('bold'),
    color: lumen.fgMuted,
    fontSize: 11,
  },
  labelActive: {
    color: lumen.lime,
  },
});
