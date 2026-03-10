import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight02Icon } from '@hugeicons/core-free-icons';

import { formatDate, roleToLabel } from '@/lib/utils';

import { APP_ROUTES } from '@/config/appRoutes';

import type { Notification } from '@/types/notification.types';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
  UserFullNameLink,
  BoardTitleLink,
} from '@/components/notifications/FloatingNotificationCard';

type NotificationBodyProps = {
  notification: Notification;
};

const NotificationBody = ({ notification }: NotificationBodyProps) => {
  switch (notification.type) {
    case 'BOARD_MEMBER_ADDED':
      return (
        <BoardMemberBody
          notification={notification}
          actionText="added you to the board"
          roleText={`Role: ${roleToLabel(notification.payload?.role)}`}
        />
      );
    case 'BOARD_MEMBER_REMOVED':
      return (
        <BoardMemberBody
          notification={notification}
          actionText="removed you from the board"
        />
      );
    case 'BOARD_MEMBER_ROLE_UPDATED':
      return (
        <BoardMemberBody
          notification={notification}
          actionText="updated your role on the board"
          roleText={`New role: ${roleToLabel(notification.payload?.role)}`}
        />
      );
    case 'CARD_ASSIGNED':
      return <CardAssignedBody notification={notification} />;
    default:
      return null;
  }
};

const BoardMemberBody = ({
  notification,
  actionText,
  roleText,
}: {
  notification: Notification;
  actionText: string;
  roleText?: string;
}) => {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm">
        <UserFullNameLink user={notification.triggeredBy} /> {actionText}{' '}
        <BoardTitleLink board={notification.board} />
      </p>
      {roleText && (
        <Badge variant="secondary" className="w-fit">
          {roleText}
        </Badge>
      )}
    </div>
  );
};

const CardAssignedBody = ({ notification }: { notification: Notification }) => {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm">
        <UserFullNameLink user={notification.triggeredBy} /> assigned a card to
        you on board <BoardTitleLink board={notification.board} />
      </p>

      {notification.card && (
        <div className="bg-muted/50 mt-1 flex items-center justify-between gap-2 rounded-lg border px-3 py-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">
              {notification.card.title}
            </span>
            {notification.card.dueDate && (
              <span className="text-muted-foreground text-xs">
                Due {formatDate(notification.card.dueDate)}
              </span>
            )}
          </div>

          <Button
            variant="link"
            render={
              <Link
                to={APP_ROUTES.CARD_DETAILS(
                  notification.board!.id,
                  notification.card!.id,
                )}
              >
                View Card
                <HugeiconsIcon icon={ArrowRight02Icon} />
              </Link>
            }
            nativeButton={false}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationBody;
