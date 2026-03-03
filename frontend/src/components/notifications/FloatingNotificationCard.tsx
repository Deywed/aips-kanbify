import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';

import { getUserFullName, roleToLabel } from '@/lib/utils';
import { navigateTo } from '@/lib/navigation';

import { APP_ROUTES } from '@/config/appRoutes';

import type { BoardBase } from '@/types/board.types';
import type { User } from '@/types/auth.types';
import type { Notification } from '@/types/notification.types';

import { Button } from '@/components/ui/button';

import BoardMemberNotification from './BoardMemberNotification';
import CardAssignedNotification from './CardAssignedNotification';

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
    case 'CARD_ASSIGNED':
      return <CardAssignedNotification notification={notification} />;
    default:
      return null;
  }
};

export const UserFullNameLink = ({ user }: { user: User }) => (
  <span
    className="hover:text-primary cursor-pointer font-bold underline-offset-4 hover:underline"
    onClick={() => navigateTo(APP_ROUTES.USER_DETAILS(user.id))}
  >
    {getUserFullName(user)}
  </span>
);

export const BoardTitleLink = ({ board }: { board?: BoardBase }) => (
  <span
    className="hover:text-primary cursor-pointer font-bold underline-offset-4 hover:underline"
    onClick={() => navigateTo(APP_ROUTES.BOARD_DETAILS(board?.id ?? ''))}
  >
    {board?.title}
  </span>
);

export default FloatingNotificationCard;
