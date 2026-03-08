import {
  UserGroup02Icon,
  UserRemove02Icon,
  UserSwitchIcon,
  TaskAdd01Icon,
} from '@hugeicons/core-free-icons';

import type { NotificationType } from '@/types/notification.types';

export const notificationMeta: Record<
  NotificationType,
  { label: string; icon: typeof UserGroup02Icon }
> = {
  BOARD_MEMBER_ADDED: {
    label: 'Member Added',
    icon: UserGroup02Icon,
  },
  BOARD_MEMBER_REMOVED: {
    label: 'Member Removed',
    icon: UserRemove02Icon,
  },
  BOARD_MEMBER_ROLE_UPDATED: {
    label: 'Role Updated',
    icon: UserSwitchIcon,
  },
  CARD_ASSIGNED: {
    label: 'Card Assigned',
    icon: TaskAdd01Icon,
  },
};
