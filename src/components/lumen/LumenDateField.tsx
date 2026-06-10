import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { lumen, sora } from '../../theme';

type LumenDateFieldProps = {
  label: string;
  value: Date | null;
  onChange: (value: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  style?: ViewStyle;
};

function formatDob(date: Date) {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function LumenDateField({
  label,
  value,
  onChange,
  minimumDate,
  maximumDate,
  style,
}: LumenDateFieldProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value ?? maximumDate ?? new Date());

  const openPicker = () => {
    setDraft(value ?? maximumDate ?? new Date());
    setOpen(true);
  };

  const handleChange = (_event: DateTimePickerEvent, next?: Date) => {
    if (Platform.OS === 'android') {
      setOpen(false);
      if (next) onChange(next);
      return;
    }
    if (next) setDraft(next);
  };

  const confirmIos = () => {
    onChange(draft);
    setOpen(false);
  };

  return (
    <View style={style}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        onPress={openPicker}
        style={[styles.fieldBox, value ? styles.fieldBoxValid : null]}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Text style={[styles.value, !value && styles.placeholder]}>
          {value ? formatDob(value) : 'Select date'}
        </Text>
        <Ionicons name="calendar-outline" size={18} color={lumen.fgMuted} />
      </Pressable>

      {Platform.OS === 'android' && open ? (
        <DateTimePicker
          value={draft}
          mode="date"
          display="default"
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onChange={handleChange}
        />
      ) : null}

      {Platform.OS === 'ios' ? (
        <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
          <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
            <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
              <Text style={styles.sheetTitle}>{label}</Text>
              <DateTimePicker
                value={draft}
                mode="date"
                display="spinner"
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                onChange={handleChange}
                textColor={lumen.fg}
                themeVariant="dark"
              />
              <Pressable onPress={confirmIos} style={styles.doneButton} accessibilityRole="button">
                <Text style={styles.doneText}>Done</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}
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
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 28,
    borderWidth: 1,
    borderColor: lumen.hairline,
  },
  sheetTitle: {
    ...sora('bold'),
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: lumen.fgMuted,
    marginBottom: 4,
    paddingHorizontal: 8,
  },
  doneButton: {
    marginTop: 8,
    minHeight: 48,
    borderRadius: 999,
    backgroundColor: lumen.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneText: {
    ...sora('bold'),
    fontSize: 16,
    color: lumen.bgDark,
  },
});
