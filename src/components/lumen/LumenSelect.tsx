// Design: kale-mobile-design — kale-input select (screens/Auth.jsx)

import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { lumen, sora } from '../../theme';

export type LumenSelectOption = {
  label: string;
  value: string;
};

type LumenSelectProps = {
  label: string;
  value: string | null;
  options: LumenSelectOption[];
  placeholder?: string;
  onChange: (value: string) => void;
  style?: ViewStyle;
};

export function LumenSelect({
  label,
  value,
  options,
  placeholder = 'Select here',
  onChange,
  style,
}: LumenSelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);
  const hasValue = Boolean(selected);

  const handleSelect = (next: string) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <View style={style}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        onPress={() => setOpen(true)}
        style={[styles.fieldBox, hasValue ? styles.fieldBoxValid : null]}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Text style={[styles.value, !hasValue && styles.placeholder]}>
          {selected?.label ?? placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={lumen.fgMuted} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
            <Text style={styles.sheetTitle}>{label}</Text>
            {options.map((option) => {
              const active = option.value === value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => handleSelect(option.value)}
                  style={[styles.option, active && styles.optionActive]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.optionText, active && styles.optionTextActive]}>
                    {option.label}
                  </Text>
                  {active ? <Ionicons name="checkmark" size={18} color={lumen.mint} /> : null}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...sora('bold'),
    fontSize: 11,
    letterSpacing: 1.54,
    textTransform: 'uppercase',
    color: lumen.fgMuted,
    marginBottom: 8,
  },
  fieldBox: {
    minHeight: 54,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: lumen.hairline,
    backgroundColor: 'rgba(234,243,228,0.05)',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldBoxValid: {
    borderColor: '#3FD08B',
  },
  value: {
    ...sora('semibold'),
    flex: 1,
    fontSize: 16,
    color: lumen.fg,
  },
  placeholder: {
    color: lumen.fgFaint,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: lumen.bgDeep,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    borderWidth: 1,
    borderColor: lumen.hairline,
    gap: 8,
  },
  sheetTitle: {
    ...sora('bold'),
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: lumen.fgMuted,
    marginBottom: 8,
  },
  option: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: lumen.hairline,
    backgroundColor: 'rgba(234,243,228,0.05)',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionActive: {
    borderColor: lumen.mint,
    backgroundColor: 'rgba(0,200,150,0.12)',
  },
  optionText: {
    ...sora('semibold'),
    fontSize: 16,
    color: lumen.fgMuted,
  },
  optionTextActive: {
    color: lumen.fg,
  },
});
