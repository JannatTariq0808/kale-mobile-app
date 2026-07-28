import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import type { RunningYearsGoalPreset } from '../../types/runningYearsGoalPreset';
import { DraggableAgeSlider } from './DraggableAgeSlider';
import {
  RUNNING_YEARS_GOAL_AGE_MAX,
  RUNNING_YEARS_GOAL_AGE_MIN,
} from '../../config/runningYearsGoals';
import { lumen, sora } from '../../theme';

const GOAL_ICONS: Record<string, ComponentProps<typeof Ionicons>['name']> = {
  '10k-grandkids': 'walk-outline',
  'run-marathon': 'medal-outline',
  'cycle-30k-grandkids': 'bicycle-outline',
  'ride-sportive': 'bicycle-outline',
};

type GoalChipPickerProps = {
  presets: RunningYearsGoalPreset[];
  selectedId: string;
  onSelect: (goalId: string) => void;
};

export function GoalChipPicker({ presets, selectedId, onSelect }: GoalChipPickerProps) {
  return (
    <View style={styles.list}>
      {presets.map((goal) => {
        const selected = goal.id === selectedId;
        const iconName = GOAL_ICONS[goal.id] ?? 'heart-outline';
        return (
          <Pressable
            key={goal.id}
            onPress={() => onSelect(goal.id)}
            style={[styles.chip, selected && styles.chipSelected]}
          >
            <View style={[styles.iconBox, selected && styles.iconBoxSelected]}>
              <Ionicons
                name={iconName}
                size={18}
                color={selected ? '#003A38' : lumen.fgMuted}
              />
            </View>
            <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{goal.label}</Text>
            {selected ? (
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={12} color={lumen.lime} />
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

type TargetAgeSliderProps = {
  value: number;
  min?: number;
  max?: number;
  yearsFromNow?: number;
  onChange: (age: number) => void;
};

export function TargetAgeSlider({
  value,
  min = RUNNING_YEARS_GOAL_AGE_MIN,
  max = RUNNING_YEARS_GOAL_AGE_MAX,
  yearsFromNow,
  onChange,
}: TargetAgeSliderProps) {
  return (
    <DraggableAgeSlider
      value={value}
      min={min}
      max={max}
      onChange={onChange}
      showLargeValue
      yearsFromNow={yearsFromNow}
      labelMode="ends"
      variant="goal"
    />
  );
}

const styles = StyleSheet.create({
  list: { gap: 8, marginTop: 22 },
  chip: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: lumen.hairline,
    backgroundColor: 'rgba(234,243,228,0.05)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  chipSelected: { backgroundColor: lumen.lime, borderColor: lumen.lime },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(234,243,228,0.06)',
    flexShrink: 0,
  },
  iconBoxSelected: { backgroundColor: 'rgba(0,58,56,0.12)' },
  chipLabel: { ...sora('bold'), flex: 1, color: lumen.fg, fontSize: 15.5, lineHeight: 20 },
  chipLabelSelected: { color: '#003A38' },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#003A38',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
