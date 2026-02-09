import type { User } from './auth.types';
import type { BoardBase, BoardRole, Card } from './board.types';

export const NOTIFICATION_TYPES = ['BOARD_MEMBER_ADDED'] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export type NotificationPayloadMap = {
  BOARD_MEMBER_ADDED: {
    role: BoardRole;
  };
};

export type Notification<T extends NotificationType = NotificationType> = {
  id: string;
  type: T;
  isRead: boolean;
  createdAt: string;

  triggeredBy: User;

  board?: BoardBase;
  card?: Card;

  payload: NotificationPayloadMap[T];
};
