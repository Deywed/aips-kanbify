import type { User } from './auth.types';
import type { BoardBase, BoardRole, Card } from './board.types';

export const NOTIFICATION_TYPES = [
  'BOARD_MEMBER_ADDED',
  'BOARD_MEMBER_REMOVED',
  'BOARD_MEMBER_ROLE_UPDATED',
  'CARD_ASSIGNED',
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export type NotificationPayloadMap = {
  BOARD_MEMBER_ADDED: {
    role: BoardRole;
  };
  BOARD_MEMBER_REMOVED: null;
  BOARD_MEMBER_ROLE_UPDATED: {
    role: BoardRole;
  };
  CARD_ASSIGNED: null;
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
