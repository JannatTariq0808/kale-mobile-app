import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import type { PlankSetupGateStatus } from '../../hooks/usePlankSetupGate';
import type { PlankHintCode } from '../../services/strength/plankPoseSession';
import { lumen, lumenPillar, sora } from '../../theme';
import { resolvePlankSetupCue } from '../../utils/plankSetupHints';

type PlankSetupOverlayProps = {
  status: PlankSetupGateStatus;
  hints: PlankHintCode[];
  consecutiveValid: number;
  requiredValid: number;
  statusMessage: string;
  visible: boolean;
};

function arrowIconName(arrow: 'up' | 'down' | 'back' | 'none'): keyof typeof Ionicons.glyphMap {
  if (arrow === 'up') return 'arrow-up';
  if (arrow === 'down') return 'arrow-down';
  if (arrow === 'back') return 'arrow-back';
  return 'scan-outline';
}

export function PlankSetupOverlay({
  status,
  hints,
  consecutiveValid,
  requiredValid,
  statusMessage,
  visible,
}: PlankSetupOverlayProps) {
  if (!visible) return null;

  const locked = status === 'locked';
  const cue = locked
    ? {
        title: 'Position locked',
        detail: 'Hold this form when you record.',
        arrow: 'none' as const,
      }
    : resolvePlankSetupCue(hints);

  return (
    <View style={styles.wrap} pointerEvents="none">
      <View style={[styles.frameGuide, locked ? styles.frameGuideLocked : null]}>
        <View style={styles.bodyLine}>
          <View style={styles.jointHead} />
          <View style={styles.jointShoulder} />
          <View style={styles.jointHip} />
          <View style={styles.jointAnkle} />
        </View>
        <View style={styles.phoneHint}>
          <Ionicons name="phone-portrait-outline" size={16} color="rgba(234,243,228,0.65)" />
          <Text style={styles.phoneHintText}>Phone here</Text>
        </View>
        <Text style={styles.frameLabel}>Side view — full body horizontal</Text>
      </View>

      {!locked && cue.arrow !== 'none' ? (
        <View style={styles.arrowBadge}>
          <Ionicons name={arrowIconName(cue.arrow)} size={28} color={lumen.bgDark} />
        </View>
      ) : null}

      {locked ? (
        <View style={styles.lockedBadge}>
          <Ionicons name="checkmark-circle" size={42} color={lumen.lime} />
        </View>
      ) : null}

      <View style={styles.cueCard}>
        <Text style={styles.cueEyebrow}>Position check</Text>
        <Text style={styles.cueTitle}>{cue.title}</Text>
        <Text style={styles.cueDetail}>
          {status === 'adjusting' || status === 'capture_error' ? cue.detail : statusMessage}
        </Text>

        <View style={styles.progressRow}>
          {Array.from({ length: requiredValid }, (_, index) => {
            const filled = locked || index < consecutiveValid;
            return (
              <View
                key={index}
                style={[styles.progressDot, filled ? styles.progressDotFilled : null]}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  frameGuide: {
    alignSelf: 'center',
    width: '94%',
    height: '30%',
    marginTop: '8%',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(234,243,228,0.55)',
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 18,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  frameGuideLocked: {
    borderColor: lumen.lime,
    borderStyle: 'solid',
    backgroundColor: 'rgba(122,255,90,0.08)',
  },
  bodyLine: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: '78%',
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(234,243,228,0.28)',
  },
  jointHead: {
    position: 'absolute',
    left: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(234,243,228,0.75)',
    top: -3,
  },
  jointShoulder: {
    position: 'absolute',
    left: '22%',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: lumenPillar.strength,
    top: -4,
  },
  jointHip: {
    position: 'absolute',
    left: '52%',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: lumenPillar.strength,
    top: -4,
  },
  jointAnkle: {
    position: 'absolute',
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(234,243,228,0.75)',
    top: -3,
  },
  phoneHint: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  phoneHintText: {
    ...sora('bold'),
    fontSize: 9,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: 'rgba(234,243,228,0.65)',
  },
  frameLabel: {
    position: 'absolute',
    top: 8,
    left: 12,
    ...sora('bold'),
    fontSize: 10,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: 'rgba(234,243,228,0.7)',
  },
  arrowBadge: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: lumen.lime,
  },
  lockedBadge: {
    position: 'absolute',
    top: '38%',
    alignSelf: 'center',
  },
  cueCard: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 168,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.62)',
    borderWidth: 1,
    borderColor: lumen.hairline,
  },
  cueEyebrow: {
    ...sora('bold'),
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: lumenPillar.strength,
  },
  cueTitle: {
    ...sora('extrabold'),
    marginTop: 4,
    fontSize: 18,
    color: lumen.fg,
  },
  cueDetail: {
    ...sora('semibold'),
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: lumen.fgMuted,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(234,243,228,0.2)',
  },
  progressDotFilled: {
    backgroundColor: lumen.lime,
  },
});
