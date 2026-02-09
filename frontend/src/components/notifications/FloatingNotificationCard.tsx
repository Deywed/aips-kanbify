import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';

import { roleToLabel } from '@/lib/utils';

import type { Notification } from '@/types/notification.types';

import { Button } from '@/components/ui/button';

import BoardMemberNotification from './BoardMemberNotification';

type FloatingNotificationCardProps = {
  notification: Notification;
  onDismiss: () => void;
};

const FloatingNotificationCard = ({
  notification,
  onDismiss,
}: FloatingNotificationCardProps) => {
  return (
    <div className="bg-card relative flex flex-col gap-2 rounded-xl border p-4 shadow-xl">
      <NotificationBaseBody notification={notification} />

      <Button
        variant="secondary"
        size="icon-xs"
        className="absolute -top-2 -left-2"
        onClick={onDismiss}
      >
        <HugeiconsIcon icon={Cancel01Icon} />
      </Button>
    </div>
  );
};

type NotificationBaseBodyProps = {
  notification: Notification;
};

const NotificationBaseBody = ({ notification }: NotificationBaseBodyProps) => {
  switch (notification.type) {
    case 'BOARD_MEMBER_ADDED':
      return (
        <BoardMemberNotification
          notification={notification}
          actionText="added you to the board"
          roleText={`with role ${roleToLabel(notification.payload?.role)}`}
        />
      );
    case 'BOARD_MEMBER_REMOVED':
      return (
        <BoardMemberNotification
          notification={notification}
          actionText="removed you from the board"
        />
      );
    case 'BOARD_MEMBER_ROLE_UPDATED':
      return (
        <BoardMemberNotification
          notification={notification}
          actionText="updated your role on the board"
          roleText={`to ${roleToLabel(notification.payload?.role)}`}
        />
      );
    default:
      return null;
  }
};

export default FloatingNotificationCard;
