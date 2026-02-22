import type { Notification } from '@/types/notification.types';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight02Icon } from '@hugeicons/core-free-icons';

import { navigateTo } from '@/lib/navigation';
import { formatDate } from '@/lib/utils';

import { APP_ROUTES } from '@/config/appRoutes';

import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/common/UserAvatar';

import { BoardTitleLink, UserFullNameLink } from './FloatingNotificationCard';

type CardAssignedNotificationProps = {
  notification: Notification;
};

const CardAssignedNotification = ({
  notification,
}: CardAssignedNotificationProps) => {
  return (
    <>
      <div className="flex gap-2">
        <UserAvatar user={notification.triggeredBy} size={10} />
        <div>
          <UserFullNameLink user={notification.triggeredBy} /> assigned new card
          to you on board <BoardTitleLink board={notification.board} />
        </div>
      </div>

      <div className="flex flex-col">
        <span className="text-muted-foreground">
          {notification.card?.title}
        </span>

        {notification.card?.dueDate && (
          <span className="text-muted-foreground text-sm">
            Due {formatDate(notification.card.dueDate)}
          </span>
        )}

        <Button
          variant="link"
          size="sm"
          className="ml-auto"
          onClick={() =>
            navigateTo(
              APP_ROUTES.CARD_DETAILS(
                notification.board!.id,
                notification.card!.id,
              ),
            )
          }
        >
          View Card
          <HugeiconsIcon icon={ArrowRight02Icon} />
        </Button>
      </div>
    </>
  );
};

export default CardAssignedNotification;
