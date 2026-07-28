import {
  arrayUnion,
  collection,
  doc,
  limit,
  onSnapshot,
  query,
  updateDoc,
  where,
  type Timestamp,
} from 'firebase/firestore';
import { isFirebaseConfigured } from '../../config/firebase';
import type { AppNotification } from '../../types/appNotification';
import { getFirebaseFirestore } from '../auth/firebaseApp';

const NOTIFICATIONS_LIMIT = 50;

function readTimestamp(value: unknown): Date | null {
  if (!value || typeof value !== 'object') return null;
  const ts = value as Timestamp;
  if (typeof ts.toDate !== 'function') return null;
  return ts.toDate();
}

function parseNotification(id: string, data: Record<string, unknown>, uid: string): AppNotification | null {
  const title = typeof data.title === 'string' ? data.title.trim() : '';
  const message = typeof data.message === 'string' ? data.message.trim() : '';
  if (!title && !message) return null;

  const targetedUsers = Array.isArray(data.targetedUsers)
    ? data.targetedUsers.filter((entry): entry is string => typeof entry === 'string')
    : [];
  if (!targetedUsers.includes(uid)) return null;

  const seenBy = Array.isArray(data.seen_by)
    ? data.seen_by.filter((entry): entry is string => typeof entry === 'string')
    : [];

  return {
    id,
    title: title || 'Notification',
    message,
    type: typeof data.type === 'string' ? data.type : 'general',
    targetedUsers,
    seenBy,
    createdAt: readTimestamp(data.created_at),
    unread: !seenBy.includes(uid),
  };
}

export function subscribeAppNotifications(
  uid: string,
  onChange: (notifications: AppNotification[]) => void,
  onError?: (error: Error) => void,
): () => void {
  if (!isFirebaseConfigured()) {
    onChange([]);
    return () => undefined;
  }

  const db = getFirebaseFirestore();
  const notificationsQuery = query(
    collection(db, 'notifications'),
    where('targetedUsers', 'array-contains', uid),
    limit(NOTIFICATIONS_LIMIT),
  );

  return onSnapshot(
    notificationsQuery,
    (snapshot) => {
      const items = snapshot.docs
        .map((entry) => parseNotification(entry.id, entry.data() as Record<string, unknown>, uid))
        .filter((item): item is AppNotification => item != null)
        .sort((a, b) => {
          const aTime = a.createdAt?.getTime() ?? 0;
          const bTime = b.createdAt?.getTime() ?? 0;
          return bTime - aTime;
        });
      onChange(items);
    },
    (error) => {
      if (__DEV__) {
        console.warn('[notifications] subscription failed:', error.message);
      }
      onError?.(error);
      onChange([]);
    },
  );
}

export async function markNotificationsRead(uid: string, notificationIds: string[]): Promise<void> {
  if (!notificationIds.length || !isFirebaseConfigured()) return;

  const db = getFirebaseFirestore();
  await Promise.all(
    notificationIds.map((notificationId) =>
      updateDoc(doc(db, 'notifications', notificationId), {
        seen_by: arrayUnion(uid),
      }),
    ),
  );
}
