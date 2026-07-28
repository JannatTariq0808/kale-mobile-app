import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuthSession } from '../../hooks/useAuthSession';
import { useAppNotifications } from '../../hooks/useAppNotifications';
import { lumen } from '../../theme';
import { NotificationsPanel } from './NotificationsPanel';

type NotificationBellButtonProps = {
  size?: number;
};

export function NotificationBellButton({ size = 36 }: NotificationBellButtonProps) {
  const { user } = useAuthSession();
  const { items, loading, unreadCount, markAllRead, markRead } = useAppNotifications(user?.uid);
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const handleOpen = () => {
    void markAllRead();
  };

  const handlePressItem = (item: (typeof items)[number]) => {
    void markRead(item.id);
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={
          unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'
        }
        style={({ pressed }) => [styles.button, { width: size, height: size }, pressed && styles.pressed]}
      >
        <Ionicons name="notifications-outline" size={Math.round(size * 0.52)} color={lumen.fg} />
        {unreadCount > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
          </View>
        ) : null}
      </Pressable>

      <NotificationsPanel
        visible={open}
        loading={loading}
        items={items}
        onClose={() => setOpen(false)}
        onOpen={handleOpen}
        onPressItem={handlePressItem}
      />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: lumen.hairline,
    backgroundColor: 'rgba(234,243,228,0.04)',
  },
  pressed: {
    opacity: 0.86,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: lumen.coral,
    borderWidth: 1.5,
    borderColor: lumen.bgDeep,
  },
  badgeText: {
    color: lumen.fg,
    fontSize: 9,
    fontWeight: '800',
    lineHeight: 11,
  },
});
