import { useEffect, useMemo, useState } from 'react';
import {
  markNotificationsRead,
  subscribeAppNotifications,
} from '../services/notifications/appNotifications';
import type { AppNotification } from '../types/appNotification';

export function useAppNotifications(uid: string | undefined) {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(Boolean(uid));

  useEffect(() => {
    if (!uid) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeAppNotifications(
      uid,
      (nextItems) => {
        setItems(nextItems);
        setLoading(false);
      },
      () => {
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [uid]);

  const unreadCount = useMemo(() => items.filter((item) => item.unread).length, [items]);

  const markAllRead = async () => {
    if (!uid) return;
    const unreadIds = items.filter((item) => item.unread).map((item) => item.id);
    if (!unreadIds.length) return;
    await markNotificationsRead(uid, unreadIds);
  };

  const markRead = async (notificationId: string) => {
    if (!uid) return;
    const target = items.find((item) => item.id === notificationId);
    if (!target?.unread) return;
    await markNotificationsRead(uid, [notificationId]);
  };

  return {
    items,
    loading,
    unreadCount,
    markAllRead,
    markRead,
  };
}
