import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { AppNotification } from '../../types/appNotification';
import { formatNotificationTime } from '../../utils/formatNotificationTime';
import { lumen, sora } from '../../theme';

type NotificationsPanelProps = {
  visible: boolean;
  loading: boolean;
  items: AppNotification[];
  onClose: () => void;
  onOpen: () => void;
  onPressItem: (item: AppNotification) => void;
};

export function NotificationsPanel({
  visible,
  loading,
  items,
  onClose,
  onOpen,
  onPressItem,
}: NotificationsPanelProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} onShow={onOpen}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.panel, { marginTop: insets.top + 52 }]}
          onPress={(event) => event.stopPropagation()}
        >
          <View style={styles.headerRow}>
            <Text style={styles.title}>Notifications</Text>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close notifications"
              hitSlop={8}
            >
              <Ionicons name="close" size={20} color={lumen.fgMuted} />
            </Pressable>
          </View>

          {loading ? (
            <View style={styles.loaderWrap}>
              <ActivityIndicator color={lumen.lime} />
            </View>
          ) : items.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Ionicons name="notifications-outline" size={28} color={lumen.fgFaint} />
              <Text style={styles.emptyTitle}>No notifications yet</Text>
              <Text style={styles.emptyCopy}>
                Assessment reminders and updates from Kale will show up here.
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.list}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            >
              {items.map((item, index) => (
                <Pressable
                  key={item.id}
                  style={[
                    styles.item,
                    item.unread ? styles.itemUnread : null,
                    index === items.length - 1 ? styles.itemLast : null,
                  ]}
                  onPress={() => onPressItem(item)}
                  accessibilityRole="button"
                >
                  <View style={styles.itemTopRow}>
                    <Text style={styles.itemTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    {item.unread ? <View style={styles.unreadDot} /> : null}
                  </View>
                  {item.message ? (
                    <Text style={styles.itemMessage} numberOfLines={3}>
                      {item.message}
                    </Text>
                  ) : null}
                  {item.createdAt ? (
                    <Text style={styles.itemTime}>{formatNotificationTime(item.createdAt)}</Text>
                  ) : null}
                </Pressable>
              ))}
            </ScrollView>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(4, 20, 18, 0.72)',
    paddingHorizontal: 16,
  },
  panel: {
    alignSelf: 'stretch',
    maxHeight: '72%',
    backgroundColor: '#0A3F3A',
    borderWidth: 1,
    borderColor: lumen.hairline,
    borderRadius: 18,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: lumen.hairline,
  },
  title: {
    ...sora('bold'),
    color: lumen.fg,
    fontSize: 16,
  },
  loaderWrap: {
    paddingVertical: 36,
    alignItems: 'center',
  },
  emptyWrap: {
    paddingHorizontal: 20,
    paddingVertical: 28,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    ...sora('bold'),
    color: lumen.fg,
    fontSize: 15,
    marginTop: 4,
  },
  emptyCopy: {
    ...sora('regular'),
    color: lumen.fgMuted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  list: {
    maxHeight: 420,
  },
  listContent: {
    paddingVertical: 6,
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(234,243,228,0.06)',
  },
  itemLast: {
    borderBottomWidth: 0,
  },
  itemUnread: {
    backgroundColor: 'rgba(204,250,125,0.04)',
  },
  itemTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  itemTitle: {
    ...sora('bold'),
    color: lumen.fg,
    fontSize: 14,
    lineHeight: 19,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: lumen.lime,
    marginTop: 5,
  },
  itemMessage: {
    ...sora('regular'),
    color: lumen.fgMuted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  itemTime: {
    ...sora('regular'),
    color: lumen.fgFaint,
    fontSize: 11,
    marginTop: 8,
  },
});
