// Design: kale-mobile-design — LumHeader profile (screens/KaleLumenApp.jsx)

import { StyleSheet, Text, View } from 'react-native';
import { lumen, sora } from '../../theme';

type ProfileAvatarProps = {
  initials?: string;
  size?: number;
};

/** Local placeholder avatar — mint/teal gradient feel, no photo upload. */
export function ProfileAvatar({ initials = 'AP', size = 36 }: ProfileAvatarProps) {
  return (
    <View
      style={[
        styles.outer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <View style={[styles.inner, { borderRadius: size / 2 - 2 }]}>
        <Text style={[styles.initials, { fontSize: size * 0.36 }]}>{initials}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderWidth: 1.5,
    borderColor: lumen.hairline,
    padding: 2,
    backgroundColor: 'rgba(234,243,228,0.06)',
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: lumen.bgLight,
  },
  initials: {
    ...sora('bold'),
    color: lumen.lime,
    letterSpacing: -0.5,
  },
});
