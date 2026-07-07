// Design: kale-mobile-design — LumHeader profile (screens/KaleLumenApp.jsx)

import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { profileInitials } from '../../utils/profileInitials';
import { lumen, sora } from '../../theme';

type ProfileAvatarProps = {
  name?: string;
  initials?: string;
  photoUrl?: string | null;
  size?: number;
  onPress?: () => void;
  showEditBadge?: boolean;
};

export function ProfileAvatar({
  name = '',
  initials,
  photoUrl,
  size = 36,
  onPress,
  showEditBadge = false,
}: ProfileAvatarProps) {
  const label = initials ?? profileInitials(name);
  const borderRadius = size / 2;
  const fontSize = Math.max(12, Math.round(size * 0.36));
  const hasPhoto = Boolean(photoUrl?.trim());

  const avatar = hasPhoto ? (
    <Image
      source={{ uri: photoUrl! }}
      style={[styles.image, { width: size, height: size, borderRadius }]}
    />
  ) : (
    <View
      style={[
        styles.fallback,
        {
          width: size,
          height: size,
          borderRadius,
        },
      ]}
    >
      <Text style={[styles.initials, { fontSize }]}>{label}</Text>
    </View>
  );

  const badgeSize = Math.max(24, Math.round(size * 0.32));
  const badgeIconSize = Math.max(11, Math.round(badgeSize * 0.46));

  const content = (
    <View style={[styles.wrap, { width: size, height: size }]}>
      {avatar}
      {showEditBadge ? (
        <View
          style={[
            styles.editBadge,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              right: Math.round(size * 0.02),
              bottom: Math.round(size * 0.02),
            },
          ]}
        >
          <Ionicons name="camera-outline" size={badgeIconSize} color={lumen.fg} />
        </View>
      ) : null}
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Change profile photo"
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  image: {
    borderWidth: 1.5,
    borderColor: lumen.hairline,
  },
  fallback: {
    borderWidth: 1.5,
    borderColor: lumen.hairline,
    backgroundColor: 'rgba(0,200,150,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    ...sora('extrabold'),
    color: lumen.mint,
    letterSpacing: -0.5,
  },
  editBadge: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(8, 43, 37, 0.92)',
    borderWidth: 1.5,
    borderColor: lumen.hairline,
  },
  pressed: {
    opacity: 0.88,
  },
});
