// Design: kale-mobile-design — LumenField (screens/KaleLumen.jsx)

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { lumen, sora } from '../../theme';

const FIELD_VALID = '#3FD08B';
/** Design: paddingRight 44 (icon only) vs 96 (show + icon) */
const TRAILING_WIDTH = { default: 44, reveal: 96 } as const;

type FieldStatus = 'neutral' | 'pending' | 'valid' | 'invalid';

type LumenFieldProps = {
  label: string;
  value?: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  validate?: (value: string) => boolean;
  canReveal?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  returnKeyType?: TextInputProps['returnKeyType'];
  onSubmitEditing?: TextInputProps['onSubmitEditing'];
  onFocus?: TextInputProps['onFocus'];
  onBlur?: TextInputProps['onBlur'];
  blurOnSubmit?: boolean;
  style?: ViewStyle;
};

function fieldStatus(value: string, focused: boolean, validate?: (value: string) => boolean): FieldStatus {
  if (value.length === 0) {
    return focused ? 'pending' : 'neutral';
  }

  const isValid = validate ? validate(value) : value.trim().length > 0;
  if (isValid) return 'valid';
  return 'invalid';
}

const borderTone: Record<FieldStatus, string> = {
  neutral: lumen.hairline,
  pending: lumen.yellow,
  valid: FIELD_VALID,
  invalid: lumen.coral,
};

const glowTone: Record<FieldStatus, string | undefined> = {
  neutral: undefined,
  pending: lumen.yellow,
  valid: FIELD_VALID,
  invalid: lumen.coral,
};

function FieldStatusIcon({ status }: { status: FieldStatus }) {
  if (status === 'valid') {
    return (
      <Svg width={18} height={18} viewBox="0 0 18 18">
        <Circle cx={9} cy={9} r={9} fill={FIELD_VALID} />
        <Path
          d="M4.5 9.2L7.6 12L13 6"
          stroke="#04413E"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    );
  }

  if (status === 'invalid') {
    return (
      <Svg width={18} height={18} viewBox="0 0 18 18">
        <Circle cx={9} cy={9} r={9} fill={lumen.coral} />
        <Path d="M5.5 5.5l7 7M12.5 5.5l-7 7" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
      </Svg>
    );
  }

  if (status === 'pending') {
    return <View style={styles.pendingDot} />;
  }

  return null;
}

export const LumenField = forwardRef<TextInput, LumenFieldProps>(function LumenField(
  {
    label,
    value = '',
    onChangeText,
    placeholder,
    validate,
    canReveal = false,
    keyboardType = 'default',
    autoCapitalize = 'none',
    returnKeyType,
    onSubmitEditing,
    onFocus,
    onBlur,
    blurOnSubmit = true,
    style,
  },
  forwardedRef,
) {
  const inputRef = useRef<TextInput>(null);
  const [text, setText] = useState(value);
  const [focused, setFocused] = useState(false);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    setText(value);
  }, [value]);

  useImperativeHandle(forwardedRef, () => inputRef.current as TextInput);

  const handleChange = (next: string) => {
    setText(next);
    onChangeText?.(next);
  };

  const status = useMemo(() => fieldStatus(text, focused, validate), [text, focused, validate]);
  const glow = glowTone[status];
  const revealColor = status === 'invalid' ? lumen.coral : lumen.green;
  const trailingWidth = canReveal ? TRAILING_WIDTH.reveal : TRAILING_WIDTH.default;

  const toggleReveal = () => {
    setReveal((r) => !r);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const glowStyle =
    glow &&
    (Platform.OS === 'ios'
      ? {
          shadowColor: glow,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.35,
          shadowRadius: 10,
        }
      : null);

  return (
    <View style={style}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[styles.fieldBox, { borderColor: borderTone[status] }, glowStyle]}
      >
        <TextInput
          ref={inputRef}
          value={text}
          onChangeText={handleChange}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          placeholder={placeholder}
          placeholderTextColor={lumen.fgFaint}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          secureTextEntry={canReveal && !reveal}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={blurOnSubmit}
          style={styles.input}
        />
        <View style={[styles.trailing, { width: trailingWidth }]}>
          {canReveal ? (
            <Pressable
              onPress={toggleReveal}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel={reveal ? 'Hide password' : 'Show password'}
            >
              <Text style={[styles.reveal, { color: revealColor }]}>{reveal ? 'Hide' : 'Show'}</Text>
            </Pressable>
          ) : null}
          <FieldStatusIcon status={status} />
        </View>
      </View>
    </View>
  );
});

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
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderRadius: 14,
    borderWidth: 1.5,
    backgroundColor: 'rgba(234,243,228,0.05)',
    overflow: 'hidden',
  },
  input: {
    ...sora('semibold'),
    flex: 1,
    height: '100%',
    paddingLeft: 16,
    paddingRight: 8,
    fontSize: 16,
    color: lumen.fg,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
    paddingRight: 14,
    flexShrink: 0,
  },
  reveal: {
    ...sora('bold'),
    fontSize: 13,
  },
  pendingDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: lumen.yellow,
    shadowColor: lumen.yellow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
  },
});
