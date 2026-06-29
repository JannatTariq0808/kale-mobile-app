import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { LumenButton } from '../lumen/LumenButton';
import type { PlankValidationResult } from '../../services/strength/validatePlankRecording';
import type { PlankPoseSessionStats } from '../../services/strength/plankPoseSession';
import { lumen, lumenPillar, sora } from '../../theme';
import { formatPlankDuration } from '../../utils/formatPlankDuration';

type PlankRecordingReviewModalProps = {
  visible: boolean;
  durationSec: number;
  poseStats: PlankPoseSessionStats;
  validation: PlankValidationResult;
  onSubmit: () => void;
  onRecordAgain: () => void;
};

export function PlankRecordingReviewModal({
  visible,
  durationSec,
  poseStats,
  validation,
  onSubmit,
  onRecordAgain,
}: PlankRecordingReviewModalProps) {
  const holdLabel = formatPlankDuration(durationSec);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRecordAgain}>
      <Pressable style={styles.backdrop} onPress={onRecordAgain}>
        <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          <Text style={styles.eyebrow}>Strength · Plank</Text>
          <Text style={styles.title}>
            {validation.ok
              ? 'Submit this recording?'
              : validation.reason === 'analysis_unavailable'
                ? "Can't check your form"
                : 'Plank not detected'}
          </Text>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Hold time</Text>
            <Text style={styles.statValue}>{holdLabel}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Form check</Text>
            <Text style={styles.statValue}>
              {poseStats.validFrames}/{poseStats.sampledFrames} valid frames
            </Text>
          </View>

          <Text style={[styles.message, validation.ok ? styles.messageOk : styles.messageError]}>
            {validation.message}
          </Text>

          {validation.ok ? (
            <View style={styles.actions}>
              <LumenButton onPress={onSubmit}>Confirm & submit</LumenButton>
              <Pressable onPress={onRecordAgain} style={styles.secondaryBtn}>
                <Text style={styles.secondaryText}>Record again</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.actions}>
              <LumenButton onPress={onRecordAgain}>Record again</LumenButton>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: lumen.bgDeep,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 1,
    borderColor: lumen.hairline,
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 32,
  },
  eyebrow: {
    ...sora('bold'),
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: lumenPillar.strength,
  },
  title: {
    ...sora('extrabold'),
    marginTop: 10,
    fontSize: 26,
    lineHeight: 30,
    letterSpacing: -0.6,
    color: lumen.fg,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: lumen.hairline,
  },
  statLabel: {
    ...sora('semibold'),
    fontSize: 14,
    color: lumen.fgMuted,
  },
  statValue: {
    ...sora('bold'),
    fontSize: 16,
    color: lumen.fg,
    fontVariant: ['tabular-nums'],
  },
  message: {
    ...sora('semibold'),
    marginTop: 16,
    fontSize: 14,
    lineHeight: 21,
  },
  messageOk: {
    color: lumen.fgMuted,
  },
  messageError: {
    color: lumen.coral,
  },
  actions: {
    marginTop: 22,
    gap: 14,
  },
  secondaryBtn: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  secondaryText: {
    ...sora('semibold'),
    fontSize: 14,
    color: lumen.fgMuted,
    textDecorationLine: 'underline',
  },
});
