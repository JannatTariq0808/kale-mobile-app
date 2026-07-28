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
  isLandscape: boolean;
};

function arrowIconName(arrow: 'up' | 'down' | 'back' | 'none'): keyof typeof Ionicons.glyphMap {
  if (arrow === 'up') return 'arrow-up';
  if (arrow === 'down') return 'arrow-down';
  if (arrow === 'back') return 'arrow-back';
  return 'scan-outline';
}

/** Frame guide only — detection / recording chrome lives on the screen. */
export function PlankSetupOverlay({
  status,
  hints,
  visible,
  isLandscape,
}: PlankSetupOverlayProps) {
  if (!visible) return null;

  const locked = status === 'locked';
  const cue = locked
    ? { title: 'Position locked', detail: '', arrow: 'none' as const }
    : resolvePlankSetupCue(hints);

  return (
    <View
      style={[styles.wrap, isLandscape ? styles.wrapLandscape : null]}
      pointerEvents="none"
    >
      <View
        style={[
          styles.frameGuide,
          isLandscape ? styles.frameGuideLandscape : null,
          locked ? styles.frameGuideLocked : null,
        ]}
      >
        <Text style={styles.frameLabel} numberOfLines={1}>
          Side view · full body
        </Text>

        <View style={[styles.bodyLine, isLandscape ? styles.bodyLineLandscape : null]}>
          <View style={styles.jointHead} />
          <View style={styles.jointShoulder} />
          <View style={styles.jointHip} />
          <View style={styles.jointAnkle} />
        </View>

        {!locked && cue.arrow !== 'none' ? (
          <View style={styles.arrowBadge}>
            <Ionicons name={arrowIconName(cue.arrow)} size={26} color={lumen.bgDark} />
          </View>
        ) : null}

        {locked ? (
          <View style={styles.lockedBadge}>
            <Ionicons name="checkmark-circle" size={40} color={lumen.lime} />
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    minHeight: 0,
    width: '100%',
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 10,
  },
  wrapLandscape: {
    paddingHorizontal: 0,
    paddingTop: 2,
    paddingBottom: 2,
  },
  frameGuide: {
    flex: 1,
    minHeight: 120,
    width: '100%',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(234,243,228,0.55)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
    backgroundColor: 'rgba(0,0,0,0.12)',
    overflow: 'hidden',
  },
  frameGuideLandscape: {
    flexGrow: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
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
  bodyLineLandscape: {
    width: '88%',
    height: 5,
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
  frameLabel: {
    position: 'absolute',
    top: 10,
    left: 12,
    right: 12,
    ...sora('bold'),
    fontSize: 10,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: 'rgba(234,243,228,0.7)',
  },
  arrowBadge: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: lumen.lime,
  },
  lockedBadge: {
    position: 'absolute',
  },
});
