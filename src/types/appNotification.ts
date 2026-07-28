export type AppNotification = {
  id: string;
  title: string;
  message: string;
  type: string;
  targetedUsers: string[];
  seenBy: string[];
  createdAt: Date | null;
  unread: boolean;
};
